import { Logger } from '@hop-protocol/hop-node-core/logger'
import { chainIdToSlug } from '@hop-protocol/hop-node-core/utils'
import getBlockNumberFromDate from '#src/utils/getBlockNumberFromDate.js'
import getBondedWithdrawal from '#src/theGraph/getBondedWithdrawal.js'
import { getRpcProvider } from '@hop-protocol/hop-node-core/utils'
import { getTokenDecimals } from '@hop-protocol/hop-node-core/utils'
import getTransferRootId from '#src/utils/getTransferRootId.js'
import getTransferSent from '#src/theGraph/getTransferSent.js'
import isTokenSupportedForChain from '#src/utils/isTokenSupportedForChain.js'
import { wait } from '@hop-protocol/hop-node-core/utils'
import { AssetSymbol, ChainSlug } from '@hop-protocol/core/config'
import { BigNumber, Contract } from 'ethers'
import { Chain } from '@hop-protocol/hop-node-core/constants'
import { DateTime } from 'luxon'
import { L1BridgeProps, L2BridgeProps, mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'
import { formatUnits } from 'ethers/lib/utils.js'
import { getEnabledTokens } from '#src/config/index.js'
import hopCoreAbi from '@hop-protocol/core/abi'
import { promiseQueue } from '@hop-protocol/hop-node-core/utils'

const { l1BridgeAbi, l2BridgeAbi } = hopCoreAbi

type Options = {
  token?: string
  days?: number
  offsetDays?: number
  format?: string
}

class IncompleteSettlementsWatcher {
  ready: boolean = false
  logger: Logger = new Logger('IncompleteSettlementsWatcher')
  format: string = 'table'

  chains: string[] = [
    Chain.Ethereum,
    Chain.Arbitrum,
    Chain.Optimism,
    Chain.Gnosis,
    Chain.Polygon,
    Chain.Nova,
    Chain.Base,
    Chain.PolygonZk,
    Chain.Linea
  ]

  tokens: string[] = getEnabledTokens()

  days: number = 7
  offsetDays: number = 0
  startBlockNumbers: any = {}
  endBlockNumbers: any = {}

  // events
  transferCommitteds: any = {}
  multipleWithdrawalsSettleds: any = {}
  withdrawalBondSettleds: any = {}
  rootTransferIds: any = {}
  transferRootConfirmeds: any = {}
  transferRootSets: any = {}
  withdrews: any = {}

  // state to track
  rootHashMeta: any = {}
  rootHashTimestamps: any = {}
  rootHashTotals: any = {}
  rootHashSettlements: any = {}
  rootHashWithdrews: any = {}
  rootHashConfirmeds: any = {}
  rootHashSets: any = {}
  rootHashSettledTotalAmounts: any = {}
  transferIdWithdrews: any = {}
  transferIdWithdrawalBondSettled: any = {}
  transferIdRootHashes: any = {}

  constructor (options: Options = {}) {
    const { token, days, offsetDays, format } = options
    if (token) {
      this.tokens = [token]
    }
    if (days) {
      this.days = days
    }
    if (offsetDays) {
      this.offsetDays = offsetDays
    }
    if (format) {
      this.format = format
    }
  }

  private async init () {
    if (this.ready) {
      return
    }
    await this.sync()
    this.ready = true
  }

  private async tilReady (): Promise<any> {
    while (true) {
      if (this.ready) {
        return true
      }
      await wait(100)
    }
  }

  private async sync () {
    await this.setStartBlockNumbers()

    this.logger.debug('done getting all block numbers')
    this.logger.debug('reading events')
    this.logger.debug(`days: ${this.days}`)
    this.logger.debug(`offsetDays: ${this.offsetDays}`)
    this.logger.debug('this will take a minute')

    for (const chain of this.chains) {
      const promises: Array<Promise<any>> = []
      for (const token of this.tokens) {
        this.logger.debug(`${chain} ${token} reading events`)
        if (!isTokenSupportedForChain(token, chain)) {
          continue
        }
        if (chain === 'ethereum') {
          promises.push(this.setTransferRootConfirmeds(chain, token))
        }
        if (chain !== 'ethereum') {
          promises.push(this.setTransferCommittedEvents(chain, token))
        }
        promises.push(this.setMultipleWithdrawalsSettleds(chain, token))
        promises.push(this.setWithdrawalBondSettleds(chain, token))
        promises.push(this.setWithdrews(chain, token))
        promises.push(this.setTransferRootSets(chain, token))
        this.logger.debug(`${chain} ${token} done reading events`)
      }
      await Promise.all(promises)
    }

    this.logger.debug('done reading all events')
  }

  private async setStartBlockNumbers () {
    await Promise.all(this.chains.map(async (chain: string) => {
      this.logger.debug(`${chain} - getting start and end block numbers`)
      const date = DateTime.fromMillis(Date.now()).minus({ days: this.days + this.offsetDays })
      const timestamp = Math.floor(date.toSeconds())
      const startBlockNumber = await getBlockNumberFromDate(chain, timestamp)
      this.startBlockNumbers[chain] = startBlockNumber

      const provider = getRpcProvider(chain)
      let endBlockNumber: number
      if (this.offsetDays) {
        const date = DateTime.fromMillis(Date.now()).minus({ days: this.offsetDays })
        const timestamp = date.toSeconds()
        endBlockNumber = await getBlockNumberFromDate(chain, timestamp)
      } else {
        endBlockNumber = await provider.getBlockNumber()
      }
      this.endBlockNumbers[chain] = endBlockNumber
      this.logger.debug(`${chain} - done getting block numbers`)
    }))
  }

  private async setEvents (chain: string, token: string, filter: any, obj: any) {
    const contract = this.getContract(chain, token)
    const startBlockNumber = this.startBlockNumbers[chain]
    const endBlockNumber = this.endBlockNumbers[chain]
    const logs = await this.getLogs(filter, chain, startBlockNumber, endBlockNumber, contract)
    if (!obj[chain]) {
      obj[chain] = {}
    }
    if (!obj[chain][token]) {
      obj[chain][token] = {}
    }
    obj[chain][token] = logs
    return logs
  }

  private async setTransferCommittedEvents (chain: string, token: string) {
    const contract = this.getContract(chain, token)
    const filter = contract.filters.TransfersCommitted()
    const logs = await this.setEvents(chain, token, filter, this.transferCommitteds)

    const concurrency = 20
    await promiseQueue(logs, async (log: any, i: number) => {
      const { rootHash, totalAmount, destinationChainId } = log.args
      const destinationChain = chainIdToSlug(destinationChainId)
      this.rootHashMeta[rootHash] = {
        token,
        sourceChain: chain,
        destinationChain
      }
      this.rootHashTotals[rootHash] = totalAmount

      const provider = getRpcProvider(chain)
      const { timestamp } = await provider.getBlock(log.blockNumber)
      this.rootHashTimestamps[rootHash] = timestamp
    }, { concurrency })
  }

  private async setMultipleWithdrawalsSettleds (chain: string, token: string) {
    const contract = this.getContract(chain, token)
    const filter = contract.filters.MultipleWithdrawalsSettled()
    const logs = await this.setEvents(chain, token, filter, this.multipleWithdrawalsSettleds)

    const concurrency = 20
    await promiseQueue(logs, async (log: any, i: number) => {
      await this.setRootTransferIds(chain, token, log)
    }, { concurrency })
  }

  private async setWithdrawalBondSettleds (chain: string, token: string) {
    const contract = this.getContract(chain, token)
    const filter = contract.filters.WithdrawalBondSettled()
    const logs = await this.setEvents(chain, token, filter, this.withdrawalBondSettleds)
    for (const log of logs) {
      this.transferIdWithdrawalBondSettled[log.args.transferId] = log
    }
  }

  private async setTransferRootConfirmeds (chain: string, token: string) {
    const contract = this.getContract(chain, token)
    const filter = contract.filters.TransferRootConfirmed()
    const logs = await this.setEvents(chain, token, filter, this.transferRootConfirmeds)
    for (const log of logs) {
      this.rootHashConfirmeds[log.args.rootHash] = log
    }
  }

  private async setTransferRootSets (chain: string, token: string) {
    const contract = this.getContract(chain, token)
    const filter = contract.filters.TransferRootSet()
    const logs = await this.setEvents(chain, token, filter, this.transferRootSets)
    for (const log of logs) {
      this.rootHashSets[log.args.rootHash] = log
    }
  }

  private async setWithdrews (chain: string, token: string) {
    const contract = this.getContract(chain, token)
    const filter = contract.filters.Withdrew()
    const logs = await this.setEvents(chain, token, filter, this.withdrews)
    for (const log of logs) {
      this.transferIdWithdrews[log.args.transferId] = log
    }
  }

  private async setRootTransferIds (chain: string, token: string, log: any) {
    const provider = getRpcProvider(chain)
    const rootHash = log.args.rootHash
    const { data } = await provider.getTransaction(log.transactionHash)
    const contract = this.getContract(chain, token)
    const { transferIds } = contract.interface.decodeFunctionData(
      'settleBondedWithdrawals',
      data
    )
    this.rootTransferIds[rootHash] = transferIds
    for (const transferId of transferIds) {
      this.transferIdRootHashes[transferId] = rootHash
    }
  }

  private getContract (chain: string, token: string) {
    const provider = getRpcProvider(chain)
    const config = mainnetAddresses.bridges[token as AssetSymbol]?.[chain as ChainSlug] as L1BridgeProps & L2BridgeProps
    if (!config) {
      throw new Error(`Could not find bridge config for ${token} on ${chain}`)
    }
    const contract = new Contract(config.l1Bridge || config.l2Bridge, config.l1Bridge ? l1BridgeAbi : l2BridgeAbi, provider)
    return contract
  }

  private async getLogs (filter: any, chain: string, startBlockNumber: number, endBlockNumber: number, contract: any) {
    const logs: any[] = []
    const batchSize = 10000
    let start = startBlockNumber
    let end = start + batchSize
    while (end <= endBlockNumber) {
      const _logs = await contract.queryFilter(
        filter,
        start,
        end
      )

      logs.push(..._logs)

      // Add 1 so that boundary blocks are not double counted
      start = end + 1

      // If the batch is less than the batchSize, use the endBlockNumber
      const newEnd = start + batchSize
      end = Math.min(endBlockNumber, newEnd)

      // For the last batch, start will be greater than end because end is capped at endBlockNumber
      if (start > end) {
        break
      }
    }
    return logs
  }

  async start () {
    const result = await this.getDiffResults()
    await this.logResult(result)
  }

  async getDiffResults (): Promise<any> {
    await this.init()
    await this.tilReady()
    this.logger.debug('summing multipleWithdrawalsSettled events')

    for (const chain of this.chains) {
      for (const token of this.tokens) {
        const logs = this.multipleWithdrawalsSettleds?.[chain]?.[token]
        if (!logs) {
          continue
        }

        for (const log of logs) {
          const transactionHash = log.transactionHash
          const bonder = log.args.bonder
          const rootHash = log.args.rootHash
          const amount = log.args.totalBondsSettled

          if (!this.rootHashSettlements[rootHash]) {
            this.rootHashSettlements[rootHash] = []
          }

          this.rootHashSettlements[rootHash].push({
            transactionHash,
            bonder,
            rootHash,
            amount
          })
        }
      }
    }

    for (const rootHash in this.rootHashSettlements) {
      if (!this.rootHashSettledTotalAmounts[rootHash]) {
        this.rootHashSettledTotalAmounts[rootHash] = BigNumber.from(0)
      }
      for (const { amount } of this.rootHashSettlements[rootHash]) {
        this.rootHashSettledTotalAmounts[rootHash] = this.rootHashSettledTotalAmounts[rootHash].add(amount)
      }
    }

    this.logger.debug('summing withdrew events')

    for (const transferId in this.transferIdWithdrews) {
      const log = this.transferIdWithdrews[transferId]
      const amount = log.args.amount
      const rootHash = this.transferIdRootHashes[transferId]
      if (!this.rootHashWithdrews[rootHash]) {
        this.rootHashWithdrews[rootHash] = []
      }
      this.rootHashWithdrews[rootHash].push(log)
      if (!this.rootHashSettledTotalAmounts[rootHash]) {
        this.rootHashSettledTotalAmounts[rootHash] = BigNumber.from(0)
      }
      this.rootHashSettledTotalAmounts[rootHash] = this.rootHashSettledTotalAmounts[rootHash].add(amount)
    }

    this.logger.debug('summing withdrawalBondSettled events')

    for (const transferId in this.transferIdWithdrawalBondSettled) {
      const log = this.transferIdWithdrawalBondSettled[transferId]
      // TODO: get transfer sent amount
      const amount = BigNumber.from(0)
      const rootHash = this.transferIdRootHashes[transferId]
      this.rootHashSettledTotalAmounts[rootHash] = this.rootHashSettledTotalAmounts[rootHash].add(amount)
    }

    let incompletes: any[] = []

    const rootsCount = Object.keys(this.rootHashTotals).length
    this.logger.debug('checking settled amount diffs')
    this.logger.debug(`roots to check: ${rootsCount}`)

    const rootHashes = Object.keys(this.rootHashTotals)
    this.logger.debug(`rootHashes count: ${rootHashes.length}`)

    const concurrency = 10
    await promiseQueue(rootHashes, async (rootHash: string, i: number) => {
      this.logger.debug(`rootHashes processing item ${i + 1}/${rootHashes.length}`)
      const { sourceChain, destinationChain, token } = this.rootHashMeta[rootHash]
      const totalAmount = this.rootHashTotals[rootHash]
      const timestamp = this.rootHashTimestamps[rootHash]
      const isConfirmed = !!this.rootHashConfirmeds[rootHash]
      const isSet = !!this.rootHashSets[rootHash]
      const tokenDecimals = getTokenDecimals(token)
      // const settledTotalAmount = this.rootHashSettledTotalAmounts[rootHash] ?? BigNumber.from(0)
      const settledTotalAmount = await this.getOnchainTotalAmountWithdrawn(destinationChain, token, rootHash, totalAmount)
      const timestampRelative = DateTime.fromSeconds(timestamp).toRelative()
      const _totalAmount = totalAmount.toString()
      const totalAmountFormatted = Number(formatUnits(_totalAmount, tokenDecimals))
      const diff = totalAmount.sub(settledTotalAmount).toString()
      const diffFormatted = Number(formatUnits(diff, tokenDecimals))
      const isIncomplete = diffFormatted > 0 && (settledTotalAmount.eq(0) || !settledTotalAmount.eq(totalAmount))
      let unsettledTransfers: any[] = []
      let unsettledTransferBonders: string[] = []
      const rootId = getTransferRootId(rootHash, totalAmount)
      if (isIncomplete) {
        const settlementEvents = this.rootHashSettlements[rootHash]?.length ?? 0
        const withdrewEvents = this.rootHashWithdrews[rootHash]?.length ?? 0
        const [_unsettledTransfers, _unsettledTransferBonders, transferIds] = await this.getUnsettledTransfers(rootHash)
        unsettledTransfers = _unsettledTransfers
        unsettledTransferBonders = _unsettledTransferBonders
        const transfersCount = transferIds.length
        incompletes.push({
          timestamp,
          timestampRelative,
          token,
          sourceChain,
          destinationChain,
          totalAmount: _totalAmount,
          totalAmountFormatted,
          diff,
          diffFormatted,
          rootHash,
          rootId,
          settlementEvents,
          withdrewEvents,
          transfersCount,
          isConfirmed,
          isSet,
          unsettledTransfers,
          unsettledTransferBonders
        })
      }
      this.logger.debug(`root: ${rootHash}, token: ${token}, isAllSettled: ${!isIncomplete}, isConfirmed: ${isConfirmed}, isSet: ${isSet}, totalAmount: ${totalAmountFormatted}, diff: ${diffFormatted}, unsettledTransfers: ${JSON.stringify(unsettledTransfers)}, unsettledTransferBonders: ${JSON.stringify(unsettledTransferBonders)}`)
    }, { concurrency })

    // Check to see if the only remaining unsettled amounts are withdrawn
    incompletes = incompletes.filter((item: any) => {
      if (item.unsettledTransfers?.length) {
        let totalAmountUnbonded = BigNumber.from(0)
        for (const transfer of item.unsettledTransfers) {
          if (!transfer.bonded) {
            totalAmountUnbonded = totalAmountUnbonded.add(BigNumber.from(transfer.amount))
          }
        }
        const isAllSettled = BigNumber.from(item.diff).eq(totalAmountUnbonded)
        if (isAllSettled) {
          return false
        }
      }
      return true
    })

    incompletes = incompletes.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))

    this.logger.debug('done checking root diffs')
    this.logger.debug(`incomplete settlements: ${incompletes.length}`)

    let result: any = null
    if (this.format === 'table' || this.format === 'json') {
      result = incompletes
    } else if (this.format === 'csv') {
      if (incompletes.length > 0) {
        const header = Object.keys(incompletes[0])
        const csv = incompletes.map((item: any) => Object.values(item))
        result = {
          header,
          rows: csv
        }
      }
    } else {
      throw new Error('invalid format')
    }

    return result
  }

  private async getUnsettledTransfers (rootHash: string) {
    const { sourceChain, destinationChain, token } = this.rootHashMeta[rootHash]
    const tokenDecimals = getTokenDecimals(token)
    const contract = this.getContract(destinationChain, token)
    const transferIds = await this.rootTransferIds[rootHash] || []
    const unsettledTransfers: any[] = []
    const unsettledTransferBonders = new Set()
    const concurrency = 20
    await promiseQueue(transferIds, async (transferId: string, i: number) => {
      this.logger.debug(`rootHash transferIds processing item ${i + 1}/${transferIds.length}`)
      const bondWithdrawalEvent = await getBondedWithdrawal(destinationChain, token, transferId)
      if (!bondWithdrawalEvent) {
        // Return if it is withdrawn. Do it after checking if it is bonded so we only make RPC calls when necessary.
        const isWithdrawn = await contract.isTransferIdSpent(transferId)
        if (isWithdrawn) {
          return
        }
        const { amount } = await getTransferSent(sourceChain, transferId)
        const amountFormatted = Number(formatUnits(amount, tokenDecimals))
        unsettledTransfers.push({
          bonded: false,
          transferId,
          bonder: null,
          amount,
          amountFormatted
        })
        return
      }

      const bonder = bondWithdrawalEvent.from
      const bondedWithdrawalAmount = await contract.getBondedWithdrawalAmount(bonder, transferId)
      if (bondedWithdrawalAmount.gt(0)) {
        const amount = bondedWithdrawalAmount.toString()
        const amountFormatted = Number(formatUnits(amount, tokenDecimals))
        unsettledTransfers.push({
          bonded: true,
          transferId,
          bonder,
          amount,
          amountFormatted
        })
        unsettledTransferBonders.add(bonder)
      }
    }, { concurrency })

    return [unsettledTransfers, Array.from(unsettledTransferBonders), transferIds]
  }

  private async getOnchainTotalAmountWithdrawn (destinationChain: string, token: string, transferRootHash: string, totalAmount: BigNumber) {
    const contract = this.getContract(destinationChain, token)
    const { amountWithdrawn } = await contract.getTransferRoot(transferRootHash, totalAmount)
    return amountWithdrawn
  }

  private async logResult (result: any) {
    if (!result) {
      return
    }

    if (this.format === 'table') {
      console.table(result)
    } else if (this.format === 'csv') {
      console.log(result.header.join(','))
      console.log(result.csv.join(','))
    } else if (this.format === 'json') {
      console.log(JSON.stringify(result, null, 2))
    }
  }
}

export default IncompleteSettlementsWatcher
