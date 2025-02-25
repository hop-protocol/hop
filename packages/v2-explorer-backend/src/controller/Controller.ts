import { BigNumber, utils } from 'ethers'
import { DateTime } from 'luxon'
import { db } from '#db/index.js'
import { Hop, RailsGateway } from '@hop-protocol/v2-sdk'
import { pgDb } from '#pgDb/index.js'
import { truncateString } from '#utils/truncateString.js'
import { chainNames, network, rpcUrls } from '#config/index.js'
import { formatToUSD } from '#utils/formatToUSD.js'

const { formatUnits, getAddress: ethersChecksumAddress } = utils

const sdkCache = new Map<string, any>()
const cachedItems = new Map<string, any[]>()

function getChainLabel(chainId: string) {
  const chainName = chainNames[chainId] ?? ''
  if (!chainName) {
    return `${chainId}`
  }
  return `${chainId} - ${chainName}`
}

function checksumAddress (address: string) {
  try {
    return ethersChecksumAddress(address)
  } catch (err) {
    return address
  }
}

type EventsResult = {
  items: any[]
  hasNextPage?: boolean
}

type EventsApiInput = {
  eventName: string
  limit?: number
  page?: number | null
  filter: any
}

type PathsApiInput = {
  limit?: number
  page?: number | null
  filter: any
}

type TokensApiInput = {
  limit?: number
  page?: number | null
  filter: any
}

type TransferVolumeStatsApiInput = {
  startTimestamp?: number
  endTimestamp?: number
  filter?: any
}

type TransferVolumeStatsApiResult = {
  totalVolume: {
    totalUsd: number
    totalUsdDisplay: string
  }
  tokenVolumes: Record<string, {
    totalUsd: number
    totalUsdDisplay: string
  }>
}

export class Controller {
  db: any = db
  pgDb = pgDb
  events: any
  sdk: Hop

  constructor () {
    this.sdk = new Hop({
      network: network,
      signersOrProviders: Hop.getDefaultProviders(network)
    })
    this.sdk.setProviderUrls(rpcUrls)
    // console.log(this.sdk.chainProviders)
  }

  async getEventsForApi (input: EventsApiInput): Promise<EventsResult> {
    const { eventName, limit = 10, page = 1 } = input
    const filter = this.normalizeFilters(input.filter)

    const { items, hasNextPage } = await this.getEvents({ eventName, limit, page, filter })

    return {
      items: items.map((item: any) => this.normalizeEventForApi(item)),
      hasNextPage
    }
  }

  async getEvents (input: any): Promise<any> {
    const { eventName, limit = 10, page = 1 } = input
    const filter = this.normalizeFilters(input.filter)

    if (!this.pgDb.events[eventName]) {
      throw new Error(`Event ${eventName} not found`)
    }

    const items = await this.pgDb.events[eventName].getItems({ limit, filter, page })
    const itemsNext = await this.pgDb.events[eventName].getItems({ limit, filter, page: Number(page) + 1 })
    const hasNextPage = itemsNext.length > 0
    console.log('getEvents', eventName, items.length, limit, page)

    return {
      items: items.map((item: any) => this.normalizeEventForApi(item)),
      hasNextPage
    }
  }

  async getMessengerExplorerEventsForApi(input: any): Promise<any> {
    const { limit = 10, page } = input
    const filter = this.normalizeFilters(input.filter)

    const { items, hasNextPage } = await this.getEvents({ limit, filter, eventName: 'MessageSent', page })
    const explorerItems = await Promise.all(items.map(async (item: any) => {
      const { messageId } = item
      const messageExecutedPromise = this.getEvents({
        eventName: 'MessageExecuted',
        filter: { messageId }
      })

      const [messageExecuted] = await Promise.all([messageExecutedPromise])

      item.messageExecutedEvent = messageExecuted.items.length > 0 ? messageExecuted.items[0] : null
      return this.normalizeEventForApi(item)
    }))

    return { items: explorerItems, hasNextPage }
  }

  async getBondedEventsForTransferId(
    transferId: string,
    processedIds = new Set<string>()
  ): Promise<any[]> {
    // Check if this transferId has already been processed
    if (processedIds.has(transferId)) {
      return []
    }

    if (cachedItems.has(transferId)) {
      return cachedItems.get(transferId)!
    }

    // Mark the current transferId as processed
    processedIds.add(transferId)

    const bondedEvents: any[] = []

    // Fetch the bond event for the current transferId (as claimId in TransferBonded)
    const bondEvents = await this.getEvents({
      eventName: 'TransferBonded',
      filter: { claimId: transferId }
    })

    // Add bond events to the result array
    bondEvents.items.forEach((bondEvent: any) => {
      bondEvent.token = bondEvent.counterpartToken
      bondedEvents.push(this.normalizeEventForApi(bondEvent))
    })

    if (!bondEvents.items.length) {
      return bondedEvents
    }

    const transactionHash = bondEvents.items[0]?.context?.transactionHash

    // Now fetch the new TransferSent event created by each bond event, if any, using its transactionHash
    const transferSentEvents = await this.getEvents({
      eventName: 'TransferSent',
      filter: { transactionHash }
    })

    for (const transferSentEvent of transferSentEvents.items) {
      const newTransferId = transferSentEvent.transferId

      // Fetch bond events for each subsequent hop in the chain
      const hopBondedEvents = await this.getBondedEventsForTransferId(newTransferId, processedIds)

      // Add the hop-bonded events to the result list
      bondedEvents.push(...hopBondedEvents)
    }

    cachedItems.set(transferId, bondedEvents)

    return bondedEvents
  }

