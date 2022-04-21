import IncompleteSettlementsWatcher from 'src/watchers/IncompleteSettlementsWatcher'
import L1Bridge from 'src/watchers/classes/L1Bridge'
import Logger from 'src/logger'
import S3Upload from 'src/aws/s3Upload'
import contracts from 'src/contracts'
import fetch from 'node-fetch'
import fs from 'fs'
import getRpcProvider from 'src/utils/getRpcProvider'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import getUnbondedTransferRoots from 'src/theGraph/getUnbondedTransferRoots'
import wait from 'src/utils/wait'
import { BigNumber, providers } from 'ethers'
import { Chain, NativeChainToken, OneDayMs } from 'src/constants'
import { DateTime } from 'luxon'
import { Notifier } from 'src/notifier'
import { TransferBondChallengedEvent } from '@hop-protocol/core/contracts/L1Bridge'
import { formatEther, formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'
import { getSubgraphLastBlockSynced } from 'src/theGraph/getSubgraphLastBlockSynced'
import { getUnbondedTransfers } from 'src/theGraph/getUnbondedTransfers'
import { config as globalConfig, healthCheckerWarnSlackChannel, hostname } from 'src/config'

type LowBonderBalance = {
  bridge: string
  chain: string
  nativeToken: string
  amount: string
  amountFormatted: number
  bonder: string
}

type LowAvailableLiquidityBonder = {
  bridge: string
  availableLiquidity: string
  availableLiquidityFormatted: number
  totalLiquidity: string
  totalLiquidityFormatted: number
  thresholdAmount: string
  thresholdAmountFormatted: number
}

type UnbondedTransfer = {
  sourceChain: string
  destinationChain: string
  token: string
  timestamp: number
  transferId: string
  transactionHash: string
  amount: string
  amountFormatted: number
  bonderFee: string
  bonderFeeFormatted: number
  isBonderFeeTooLow: boolean
}

type UnbondedTransferRoot = {
  sourceChain: string
  destinationChain: string
  transferRootHash: string
  token: string
  timestamp: number
  totalAmount: string
  totalAmountFormatted: number
}

type UnsettledTransfer = {
  transferId: string
  bonded: boolean
  bonder: string | null
  amount: string
  amountFormatted: number
}

type IncompleteSettlement = {
  timestamp: number
  transferRootHash: string
  sourceChain: string
  destinationChain: string
  token: string
  totalAmount: string
  totalAmountFormatted: number
  diffAmount: number
  diffAmountFormatted: number
  settlementEvents: number
  withdrewEvents: number
  transfersCount: number
  unsettledTransfers: UnsettledTransfer[]
  unsettledTransferBonders: string[]
  isConfirmed: boolean
}

type ChallengedTransferRoot = {
  token: string
  transactionHash: string
  transferRootHash: string
  transferRootId: string
  originalAmount: string
  originalAmountFormatted: number
}

type UnsyncedSubgraph = {
  chain: string
  headBlockNumber: number
  syncedBlockNumber: number
  diffBlockNumber: number
}

type Result = {
  lowBonderBalances: LowBonderBalance[]
  lowAvailableLiquidityBonders: LowAvailableLiquidityBonder[]
  unbondedTransfers: UnbondedTransfer[]
  unbondedTransferRoots: UnbondedTransferRoot[]
  incompleteSettlements: IncompleteSettlement[]
  challengedTransferRoots: ChallengedTransferRoot[]
  unsyncedSubgraphs: UnsyncedSubgraph[]
}

export type Config = {
  days?: number
  offsetDays?: number
  s3Upload?: boolean
  s3Namespace?: string
  cacheFile?: string
}

export class HealthCheckWatcher {
  tokens: string[] = ['USDC', 'USDT', 'DAI', 'ETH', 'MATIC']
  logger: Logger = new Logger('HealthCheckWatcher')
  s3Upload: S3Upload
  s3Filename: string
  cacheFile: string
  days: number = 1 // days back to check for
  offsetDays: number = 0
  pollIntervalSeconds: number = 300
  notifier: Notifier
  sentMessages: Record<string, boolean> = {}
  lowBalanceThresholds: Record<string, BigNumber> = {
    [NativeChainToken.ETH]: parseEther('0.5'),
    [NativeChainToken.XDAI]: parseEther('100'),
    [NativeChainToken.MATIC]: parseEther('100')
  }

  bonderTotalLiquidity: Record<string, BigNumber> = {
    USDC: parseUnits('6026000', 6),
    USDT: parseUnits('2121836', 6),
    DAI: parseUnits('5000000', 18),
    ETH: parseUnits('4659', 18),
    MATIC: parseUnits('731948.94', 18)
  }

  bonderLowLiquidityThreshold: number = 0.10
  unbondedTransfersMinTimeToWaitMinutes: number = 80
  unbondedTransferRootsMinTimeToWaitHours: number = 6
  incompleteSettlemetsMinTimeToWaitHours: number = 12
  minSubgraphSyncDiffBlockNumbers: Record<string, number> = {
    [Chain.Ethereum]: 1000,
    [Chain.Polygon]: 2000,
    [Chain.Gnosis]: 2000,
    [Chain.Optimism]: 10000,
    [Chain.Arbitrum]: 10000
  }

  enabledChecks: Record<string, boolean> = {
    lowBonderBalances: true,
    unbondedTransfers: true,
    unbondedTransferRoots: true,
    incompleteSettlements: true,
    challengedTransferRoots: true,
    unsyncedSubgraphs: true,
    lowAvailableLiquidityBonders: true
  }

  lastNotificationSentAt: number

  constructor (config: Config) {
    const { days, offsetDays, s3Upload, s3Namespace, cacheFile } = config
    if (days) {
      this.days = days
    }
    if (offsetDays) {
      this.offsetDays = offsetDays
    }
    this.notifier = new Notifier(
      `HealthCheck: ${hostname}`
    )
    this.logger.debug(`days: ${this.days}`)
    this.logger.debug(`offsetDays: ${this.offsetDays}`)
    this.logger.debug(`s3Upload: ${!!s3Upload}`)
    if (s3Upload) {
      const bucket = 'assets.hop.exchange'
      const filePath = `${s3Namespace ?? globalConfig.network}/v1-health-check.json`
      this.s3Filename = `https://${bucket}/${filePath}`
      this.logger.debug(`upload path: ${this.s3Filename}`)
      this.s3Upload = new S3Upload({
        bucket,
        key: filePath
      })
    }
    if (cacheFile) {
      try {
        this.cacheFile = cacheFile
        this.logger.debug(`cacheFile: ${this.cacheFile}`)
        if (fs.existsSync(cacheFile)) {
          const cached = JSON.parse(fs.readFileSync(cacheFile).toString())
          this.sentMessages = cached
        }
      } catch (err) {
        this.logger.error(err)
      }
    }
  }

  async start () {
    while (true) {
      try {
        await this.poll()
      } catch (err) {
        this.logger.error('poll error:', err)
      }
      await wait(this.pollIntervalSeconds * 1000)
    }
  }

  private async getResult (): Promise<Result> {
    const [
      lowBonderBalances,
      lowAvailableLiquidityBonders,
      unbondedTransfers,
      unbondedTransferRoots,
      incompleteSettlements,
      challengedTransferRoots,
      unsyncedSubgraphs
    ] = await Promise.all([
      this.enabledChecks.lowBonderBalances ? this.getLowBonderBalances() : Promise.resolve([]),
      this.enabledChecks.lowAvailableLiquidityBonders ? this.getLowAvailableLiquidityBonders() : Promise.resolve([]),
      this.enabledChecks.unbondedTransfers ? this.getUnbondedTransfers() : Promise.resolve([]),
      this.enabledChecks.unbondedTransferRoots ? this.getUnbondedTransferRoots() : Promise.resolve([]),
      this.enabledChecks.incompleteSettlements ? this.getIncompleteSettlements() : Promise.resolve([]),
      this.enabledChecks.challengedTransferRoots ? this.getChallengedTransferRoots() : Promise.resolve([]),
      this.enabledChecks.unsyncedSubgraphs ? this.getUnsyncedSubgraphs() : Promise.resolve([])
    ])

    return {
      lowBonderBalances,
      lowAvailableLiquidityBonders,
      unbondedTransfers,
      unbondedTransferRoots,
      incompleteSettlements,
      challengedTransferRoots,
      unsyncedSubgraphs
    }
  }

  private async sendNotifications (result: Result) {
    const {
      lowBonderBalances,
      unbondedTransfers,
      unbondedTransferRoots,
      incompleteSettlements,
      challengedTransferRoots,
      unsyncedSubgraphs
    } = result

    const messages: string[] = []

    if (!unsyncedSubgraphs.length) {
      for (const item of lowBonderBalances) {
        const msg = `LowBonderBalance: bonder: ${item.bonder}, chain: ${item.chain}, amount: ${item.amountFormatted?.toFixed(2)} ${item.nativeToken}`
        messages.push(msg)
      }

      for (const item of unbondedTransfers) {
        if (item.isBonderFeeTooLow) {
          continue
        }
        const timestampRelative = DateTime.fromSeconds(item.timestamp).toRelative()
        const msg = `UnbondedTransfer: transferId: ${item.transferId}, source: ${item.sourceChain}, destination: ${item.destinationChain}, amount: ${item.amountFormatted?.toFixed(4)}, bonderFee: ${item.bonderFeeFormatted?.toFixed(4)}, token: ${item.token}, transferSentAt: ${item.timestamp} (${timestampRelative})`
        messages.push(msg)
      }

      for (const item of unbondedTransferRoots) {
        const timestampRelative = DateTime.fromSeconds(item.timestamp).toRelative()
        const msg = `UnbondedTransferRoot: transferRootHash: ${item.transferRootHash}, source: ${item.sourceChain}, destination: ${item.destinationChain}, totalAmount: ${item.totalAmountFormatted?.toFixed(4)}, token: ${item.token}, committedAt: ${item.timestamp} (${timestampRelative})`
        messages.push(msg)
      }

      for (const item of incompleteSettlements) {
        const timestampRelative = DateTime.fromSeconds(item.timestamp).toRelative()
        const msg = `IncompleteSettlements: transferRootHash: ${item.transferRootHash}, source: ${item.sourceChain}, destination: ${item.destinationChain}, totalAmount: ${item.totalAmountFormatted?.toFixed(4)}, diffAmount: ${item.diffAmountFormatted?.toFixed(4)}, token: ${item.token}, committedAt: ${item.timestamp} (${timestampRelative})`
        messages.push(msg)
      }

      for (const item of challengedTransferRoots) {
        const msg = `ChallengedTransferRoot: transferRootHash: ${item.transferRootHash}, transferRootId: ${item.transferRootId}, originalAmount: ${item.originalAmountFormatted?.toFixed(4)}, token: ${item.token}`
        messages.push(msg)
      }
    }

    let shouldSendUnsyncedSubgraphNotification = true
    if (this.lastNotificationSentAt) {
      shouldSendUnsyncedSubgraphNotification = this.lastNotificationSentAt + OneDayMs < Date.now()
    }
    if (shouldSendUnsyncedSubgraphNotification) {
      for (const item of unsyncedSubgraphs) {
        const msg = `UnsyncedSubgraph: chain: ${item.chain}, syncedBlockNumber: ${item.syncedBlockNumber}, headBlockNumber: ${item.headBlockNumber}, diffBlockNumber: ${item.diffBlockNumber}`
        messages.push(msg)
        this.lastNotificationSentAt = Date.now()
      }
    }

    for (const msg of messages) {
      const cacheKey = msg.replace(/ \([\s\S]*?\)/g, '')
      if (this.sentMessages[cacheKey]) {
        continue
      }

      this.sentMessages[cacheKey] = true
      this.logger.warn(msg)
      if (healthCheckerWarnSlackChannel) {
        this.notifier.warn(msg, { channel: healthCheckerWarnSlackChannel })
      }
    }

    try {
      if (this.cacheFile) {
        fs.writeFileSync(this.cacheFile, JSON.stringify(this.sentMessages, null, 2))
      }
    } catch (err) {
      this.logger.error(err)
    }
  }

  private async uploadToS3 (result: Result) {
    this.logger.debug('poll data:', JSON.stringify(result, null, 2))
    if (this.s3Upload) {
      await this.s3Upload.upload(result)
      this.logger.debug(`uploaded to s3 at ${this.s3Filename}`)
    }
    this.logger.debug('poll complete')
  }

  async poll () {
    this.logger.debug('poll')

    const result = await this.getResult()
    await this.uploadToS3(result)
    await this.sendNotifications(result)
  }

  private async getLowBonderBalances (): Promise<LowBonderBalance[]> {
    const chainProviders: Record<string, providers.Provider> = {
      [Chain.Ethereum]: getRpcProvider(Chain.Ethereum)!,
      [Chain.Gnosis]: getRpcProvider(Chain.Gnosis)!,
      [Chain.Polygon]: getRpcProvider(Chain.Polygon)!
    }

    const bonders = new Set<string>()
    const bonderBridges: Record<string, string> = {}
    const configBonders = globalConfig.bonders as any
    const result: any = []

    for (const token in configBonders) {
      for (const sourceChain in configBonders[token]) {
        for (const destinationChain in configBonders[token][sourceChain]) {
          const bonder = configBonders[token][sourceChain][destinationChain]
          bonderBridges[bonder] = token
          bonders.add(bonder)
        }
      }
    }

    for (const bonder of bonders) {
      const bridge = bonderBridges[bonder]
      const [ethBalance, xdaiBalance, maticBalance] = await Promise.all([
        chainProviders[Chain.Ethereum].getBalance(bonder),
        chainProviders[Chain.Gnosis].getBalance(bonder),
        chainProviders[Chain.Polygon].getBalance(bonder)
      ])

      if (ethBalance.lt(this.lowBalanceThresholds.ETH)) {
        result.push({
          bonder,
          bridge,
          chain: Chain.Ethereum,
          nativeToken: NativeChainToken.ETH,
          amount: ethBalance.toString(),
          amountFormatted: Number(formatEther(ethBalance.toString()))
        })
      }

      if (xdaiBalance.lt(this.lowBalanceThresholds.XDAI)) {
        result.push({
          bonder,
          bridge,
          chain: Chain.Gnosis,
          nativeToken: NativeChainToken.XDAI,
          amount: xdaiBalance.toString(),
          amountFormatted: Number(formatEther(xdaiBalance.toString()))
        })
      }

      if (maticBalance.lt(this.lowBalanceThresholds.MATIC)) {
        result.push({
          bonder,
          bridge,
          chain: Chain.Polygon,
          nativeToken: NativeChainToken.MATIC,
          amount: maticBalance.toString(),
          amountFormatted: Number(formatEther(maticBalance.toString()))
        })
      }
    }

    this.logger.debug('lowBonderBalances:', JSON.stringify(result, null, 2))

    return result
  }

  private async getLowAvailableLiquidityBonders (): Promise<LowAvailableLiquidityBonder[]> {
    const url = 'https://assets.hop.exchange/mainnet/v1-available-liquidity.json'
    const res = await fetch(url)
    const json = await res.json()
    const result: any[] = []

    for (const token of this.tokens) {
      const tokenData = json.data[token]
      if (!tokenData) {
        continue
      }
      const chainAmounts: any = {}
      const totalLiquidity = this.bonderTotalLiquidity[token]
      const availableAmounts = tokenData.baseAvailableCreditIncludingVault
      for (const source in availableAmounts) {
        for (const dest in availableAmounts[source]) {
          chainAmounts[dest] = BigNumber.from(availableAmounts[source][dest])
        }
      }
      let availableLiquidity: BigNumber = BigNumber.from(0)
      for (const amount in chainAmounts) {
        availableLiquidity = availableLiquidity.add(chainAmounts[amount])
      }
      const tokenDecimals = getTokenDecimals(token)!
      const availableLiquidityFormatted = Number(formatUnits(availableLiquidity, tokenDecimals))
      const totalLiquidityFormatted = Number(formatUnits(totalLiquidity, tokenDecimals))
      const oneToken = parseUnits('1', tokenDecimals)
      const thresholdPercent = parseUnits(this.bonderLowLiquidityThreshold.toString(), tokenDecimals)
      const thresholdAmount = totalLiquidity.mul(thresholdPercent).div(oneToken)
      const thresholdAmountFormatted = Number(formatUnits(thresholdAmount, tokenDecimals))
      if (availableLiquidity.lt(thresholdAmount)) {
        result.push({
          bridge: token,
          availableLiquidity: availableLiquidity.toString(),
          availableLiquidityFormatted,
          totalLiquidity: totalLiquidity.toString(),
          totalLiquidityFormatted,
          thresholdAmount: thresholdAmount.toString(),
          thresholdAmountFormatted
        })
      }
    }
    return result
  }

  private async getUnbondedTransfers (): Promise<UnbondedTransfer[]> {
    this.logger.debug('checking for unbonded transfers')

    const timestamp = DateTime.now().toUTC().toSeconds()
    let result = await getUnbondedTransfers(this.days, this.offsetDays)
    result = result.map(item => {
      return {
        sourceChain: item.sourceChainSlug,
        destinationChain: item.destinationChainSlug,
        token: item.token,
        timestamp: Number(item.timestamp),
        transferId: item.transferId,
        transactionHash: item.transactionHash,
        amount: item.amount,
        amountFormatted: Number(item.formattedAmount),
        bonderFee: item.bonderFee,
        bonderFeeFormatted: Number(item.formattedBonderFee)
      }
    })
    result = result.filter((x: any) => timestamp > (Number(x.timestamp) + (this.unbondedTransfersMinTimeToWaitMinutes * 60)))
    result = result.filter((x: any) => x.sourceChain !== Chain.Ethereum)
    result = result.map((x: any) => {
      const isBonderFeeTooLow = x.bonderFeeFormatted === 0 || (x.token === 'ETH' && x.bonderFeeFormatted < 0.005 && [Chain.Ethereum, Chain.Optimism, Chain.Arbitrum].includes(x.destinationChain)) || (x.token !== 'ETH' && x.bonderFeeFormatted < 1 && [Chain.Ethereum, Chain.Optimism, Chain.Arbitrum].includes(x.destinationChain)) || (x.token !== 'ETH' && x.bonderFeeFormatted < 0.25 && [Chain.Gnosis, Chain.Polygon].includes(x.destinationChain))
      x.isBonderFeeTooLow = isBonderFeeTooLow
      return x
    })

    this.logger.debug(`unbonded transfers: ${result.length}`)
    this.logger.debug('done checking for unbonded transfers')

    return result
  }

  private async getUnbondedTransferRoots (): Promise<UnbondedTransferRoot[]> {
    const now = DateTime.now().toUTC()
    const sourceChains = [Chain.Optimism, Chain.Arbitrum]
    const destinationChains = [Chain.Ethereum, Chain.Optimism, Chain.Arbitrum]
    const tokens = ['USDC', 'USDT', 'DAI', 'ETH']
    const startTime = Math.floor(now.minus({ days: this.days }).toSeconds())
    const endTime = Math.floor(now.toSeconds())
    let result: any[] = []
    for (const sourceChain of sourceChains) {
      for (const destinationChain of destinationChains) {
        for (const token of tokens) {
          this.logger.debug(`checking unbonded transfer roots for ${token} ${sourceChain}→${destinationChain}`)
          const unbondedTransferRoots = await getUnbondedTransferRoots(sourceChain, token, destinationChain, startTime, endTime)
          this.logger.debug(`done checking unbonded transfer roots for ${token} ${sourceChain}→${destinationChain}`)
          result.push(...unbondedTransferRoots)
        }
      }
    }

    this.logger.debug('done checking for unbonded transfer roots')

    result = result.filter((x: any) => endTime > (Number(x.timestamp) + (this.unbondedTransferRootsMinTimeToWaitHours * 60 * 60)))

    return result.map((item: any) => {
      return {
        sourceChain: item.sourceChain,
        destinationChain: item.destinationChain,
        transferRootHash: item.transferRootHash,
        token: item.token,
        timestamp: item.timestamp,
        totalAmount: item.totalAmount,
        totalAmountFormatted: item.totalAmountFormatted
      }
    })
  }

  private async getIncompleteSettlements (): Promise<IncompleteSettlement[]> {
    this.logger.debug('fetching incomplete settlements')
    const timestamp = DateTime.now().toUTC().toSeconds()
    const incompleteSettlementsWatcher = new IncompleteSettlementsWatcher({
      days: this.days,
      offsetDays: this.offsetDays,
      format: 'json'
    })
    let result = await incompleteSettlementsWatcher.getDiffResults()
    result = result.filter((x: any) => timestamp > (Number(x.timestamp) + (this.incompleteSettlemetsMinTimeToWaitHours * 60 * 60)))
    result = result.filter((x: any) => x.diffFormatted > 0.01)
    this.logger.debug('done fetching incomplete settlements')
    result = result.map((item: any) => {
      return {
        timestamp: item.timestamp,
        transferRootHash: item.rootHash,
        sourceChain: item.sourceChain,
        destinationChain: item.destinationChain,
        token: item.token,
        totalAmount: item.totalAmount,
        totalAmountFormatted: item.totalAmountFormatted,
        diffAmount: item.diff,
        diffAmountFormatted: item.diffFormatted,
        settlementEvents: item.settlementEvents,
        withdrewEvents: item.withdrewEvents,
        transfersCount: item.transfersCount,
        isConfirmed: item.isConfirmed,
        unsettledTransfers: item.unsettledTransfers,
        unsettledTransferBonders: item.unsettledTransferBonders
      }
    })

    result = result.filter((item: any) => {
      if (item.unsettledTransfers?.length) {
        let totalAmountUnbonded = BigNumber.from(0)
        for (const transfer of item.unsettledTransfers) {
          if (!transfer.bonded) {
            totalAmountUnbonded = totalAmountUnbonded.add(BigNumber.from(transfer.amount))
          }
        }
        const isAllSettled = BigNumber.from(item.diffAmount).eq(totalAmountUnbonded)
        if (isAllSettled) {
          return false
        }
      }
      return true
    })

    return result
  }

  private async getChallengedTransferRoots (): Promise<ChallengedTransferRoot[]> {
    const result: any[] = []
    for (const token of this.tokens) {
      this.logger.debug(`done ${token} bridge for challenged roots`)
      const l1BridgeContract = contracts.get(token, Chain.Ethereum).l1Bridge
      const provider = getRpcProvider(Chain.Ethereum)!
      const startBlockNumber = 0
      const endBlockNumber = Number((await provider.getBlockNumber()).toString())
      const l1Bridge = new L1Bridge(l1BridgeContract)
      await l1Bridge.mapTransferBondChallengedEvents(
        async (event: TransferBondChallengedEvent) => {
          const transactionHash = event.transactionHash
          const transferRootHash = event.args.rootHash.toString()
          const transferRootId = event.args.transferRootId.toString()
          const originalAmount = event.args.originalAmount.toString()
          const tokenDecimals = getTokenDecimals(token)!
          const originalAmountFormatted = Number(formatUnits(originalAmount, tokenDecimals))
          const data = {
            token,
            transactionHash,
            transferRootHash,
            transferRootId,
            originalAmount,
            originalAmountFormatted,
            tokenDecimals
          }
          result.push(data)
        },
        {
          startBlockNumber,
          endBlockNumber
        }
      )
      this.logger.debug(`done checking ${token} for challenged roots`)
    }

    return result
  }

  async getUnsyncedSubgraphs (): Promise<UnsyncedSubgraph[]> {
    const chains = [Chain.Ethereum, Chain.Optimism, Chain.Arbitrum, Chain.Polygon, Chain.Gnosis]
    const result: any = []
    for (const chain of chains) {
      const provider = getRpcProvider(chain)!
      const syncedBlockNumber = await getSubgraphLastBlockSynced(chain)
      const headBlockNumber = Number((await provider.getBlockNumber()).toString())
      const diffBlockNumber = headBlockNumber - syncedBlockNumber
      this.logger.debug(`subgraph sync status: syncedBlockNumber: chain: ${chain}, ${syncedBlockNumber}, headBlockNumber: ${headBlockNumber}, diffBlockNumber: ${diffBlockNumber}`)
      if (diffBlockNumber > this.minSubgraphSyncDiffBlockNumbers[chain]) {
        result.push({
          chain,
          headBlockNumber,
          syncedBlockNumber,
          diffBlockNumber
        })
      }
    }
    return result
  }
}