  // Rails Gateway
  async getExplorerEventsForApi (input: any): Promise<any> {
    const { limit = 10, page } = input
    const filter = this.normalizeFilters(input.filter)

    const { items, hasNextPage } = await this.getEvents({ limit, filter, eventName: 'TransferSent', page })

    const promises = items.map(async (item: any) => {
      const { transferId, context: { transactionHash } } = item
      // const bondedEvents  = await this.getEvents({
      //   eventName: 'TransferBonded',
      //   filter: {
      //     claimId: transferId
      //   }
      // })

      // Get all bonded events for the current transferId, following all hops
      const bondedEvents = await this.getBondedEventsForTransferId(transferId)
      item.transferBondedEvents = []

      try {
        await this.upsertPathInfoIfNotExists(item)
        await this.upsertTokenInfoIfNotExists(item)

        const [pathInfo] = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId, chainId: item.context.chainId }})
        if (pathInfo) {
          const [tokenInfo] = await this.pgDb.nonEventTables.Token.getItems({ filter: { chainId: item.context.chainId, address: pathInfo.token }})
          if (tokenInfo) {
            const tokenPrice = await this.pgDb.priceTable.getClosestPrice(tokenInfo.symbol, item.context.blockTimestamp)
            item.tokenPriceUsd = tokenPrice?.priceUsd
            const ethPrice = await this.pgDb.priceTable.getClosestPrice('ETH', item.context.blockTimestamp)
            item.ethPriceUsd = ethPrice?.priceUsd
          }
        }

        item.transferBondedEvents = bondedEvents.map((eventItem: any) => {
          eventItem.token = item.counterpartToken
          eventItem.tokenPriceUsd = item.tokenPriceUsd
          eventItem.ethPriceUsd = item.ethPriceUsd
          return this.normalizeEventForApi(eventItem)
        })

        const chainIdHops: string[] = []
        let chainId = item.context.chainId
        for (const hop of item.hops) {
          const hopPathId = hop.pathId
          let [hopPathInfo] = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: hopPathId, chainId: chainId }})
          if (!hopPathInfo) {
            await this.upsertPathInfoIfNotExists({
              pathId: hopPathId,
              context: {
                chainId
              }
            })
          }
          ([hopPathInfo] = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: hopPathId, chainId: chainId }}))
          if (hopPathInfo) {
            if (chainId === hopPathInfo.chainId) {
              chainId = hopPathInfo.counterpartChainId
            } else {
              chainId = hopPathInfo.chainId
            }
            chainIdHops.push(chainId)
          }
        }

        item.toChainId = chainIdHops[chainIdHops.length - 1]
      } catch (err: any) {
        console.error(`getExplorerEventsForApi, filter: ${JSON.stringify(filter)}, error: ${err.message}`)
      }

      return this.normalizeEventForApi(item)
    })

    const explorerItems = await Promise.all(promises)

    return {
      items: explorerItems.map((item: any) => this.normalizeEventForApi(item)),
      hasNextPage
    }
  }

  getRailsGateway(chainId: string): RailsGateway {
    if (!sdkCache.has(chainId)) {
      sdkCache.set(chainId, this.sdk.getRailsGateway(chainId))
    }
    return sdkCache.get(chainId)
  }

  async upsertPathInfoIfNotExists (item: any) {
    if (!item.toChainId && item.pathId) {
      let pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId, chainId: item.context.chainId }})
      let pathInfo = pathInfos?.[0]
      if (!pathInfo) {
        pathInfo = await this.getRailsGateway(item.context.chainId).getPathInfo({ pathId: item.pathId })
        await this.pgDb.nonEventTables.Path.upsertItem({
          pathId: pathInfo.pathId,
          chainId: pathInfo.chainId,
          token: pathInfo.token,
          counterpartToken: pathInfo.counterpartToken,
          counterpartChainId: pathInfo.counterpartChainId
        })
      }

      pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId, chainId: item.context.chainId }})
      pathInfo = pathInfos?.[0]
      if (!pathInfo) {
        throw new Error(`Path not found for pathId ${item.pathId}, chainId ${item.context.chainId}`)
      }

      item.toChainId = pathInfo.counterpartChainId
    }

    if (item.toChainId && item.pathId) {
      let pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId, chainId: item.toChainId }})
      let pathInfo = pathInfos?.[0]
      if (!pathInfo) {
        pathInfo = await this.getRailsGateway(item.toChainId).getPathInfo({ pathId: item.pathId })
        await this.pgDb.nonEventTables.Path.upsertItem({
          pathId: pathInfo.pathId,
          chainId: pathInfo.chainId,
          token: pathInfo.token,
          counterpartToken: pathInfo.counterpartToken,
          counterpartChainId: pathInfo.counterpartChainId
        })
      }

      pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId, chainId: item.toChainId }})
      pathInfo = pathInfos?.[0]
      if (!pathInfo) {
        throw new Error(`Path not found for pathId ${item.pathId}, chainId ${item.context.chainId}`)
      }
    }

    return item
  }

  async upsertTokenInfoIfNotExists (item: any) {
    if (!item.token && item.pathId) {
      const pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId, chainId: item.context.chainId }})
      const pathInfo = pathInfos?.[0]
      if (!pathInfo) {
        throw new Error(`Path not found for pathId ${item.pathId}, chainId ${item.context.chainId}`)
      }

      const { token: tokenAddress, chainId } = pathInfo

      let tokenInfos = await this.pgDb.nonEventTables.Token.getItems({ filter: { chainId, address: tokenAddress }})
      let tokenInfo = tokenInfos?.[0]
      if (!tokenInfo) {
        tokenInfo = await this.getRailsGateway(chainId).getTokenInfo({ address: tokenAddress })
        await this.pgDb.nonEventTables.Token.upsertItem({
          chainId: tokenInfo.chainId,
          address: tokenInfo.address,
          name: tokenInfo.name,
          symbol: tokenInfo.symbol,
          decimals: tokenInfo.decimals
        })
      }

      tokenInfos = await this.pgDb.nonEventTables.Token.getItems({ filter: { chainId, address: tokenAddress }})
      tokenInfo = tokenInfos?.[0]
      if (!tokenInfo) {
        throw new Error(`Token not found for token ${item.token}, chainId ${chainId}`)
      }

      item.token = tokenInfo
    }

    if (!item.counterpartToken && item.pathId) {
      const pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId, chainId: item.toChainId }})
      const pathInfo = pathInfos?.[0]
      if (!pathInfo) {
        throw new Error(`Path not found for pathId ${item.pathId}, chainId ${item.toChainId}`)
      }

      const { counterpartChainId, counterpartToken: counterpartTokenAddress } = pathInfo

      let tokenInfos = await this.pgDb.nonEventTables.Token.getItems({ filter: { chainId: counterpartChainId, address: counterpartTokenAddress }})
      let tokenInfo = tokenInfos?.[0]
      if (!tokenInfo) {
        tokenInfo = await this.getRailsGateway(counterpartChainId).getTokenInfo({ address: counterpartTokenAddress })
        await this.pgDb.nonEventTables.Token.upsertItem({
          chainId: tokenInfo.chainId,
          address: tokenInfo.address,
          name: tokenInfo.name,
          symbol: tokenInfo.symbol,
          decimals: tokenInfo.decimals
        })
      }

      tokenInfos = await this.pgDb.nonEventTables.Token.getItems({ filter: { chainId: counterpartChainId, address: counterpartTokenAddress }})
      tokenInfo = tokenInfos?.[0]
      if (!tokenInfo) {
        throw new Error(`Token not found for token ${item.token}, chainId ${counterpartChainId}`)
      }

      item.counterpartToken = tokenInfo
    }

    return item
  }

  addEventFields(item: any) {
    if (!item) return item

    const fieldsToTruncate = [
      'messageId', 'checkpoint', 'transferId', 'claimId', 'headClaimId',
      'pathId', 'bundleId', 'bundleRoot', 'attestedClaimId', 'relayer',
      'from', 'to', 'bonder'
    ]
    fieldsToTruncate.forEach(field => {
      if (item[field]) {
        item[`${field}Truncated`] = truncateString(item[field], 4)
      }
    })

    if (item.transferId) {
      item.transferIdExplorerUrl = `https://v2-explorer.hop.exchange/t/${item.transferId}` // TODO: subdomain env var
    }
    if (item.pathId) {
      item.pathIdTruncated = truncateString(item.pathId, 4)
    }
    if (item.claimId ) {
      item.claimIdExplorerUrl = `https://v2-explorer.hop.exchange/t/${item.claimId}` // TODO: subdomain env var
    }
    if (item.headClaimId ) {
      item.headClaimIdExplorerUrl = `https://v2-explorer.hop.exchange/t/${item.headClaimId}` // TODO: subdomain env var
      item.headClaimIdTruncated = truncateString(item.headClaimId, 4)
    }
    if (item.to) {
      if (item.toChainId) {
        item.toExplorerUrl = this.sdk.utils.getAddressExplorerUrl(item.to, item.toChainId)
      }
      if (!item.toChainId && item.context?.chainId) {
        item.toExplorerUrl = this.sdk.utils.getAddressExplorerUrl(item.to, item.context.chainId)
      }
    }
    if (item.chainId) {
      item.chainName = chainNames[item.chainId]
      item.chainLabel = getChainLabel(item.chainId)
    }
    if (item.fromChainId) {
      item.fromChainName = chainNames[item.fromChainId]
      item.fromChainLabel = getChainLabel(item.fromChainId)
      item.fromChainImageUrl = this.sdk.utils.getLogoForChainId(item.fromChainId)
    }
    if (item.toChainId) {
      item.toChainName = chainNames[item.toChainId]
      item.toChainLabel = getChainLabel(item.toChainId)
      item.toChainImageUrl = this.sdk.utils.getLogoForChainId(item.toChainId)
      item.toChainColor = this.sdk.getColorForChainId(item.toChainId)
    }
    if (item.bundleFees) {
      item.bundleFeesDisplay = formatUnits(item.bundleFees, 18)
    }
    if (item.token?.address) {
      item.token.tokenExplorerUrl = this.sdk.utils.getTokenExplorerUrl(item.token.address, item.token.chainId)
    }
    if (item.token?.symbol) {
      item.token.imageUrl = this.sdk.utils.getLogoForTokenSymbol(item.token.symbol)
    }
    if (item.counterpartToken?.address) {
      item.counterpartToken.tokenExplorerUrl = this.sdk.utils.getTokenExplorerUrl(item.counterpartToken.address, item.counterpartToken.chainId)
    }
    if (item.amount != null && item.token) {
      item.amountFormatted = formatUnits(item.amount, item.token.decimals)
      item.amountDisplay = `${item.amountFormatted} ${item.token.symbol}`
    }
    if (item.amount != null && item.amountFormatted && item.tokenPriceUsd) {
      item.amountUsd = Number(item.amountFormatted) * Number(item.tokenPriceUsd)
      item.amountUsdDisplay = `${formatToUSD(item.amountUsd.toFixed(2))} USD`
    }
    if (item.amountOut != null && item.token) {
      item.amountOutFormatted = formatUnits(item.amountOut, item.token.decimals)
      item.amountOutDisplay = `${item.amountOutFormatted} ${item.token.symbol}`
    }
    if (item.amountOut != null && item.amountOutFormatted != null && item.tokenPriceUsd != null) {
      item.amountOutUsd = Number(item.amountOutFormatted) * Number(item.tokenPriceUsd)
      item.amountOutUsdDisplay = `${formatToUSD(item.amountOutUsd.toFixed(2))} USD`
    }
    if (item.sourcePool != null && item.token) {
      item.sourcePoolFormatted = formatUnits(item.sourcePool, item.token.decimals)
      item.sourcePoolDisplay = `${item.sourcePoolFormatted} ${item.token.symbol}`
    }
    if (item.sourcePool != null && item.sourcePoolFormatted != null && item.tokenPriceUsd != null) {
      item.sourcePoolUsd = Number(item.sourcePoolFormatted) * Number(item.tokenPriceUsd)
      item.sourcePoolUsdDisplay = `${formatToUSD(item.sourcePoolUsd.toFixed(2))} USD`
    }
    if (item.bonderFee != null && item.token) {
      item.bonderFeeFormatted = formatUnits(item.bonderFee, item.token.decimals)
      item.bonderFeeDisplay = `${item.bonderFeeFormatted} ${item.token.symbol}`
    }
    if (item.bonderFee != null && item.bonderFeeFormatted != null && item.tokenPriceUsd != null) {
      item.bonderFeeUsd = Number(item.bonderFeeFormatted) * Number(item.tokenPriceUsd)
      item.bonderFeeUsdDisplay = `${formatToUSD(item.bonderFeeUsd.toFixed(2))} USD`
    }
    if (item.attestationFee != null) {
      item.attestationFeeFormatted = formatUnits(item.attestationFee, 18)
      item.attestationFeeDisplay = `${item.attestationFeeFormatted} ETH`
    }
    if (item.attestationFee != null && item.attestationFeeFormatted != null && item.ethPriceUsd != null) {
      item.attestationFeeUsd = Number(item.attestationFeeFormatted) * Number(item.ethPriceUsd)
      item.attestationFeeUsdDisplay = `${formatToUSD(item.attestationFeeUsd.toFixed(2))} USD`
    }
    if (item.nextHops) {
      item.nextHops = item.nextHops.map((item: any) => this.addEventFields(item))
    }
    if (item.hops) {
      item.hops = item.hops.map((item: any) => this.addEventFields(item))
    }
    if (item.minAmountOut) {
      item.minAmountOut = item.minAmountOut.toString()
    }
    if (item.minAmountOut != null && item.minAmountOutFormatted != null && item.tokenPriceUsd != null) {
      item.minAmountOutUsd = Number(item.minAmountOutFormatted) * Number(item.tokenPriceUsd)
      item.minAmountOutUsdDisplay = `${formatToUSD(item.minAmountOutUsd.toFixed(2))} USD`
    }
    // nextHops
    if (item.maxBonderFee) {
      item.maxBonderFee = item.maxBonderFee.toString()
    }
    if (item.maxTotalSent) {
      item.maxTotalSent = item.maxTotalSent.toString()
    }
    if (item.maxTotalSent != null && item.token) {
      item.maxTotalSentFormatted = formatUnits(item.maxTotalSent, item.token.decimals)
      item.maxTotalSentDisplay = `${item.maxTotalSentFormatted} ${item.token.symbol}`
    }
    if (item.maxTotalSent != null && item.maxTotalSentFormatted != null && item.tokenPriceUsd != null) {
      item.maxTotalSentUsd = Number(item.maxTotalSentFormatted) * Number(item.tokenPriceUsd)
      item.maxTotalSentUsdDisplay = `${formatToUSD(item.maxTotalSentUsd.toFixed(2))} USD`
    }
    if (item.context?.blockTimestamp) {
      item.context.blockTimestampRelative = DateTime.fromSeconds(item.context.blockTimestamp).toRelative()
    }
    if (item.context?.transactionHash) {
      item.context.transactionHashTruncated = truncateString(item.context.transactionHash, 4)
      item.context.transactionHashExplorerUrl = this.sdk.utils.getTransactionHashExplorerUrl(item.context.transactionHash, item.context.chainId)
    }
    if (item.context?.chainId) {
      item.context.chainName = chainNames[item.context.chainId]
      item.context.chainLabel = getChainLabel(item.context.chainId)
      item.context.chainImageUrl = this.sdk.utils.getLogoForChainId(item.context.chainId)
      item.context.chainColor = this.sdk.getColorForChainId(item.context.chainId)
    }
    if (item.context?.from) {
      if (item.context?.chainId) {
        item.context.fromExplorerUrl = this.sdk.utils.getAddressExplorerUrl(item?.context.from, item.context.chainId)
      }
    }
    if (item.context?.to) {
      if (item.context?.chainId) {
        item.context.toExplorerUrl = this.sdk.utils.getAddressExplorerUrl(item?.context.to, item.context.chainId)
      }
    }
    if (item.context?.value != null) {
      item.context.valueFormatted = formatUnits(item.context.value, 18)
      item.context.valueDisplay = `${item.context.valueFormatted} ETH`
    }
    if (item.context?.value != null && item.context?.valueFormatted != null && item.ethPriceUsd != null) {
      item.context.valueUsd = Number(item.context.valueFormatted) * Number(item.ethPriceUsd)
      item.context.valueUsdDisplay = `${formatToUSD(item.context.valueUsd.toFixed(2))} USD`
    }
    if (item.sendFee != null) {
      item.sendFeeFormatted = formatUnits(item.sendFee, 18)
      item.sendFeeDisplay = `${item.sendFeeFormatted} ETH`
    }
    if (item.messageFee != null) {
      item.messageFeeFormatted = formatUnits(item.messageFee, 18)
      item.messageFeeDisplay = `${item.messageFeeFormatted} ETH`
    }
    if (item.removeFee != null) {
      item.removeFeeFormatted = formatUnits(item.removeFee, 18)
      item.removeFeeDisplay = `${item.removeFeeFormatted} ETH`
    }
    if (item.updateFee != null) {
      item.updateFeeFormatted = formatUnits(item.updateFee, 18)
      item.updateFeeDisplay = `${item.updateFeeFormatted} ETH`
    }
    if (item.claimFeesFee != null) {
      item.claimFeesFeeFormatted = formatUnits(item.claimFeesFee, 18)
      item.claimFeesFeeDisplay = `${item.claimFeesFeeFormatted} ETH`
    }
    if (item.updatedFee != null) {
      item.updatedFeeFormatted = formatUnits(item.updatedFee, 18)
      item.updatedFeeDisplay = `${item.updatedFeeFormatted} ETH`
    }
    if (item.railsGatewayAddress) {
      item.railsGatewayAddressExplorerUrl = this.sdk.utils.getAddressExplorerUrl(item.railsGatewayAddress, item.context.chainId)
      item.railsGatewayAddressTruncated = truncateString(item.railsGatewayAddress, 4)
    }
    if (item.stakingRegistryAddress) {
      item.stakingRegistryAddressExplorerUrl = this.sdk.utils.getAddressExplorerUrl(item.stakingRegistryAddress, item.context.chainId)
      item.stakingRegistryAddressTruncated = truncateString(item.stakingRegistryAddress, 4)
    }
    if (item.hopToken) {
      item.hopTokenExplorerUrl = this.sdk.utils.getAddressExplorerUrl(item.hopToken, item.context.chainId)
      item.hopTokenTruncated = truncateString(item.hopToken, 4)
    }
    if (item.pathVault) {
      item.pathVaultExplorerUrl = this.sdk.utils.getAddressExplorerUrl(item.pathVault, item.context.chainId)
      item.pathVaultTruncated = truncateString(item.pathVault, 4)
    }
    if (item.totalClaims != null && item.token?.decimals != null) {
      item.totalClaimsFormatted = formatUnits(item.totalClaims, item.token.decimals)
      item.totalClaimsDisplay = `${item.totalClaimsFormatted} ${item.token.symbol}`
    }
    if (item.totalConfirmed != null && item.token?.decimals != null) {
      item.totalConfirmedFormatted = formatUnits(item.totalConfirmed, item.token.decimals)
      item.totalConfirmedDisplay = `${item.totalConfirmedFormatted} ${item.token.symbol}`
    }
    if (item.totalSent != null && item.token?.decimals != null) {
      item.totalSentFormatted = formatUnits(item.totalSent, item.token.decimals)
      item.totalSentDisplay = `${item.totalSentFormatted} ${item.token.symbol}`
    }
    if (item.minChallengeIncrease != null) {
      item.minChallengeIncreaseFormatted = formatUnits(item.minChallengeIncrease, 18)
      item.minChallengeIncreaseDisplay = `${item.minChallengeIncreaseFormatted} ETH`
    }
    if (item.fullAppeal != null) {
      item.fullAppealFormatted = formatUnits(item.fullAppeal, 18)
      item.fullAppealDisplay = `${item.fullAppealFormatted} ETH`
    }
    if (item.minHopStake != null) {
      item.minHopStakeFormatted = formatUnits(item.minHopStake, 18)
      item.minHopStakeDisplay = `${item.minHopStakeFormatted} HOP`
    }

    return item
  }

  normalizeEventForApi (event: any) {
    if (!event) {
      return event
    }
    event = this.addEventFields(event)
    for (const key in event) {
      if (BigNumber.isBigNumber(event[key])) {
        event[key] = event[key].toString()
      }
    }
    return event
  }

  async getPathsForApi (input: PathsApiInput): Promise<EventsResult> {
    const { limit = 10, page = 1 } = input
    const filter = this.normalizeFilters(input.filter)

    const items = await this.pgDb.nonEventTables.Path.getItems({ limit, filter, page })
    const itemsNext = await this.pgDb.nonEventTables.Path.getItems({ limit, filter, page: Number(page) + 1 })
    const hasNextPage = itemsNext.length > 0

    return {
      items: items.map((item: any) => this.addPathFields(item)),
      hasNextPage
    }
  }

  async getTokensForApi (input: TokensApiInput): Promise<EventsResult> {
    const { limit = 10, page = 1 } = input
    const filter = this.normalizeFilters(input.filter)

    const items = await this.pgDb.nonEventTables.Token.getItems({ limit, filter, page })
    const itemsNext = await this.pgDb.nonEventTables.Token.getItems({ limit, filter, page: Number(page) + 1 })
    const hasNextPage = itemsNext.length > 0

    return {
      items: items.map((item: any) => this.addTokenFields(item)),
      hasNextPage
    }
  }

  async getTokenPricesForApi (input: TokensApiInput): Promise<EventsResult> {
    const { limit = 10, page = 1 } = input
    const filter = this.normalizeFilters(input.filter)

    const items = await this.pgDb.priceTable.getItems({ limit, filter, page })
    const itemsNext = await this.pgDb.priceTable.getItems({ limit, filter, page: Number(page) + 1 })
    const hasNextPage = itemsNext.length > 0

    return {
      items: items.map((item: any) => this.addTokenPriceFields(item)),
      hasNextPage
    }
  }

  addTokenFields (item: any) {
    if (item.chainId && item.address) {
      try {
        item.tokenExplorerUrl = this.sdk.utils.getTokenExplorerUrl(item.address, item.chainId)
      } catch (err) {
        console.error(err)
        item.tokenExplorerUrl = ''
      }
      item.addressTruncated = truncateString(item.address, 4)
    }
    if (item.chainId) {
      item.chainName = chainNames[item.chainId] ?? ''
      item.chainLabel = getChainLabel(item.chainId)
    }
    return item
  }

  addPathFields (item: any) {
    if (item.pathId) {
      item.pathIdTruncated = truncateString(item.pathId, 4)
    }
    if (item.token) {
      try {
        item.tokenExplorerUrl = this.sdk.utils.getTokenExplorerUrl(item.token, item.chainId)
      } catch (err) {
        console.error(err)
        item.tokenExplorerUrl = ''
      }
      item.tokenTruncated = truncateString(item.token, 4)
    }
    if (item.counterpartToken) {
      try {
        item.counterpartTokenExplorerUrl = this.sdk.utils.getTokenExplorerUrl(item.counterpartToken, item.counterpartChainId)
      } catch (err: any) {
        console.error(err)
        item.counterpartTokenExplorerUrl = ''
      }
      item.counterpartTokenTruncated = truncateString(item.counterpartToken, 4)
    }
    if (item.chainId) {
      item.chainName = chainNames[item.chainId] ?? ''
      item.chainLabel = getChainLabel(item.chainId)
    }
    if (item.counterpartChainId) {
      item.counterpartChainName = chainNames[item.counterpartChainId] ?? ''
      item.counterpartChainLabel = getChainLabel(item.counterpartChainId)
    }

    return item
  }

  addTokenPriceFields (item: any) {
    if (item.priceUsd != null) {
      item.priceUsdDisplay = `${formatToUSD(item.priceUsd.toFixed(2))} USD`
    }
    if (item.timestamp) {
      item.timestampRelative = DateTime.fromSeconds(item.timestamp).toRelative()
    }
    return item
  }

  normalizeFilters(filters: any) {
    if (!filters) {
      return {}
    }

    if (filters.token) {
      filters.token = filters.token.trim()
      if (filters.token.startsWith('0x')) {
        filters.token = checksumAddress(filters.token)
      }
    }

    const fieldsToTrim = [
      'eventChainId', 'chainId', 'fromChainId', 'toChainId', 'token',
      'counterpartToken', 'pathId', 'transferId', 'claimId', 'messageId',
      'bundleId', 'bundleRoot', 'transactionHash', 'attestedClaimId',
      'symbol'
    ]

    fieldsToTrim.forEach(field => {
      if (filters[field]) {
        filters[field] = filters[field].toString().trim()
        if (['counterpartToken', 'relayer', 'from', 'to', 'bonder', 'address', 'account', 'recipient'].includes(field)) {
          filters[field] = checksumAddress(filters[field])
        }
      }
    })

    return filters
  }

  async getTransferVolumeStatsForApi(input: TransferVolumeStatsApiInput): Promise<TransferVolumeStatsApiResult> {
    const results = await this.pgDb.events.TransferSent.getVolumeStats(input)

    let totalUsd = 0
    const tokenVolumes: Record<string, {
      totalUsd: number
      totalUsdDisplay: string
    }> = {}

    for (const result of results) {
      const tokenPrice = await this.pgDb.priceTable.getClosestPrice(result.tokenSymbol, input.endTimestamp)
      if (tokenPrice) {
        const volumeFormatted = formatUnits(result.totalVolume, result.tokenDecimals)
        const usdValue = Number(volumeFormatted) * Number(tokenPrice.priceUsd)

        totalUsd += usdValue
        if (!tokenVolumes[result.tokenSymbol]) {
          tokenVolumes[result.tokenSymbol] = {
            totalUsd: 0,
            totalUsdDisplay: ''
          }
        }
        tokenVolumes[result.tokenSymbol].totalUsd += usdValue
        tokenVolumes[result.tokenSymbol].totalUsdDisplay = `${formatToUSD(tokenVolumes[result.tokenSymbol].totalUsd.toFixed(2))} USD`
      }
    }

    const totalUsdDisplay = `${formatToUSD(totalUsd.toFixed(2))} USD`

    return {
      totalVolume: {
        totalUsd,
        totalUsdDisplay
      },
      tokenVolumes
    }
  }

  async getContractState({ chainIds, filters }: any = {}): Promise<any> {
    const result: any = {}
    const [
      railsGatewayState,
      stakingRegistryState
    ] = await Promise.all([
      this.getRailsGatewayContractState({ chainIds, filters }),
      this.getStakingRegistryContractState()
    ])

    for (const chainId in railsGatewayState) {
      if (!result[chainId]) {
        result[chainId] = {}
      }
      result[chainId] = {
        ...result[chainId],
        railsGateway: railsGatewayState[chainId],
      }
    }

    for (const chainId in stakingRegistryState) {
      if (!result[chainId]) {
        result[chainId] = {}
      }
      result[chainId] = {
        ...result[chainId],
        stakingRegistry: stakingRegistryState[chainId],
      }
    }

    return result
  }

  async getRailsGatewayContractState({ chainIds, filters }: any = {}): Promise<any> {
    chainIds ??= this.sdk.getSupportedChainIds()
    const result: any = {}

    for (const chainId of chainIds) {
      if (chainId === '42069') { // TODO
        continue
      }

      try {
        const railsGateway = this.sdk.getRailsGateway(chainId)
        const [
          railsGatewayAddress,
          removeFee,
          updateFee,
          stakingRegistryAddress
        ] = await Promise.all([
          railsGateway.getRailsGatewayContractAddress(),
          railsGateway.getRemoveFee(),
          railsGateway.getUpdateFee(),
          railsGateway.getStakingRegistryContractAddress()
        ])

        const paths = await this.pgDb.nonEventTables.Path.getItems({ filter: { chainId }, limit: 100 })
        // console.log('paths', paths)
        const pathIds = paths.map((path: any) => path.pathId)

        result[chainId] = this.addEventFields({
          chainId,
          pathIds,
          pathIdsCount: pathIds.length,
          railsGatewayAddress,
          removeFee: removeFee.toString(),
          updateFee: updateFee.toString(),
          stakingRegistryAddress,
          context: { chainId }
        })
      } catch (err: any) {
        console.error(`getContractState, chainId: ${chainId}, error: ${err.message}`)
      }
    }

    return result
  }

  async getStakingRegistryContractState(): Promise<any> {
    const chainIds = this.sdk.getSupportedChainIds()
    const result: any = {}

    for (const chainId of chainIds) {
      try {
        if (chainId === '42069') { // TODO
          continue
        }

        const stakingRegistry = this.sdk.getRailsGateway(chainId).getStakingRegistry()
        const [
          stakingRegistryAddress,
          challengePeriod,
          appealPeriod,
          minChallengeIncrease,
          fullAppeal,
          minHopStake,
          hopToken
        ] = await Promise.all([
          stakingRegistry.getStakingRegistryContractAddress(),
          stakingRegistry.challengePeriod(),
          stakingRegistry.appealPeriod(),
          stakingRegistry.minChallengeIncrease(),
          stakingRegistry.fullAppeal(),
          stakingRegistry.minHopStake(),
          stakingRegistry.hopToken()
        ])

        result[chainId] = this.addEventFields({
          ...result[chainId],
          chainId,
          stakingRegistryAddress,
          challengePeriod: challengePeriod.toString(),
          appealPeriod: appealPeriod.toString(),
          minChallengeIncrease: minChallengeIncrease.toString(),
          fullAppeal: fullAppeal.toString(),
          minHopStake: minHopStake.toString(),
          hopToken,
          context: { chainId }
        })
      } catch (err: any) {
        console.error(`getStakingRegistryContractState, chainId: ${chainId}, error: ${err.message}`)
      }
    }

    return result
  }

  async getPathDetailsState({ pathId }: any = {}): Promise<any> {
    const chainIds = this.sdk.getSupportedChainIds()
    const result: any = {}

    const paths = await this.pgDb.nonEventTables.Path.getItems({ limit: 100 })
    // console.log('paths', paths)

    for (const chainId of chainIds) {
      if (chainId === '42069') { // TODO
        continue
      }

      try {
        const railsGateway = this.sdk.getRailsGateway(chainId)

        const isLive = await railsGateway.helpers.getIsPathIdLive({ pathId })
        console.log('isLive', isLive, pathId)
        if (!isLive) {
          continue
        }

        const [
          headClaimId,
          pathVault,
          sendFee,
          // messageFee,
          // claimFeesFee,
          totalClaims,
          totalConfirmed,
          totalSent
        ] = await Promise.all([
          railsGateway.getHeadClaimId({ pathId }),
          railsGateway.getPathVault({ pathId }),
          railsGateway.getSendFee({ pathId }),
          // railsGateway.getMessageFee({ chainId }), // TODO
          // railsGateway.getClaimFeesFee({ pathId }), // TODO
          railsGateway.getTotalClaims({ pathId }),
          railsGateway.getTotalConfirmed({ pathId }),
          railsGateway.getTotalSent({ pathId })
        ])
        // railsGateway.getFeePrice({ chainId }),
        // getTotalClaimsAtClaimId({ pathId, claimId })
        // getBucketIndex({ pathId, claimId })

        if (!result[chainId]) {
          result[chainId] = {}
        }
        if (!result[chainId].paths) {
          result[chainId].paths = {}
        }

        await this.upsertTokenInfoIfNotExists({ pathId, context: { chainId }})

        const pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { chainId, pathId }})
        const pathInfo = pathInfos?.[0]
        let tokenInfo : any
        console.log('pathInfo', pathInfo)
        if (pathInfo) {
          const { token: tokenAddress } = pathInfo
          const tokenInfos = await this.pgDb.nonEventTables.Token.getItems({ filter: { chainId, address: tokenAddress }})
          tokenInfo = tokenInfos?.[0]
        }
        console.log('tokenInfo', tokenInfo)

        result[chainId] = this.addEventFields({
          chainId,
          pathId,
          headClaimId,
          pathVault,
          sendFee: sendFee.toString(),
          // messageFee: messageFee.toString(),
          // claimFeesFee: claimFeesFee.toString(),
          totalClaims: totalClaims.toString(),
          totalConfirmed: totalConfirmed.toString(),
          totalSent: totalSent.toString(),
          context: { chainId },
          token: tokenInfo
        })
      } catch (err: any) {
        console.error(`getPathDetailsState, chainId: ${chainId}, error: ${err.message}`)
      }
    }

    return result
  }
}
