import IncompleteSettlementsWatcher from 'src/watchers/IncompleteSettlementsWatcher'
import L1Bridge from 'src/watchers/classes/L1Bridge'
import Logger from 'src/logger'
import OsWatcher from 'src/watchers/OsWatcher'
import S3Upload from 'src/aws/s3Upload'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import contracts from 'src/contracts'
import fetch from 'node-fetch'
import fs from 'fs'
import getBlockNumberFromDate from 'src/utils/getBlockNumberFromDate'
import getRpcProvider from 'src/utils/getRpcProvider'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import getTransferFromL1Completed from 'src/theGraph/getTransferFromL1Completed'
import getTransferIds from 'src/theGraph/getTransferIds'
import getTransferSentToL2 from 'src/theGraph/getTransferSentToL2'
import getUnbondedTransferRoots from 'src/theGraph/getUnbondedTransferRoots'
import getUnsetTransferRoots from 'src/theGraph/getUnsetTransferRoots'
import wait from 'src/utils/wait'
import { BigNumber, providers } from 'ethers'
import { Chain, NativeChainToken, OneDayMs, RelayableChains } from 'src/constants'
import { DateTime } from 'luxon'
import { Notifier } from 'src/notifier'
import { TransferBondChallengedEvent } from '@hop-protocol/core/contracts/L1Bridge'
import { appTld, expectedNameservers, config as globalConfig, healthCheckerWarnSlackChannel, hostname } from 'src/config'
import { formatEther, formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'
import { getDbSet } from 'src/db'
import { getEnabledTokens } from 'src/config/config'
import { getInvalidBondWithdrawals } from 'src/theGraph/getInvalidBondWithdrawals'
import { getNameservers } from 'src/utils/getNameservers'
import { getSubgraphLastBlockSynced } from 'src/theGraph/getSubgraphLastBlockSynced'
import { getUnbondedTransfers } from 'src/theGraph/getUnbondedTransfers'

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
  transferRootId: string
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
  transferRootId: string
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
  isSet: boolean
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

type MissedEvent = {
  sourceChain: string
  token: string
  transferId: string
  amount: string
  bonderFee: string
  timestamp: number
}

type InvalidBondWithdrawal = {
  destinationChain: string
  token: string
  transferId: string
  amount: string
  timestamp: number
}

type UnrelayedTransfer = {
  transactionHash: string
  token: string
  recipient: string
  destinationChainId: number
  amount: string
  relayer: string
  relayerFee: string
}

type UnsetTransferRoot = {
  transferRootHash: string
  totalAmount: string
  timestamp: number
}

type DnsNameserversChanged = {
  domain: string
  expectedNameservers: string[]
  gotNameservers: string[]
}

type LowOsResource = {
  kind: string
  used: string
  total: string
  percent: string
}

type Result = {
  lowBonderBalances: LowBonderBalance[]
  lowAvailableLiquidityBonders: LowAvailableLiquidityBonder[]
  unbondedTransfers: UnbondedTransfer[]
  unbondedTransferRoots: UnbondedTransferRoot[]
  incompleteSettlements: IncompleteSettlement[]
  challengedTransferRoots: ChallengedTransferRoot[]
  unsyncedSubgraphs: UnsyncedSubgraph[]
  missedEvents: MissedEvent[]
  invalidBondWithdrawals: InvalidBondWithdrawal[]
  unrelayedTransfers: UnrelayedTransfer[]
  unsetTransferRoots: UnsetTransferRoot[]
  dnsNameserversChanged: DnsNameserversChanged[]
  lowOsResources: LowOsResource[]
}

export type EnabledChecks = {
  lowBonderBalances: boolean
  unbondedTransfers: boolean
  unbondedTransferRoots: boolean
  incompleteSettlements: boolean
  challengedTransferRoots: boolean
  unsyncedSubgraphs: boolean
  lowAvailableLiquidityBonders: boolean
  missedEvents: boolean
  invalidBondWithdrawals: boolean
  unrelayedTransfers: boolean
  unsetTransferRoots: boolean
  dnsNameserversChanged: boolean
  lowOsResources: boolean
}

export type Config = {
  days?: number
  offsetDays?: number
  s3Upload?: boolean
  s3Namespace?: string
  cacheFile?: string
  enabledChecks?: EnabledChecks
}

export class HealthCheckWatcher {
  tokens: string[] = ['USDC', 'USDT', 'DAI', 'ETH', 'MATIC', 'HOP']
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
  unbondedTransfersMinTimeToWaitMinutes: number = 30
  unbondedTransferRootsMinTimeToWaitHours: number = 1
  incompleteSettlementsMinTimeToWaitHours: number = 4
  // Targeting roughly 1 hour
  minSubgraphSyncDiffBlockNumbers: Record<string, number> = {
    [Chain.Ethereum]: 300,
    [Chain.Polygon]: 2000,
    [Chain.Gnosis]: 750,
    [Chain.Optimism]: 10000,
    [Chain.Arbitrum]: 10000
  }

  enabledChecks: EnabledChecks = {
    lowBonderBalances: true,
    unbondedTransfers: true,
    unbondedTransferRoots: true,
    incompleteSettlements: true,
    challengedTransferRoots: true,
    unsyncedSubgraphs: true,
    lowAvailableLiquidityBonders: true,
    missedEvents: true,
    invalidBondWithdrawals: true,
    unrelayedTransfers: true,
    unsetTransferRoots: true,
    dnsNameserversChanged: true,
    lowOsResources: true
  }

  lastUnsyncedSubgraphNotificationSentAt: number
  lastLowOsResourceNotificationSentAt: number

  constructor (config: Config) {
    const { days, offsetDays, s3Upload, s3Namespace, cacheFile, enabledChecks } = config
    if (days) {
      this.days = days
    }
    if (offsetDays) {
      this.offsetDays = offsetDays
    }
    this.notifier = new Notifier(
      `HealthCheck: ${hostname}`
    )

    if (enabledChecks) {
      this.enabledChecks = Object.assign(this.enabledChecks, enabledChecks)
    }

    this.logger.debug(`days: ${this.days}`)
    this.logger.debug(`offsetDays: ${this.offsetDays}`)
    this.logger.debug(`s3Upload: ${!!s3Upload}`)
    this.logger.debug('enabledChecks:', JSON.stringify(this.enabledChecks))
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
      this.logger.debug('poll complete, waiting interval for next poll')
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
      unsyncedSubgraphs,
      missedEvents,
      invalidBondWithdrawals,
      unrelayedTransfers,
      unsetTransferRoots,
      dnsNameserversChanged,
      lowOsResources
    ] = await Promise.all([
      this.enabledChecks.lowBonderBalances ? this.getLowBonderBalances() : Promise.resolve([]),
      this.enabledChecks.lowAvailableLiquidityBonders ? this.getLowAvailableLiquidityBonders() : Promise.resolve([]),
      this.enabledChecks.unbondedTransfers ? this.getUnbondedTransfers() : Promise.resolve([]),
      this.enabledChecks.unbondedTransferRoots ? this.getUnbondedTransferRoots() : Promise.resolve([]),
      this.enabledChecks.incompleteSettlements ? this.getIncompleteSettlements() : Promise.resolve([]),
      this.enabledChecks.challengedTransferRoots ? this.getChallengedTransferRoots() : Promise.resolve([]),
      this.enabledChecks.unsyncedSubgraphs ? this.getUnsyncedSubgraphs() : Promise.resolve([]),
      this.enabledChecks.missedEvents ? this.getMissedEvents() : Promise.resolve([]),
      this.enabledChecks.invalidBondWithdrawals ? this.getInvalidBondWithdrawals() : Promise.resolve([]),
      this.enabledChecks.unrelayedTransfers ? this.getUnrelayedTransfers() : Promise.resolve([]),
      this.enabledChecks.unsetTransferRoots ? this.getUnsetTransferRoots() : Promise.resolve([]),
      this.enabledChecks.dnsNameserversChanged ? this.getDnsServersChanged() : Promise.resolve([]),
      this.enabledChecks.lowOsResources ? this.getLowOsResources() : Promise.resolve([])
    ])

    return {
      lowBonderBalances,
      lowAvailableLiquidityBonders,
      unbondedTransfers,
      unbondedTransferRoots,
      incompleteSettlements,
      challengedTransferRoots,
      unsyncedSubgraphs,
      missedEvents,
      invalidBondWithdrawals,
      unrelayedTransfers,
      unsetTransferRoots,
      dnsNameserversChanged,
      lowOsResources
    }
  }

  private async sendNotifications (result: Result) {
    const {
      lowBonderBalances,
      unbondedTransfers,
      unbondedTransferRoots,
      incompleteSettlements,
      challengedTransferRoots,
      unsyncedSubgraphs,
      missedEvents,
      invalidBondWithdrawals,
      unrelayedTransfers,
      unsetTransferRoots,
      dnsNameserversChanged,
      lowOsResources
    } = result

    this.logger.debug('sending notifications', JSON.stringify(result, null, 2))
    const messages: string[] = []

    if (!unsyncedSubgraphs.length) {
      for (const item of unbondedTransfers) {
        if (item.isBonderFeeTooLow) {
          continue
        }

        const timestamp = DateTime.now().toUTC().toSeconds()
        const shouldNotify = timestamp > Number(item.timestamp) + (3 * 60 * 60)
        if (shouldNotify) {
          const timestampRelative = DateTime.fromSeconds(item.timestamp).toRelative()
          const msg = `UnbondedTransfer: transferId: ${item.transferId}, source: ${item.sourceChain}, destination: ${item.destinationChain}, amount: ${item.amountFormatted?.toFixed(4)}, bonderFee: ${item.bonderFeeFormatted?.toFixed(4)}, token: ${item.token}, transferSentAt: ${item.timestamp} (${timestampRelative})`
          messages.push(msg)
        }
      }

      for (const item of unbondedTransferRoots) {
        const timestampRelative = DateTime.fromSeconds(item.timestamp).toRelative()
        const msg = `UnbondedTransferRoot: transferRootHash: ${item.transferRootHash}, source: ${item.sourceChain}, destination: ${item.destinationChain}, totalAmount: ${item.totalAmountFormatted?.toFixed(4)}, token: ${item.token}, committedAt: ${item.timestamp} (${timestampRelative})`
        messages.push(msg)
      }

      for (const item of incompleteSettlements) {
        const timestampRelative = DateTime.fromSeconds(item.timestamp).toRelative()
        const msg = `IncompleteSettlements: transferRootHash: ${item.transferRootHash}, transferRootId: ${item.transferRootId}, source: ${item.sourceChain}, destination: ${item.destinationChain}, totalAmount: ${item.totalAmountFormatted?.toFixed(4)}, diffAmount: ${item.diffAmountFormatted?.toFixed(4)}, token: ${item.token}, committedAt: ${item.timestamp} (${timestampRelative})`
        messages.push(msg)
      }

      for (const item of invalidBondWithdrawals) {
        const msg = `Possible InvalidBondWithdrawal: transferId: ${item.transferId}, destination: ${item.destinationChain}, token: ${item.token}, amount: ${item.amount}, timestamp: ${item.timestamp}`
        messages.push(msg)
      }

      for (const item of unrelayedTransfers) {
        const msg = `Possible unrelayed transfer: transactionHash: ${item.transactionHash}, token: ${item.token}, recipient: ${item.recipient}, destinationChainId: ${item.destinationChainId}, amount: ${item.amount}, relayer: ${item.relayer}, relayerFee: ${item.relayerFee}`
        messages.push(msg)
      }

      for (const item of unsetTransferRoots) {
        const msg = `Possible unset transferRoot: transferRootHash: ${item.transferRootHash}, totalAmount: ${item.totalAmount}, timestamp: ${item.timestamp}`
        messages.push(msg)
      }
    }

    for (const item of challengedTransferRoots) {
      const msg = `ChallengedTransferRoot: transferRootHash: ${item.transferRootHash}, transferRootId: ${item.transferRootId}, originalAmount: ${item.originalAmountFormatted?.toFixed(4)}, token: ${item.token}`
      messages.push(msg)
    }

    for (const item of missedEvents) {
      const msg = `Possible MissedEvent: transferId: ${item.transferId}, source: ${item.sourceChain}, token: ${item.token}, amount: ${item.amount}, bonderFee: ${item.bonderFee}, timestamp: ${item.timestamp}`
      messages.push(msg)
    }

    for (const item of lowBonderBalances) {
      const msg = `LowBonderBalance: bonder: ${item.bonder}, chain: ${item.chain}, amount: ${item.amountFormatted?.toFixed(2)} ${item.nativeToken}`
      messages.push(msg)
    }

    for (const item of dnsNameserversChanged) {
      const msg = `Possible DNS Nameserver changed: domain: ${item.domain}, expectedNameservers: ${JSON.stringify(item.expectedNameservers)}, gotNameservers: ${JSON.stringify(item.gotNameservers)}`
      messages.push(msg)
    }

    let shouldSendLowOsResourceNotification = true
    if (this.lastLowOsResourceNotificationSentAt) {
      shouldSendLowOsResourceNotification = this.lastLowOsResourceNotificationSentAt + OneDayMs < Date.now()
    }
    if (shouldSendLowOsResourceNotification) {
      for (const item of lowOsResources) {
        const msg = `LowOsResource: kind: ${item.kind}, used: ${item.used}, total: ${item.total}, percent: ${item.percent}`
        messages.push(msg)
      }
    }

    let shouldSendUnsyncedSubgraphNotification = true
    if (this.lastUnsyncedSubgraphNotificationSentAt) {
      shouldSendUnsyncedSubgraphNotification = this.lastUnsyncedSubgraphNotificationSentAt + OneDayMs < Date.now()
    }
    if (shouldSendUnsyncedSubgraphNotification) {
      for (const item of unsyncedSubgraphs) {
        const msg = `UnsyncedSubgraph: chain: ${item.chain}, syncedBlockNumber: ${item.syncedBlockNumber}, headBlockNumber: ${item.headBlockNumber}, diffBlockNumber: ${item.diffBlockNumber}`
        messages.push(msg)
        this.lastUnsyncedSubgraphNotificationSentAt = Date.now()
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

    // TODO: clean up these bonder fee too low checks and use the same logic that bonders do
    const l1Chains: string[] = [Chain.Ethereum]
    const l2Chains: string[] = [Chain.Optimism, Chain.Arbitrum, Chain.Polygon, Chain.Gnosis]
    result = result.map((x: any) => {
      const isBonderFeeTooLow =
      x.bonderFeeFormatted === 0 ||
      (x.token === 'ETH' && x.bonderFeeFormatted < 0.0005 && l1Chains.includes(x.destinationChain)) ||
      (x.token === 'ETH' && x.bonderFeeFormatted < 0.0001 && l2Chains.includes(x.destinationChain)) ||
      (x.token !== 'ETH' && x.bonderFeeFormatted < 1 && l1Chains.includes(x.destinationChain)) ||
      (x.token !== 'ETH' && x.bonderFeeFormatted < 0.25 && l2Chains.includes(x.destinationChain))

      x.isBonderFeeTooLow = isBonderFeeTooLow
      return x
    })

    result = result.filter((x: any) => {
      if (!x) {
        return false
      }
      if (!x.transferId) {
        return false
      }
      if (x.sourceChain !== 'ethereum' && x.bonderFee === '0') {
        return false
      }
      // spam transfers with very low bonder fee
      if (x.token === 'ETH' && (x.bonderFee === '1140000000000' || x.bonderFee === '140000000000')) {
        return false
      }
      if (x.destinationChain === 'ethereum') {
        return Number(x.bonderFeeFormatted) > 0.001
      }
      if (['USDC', 'USDT', 'DAI'].includes(x.token)) {
        return Number(x.bonderFeeFormatted) > 0.25
      }
      return Number(x.bonderFeeFormatted) > 0.0001
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
        transferRootId: item.transferRootId,
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
    result = result.filter((x: any) => timestamp > (Number(x.timestamp) + (this.incompleteSettlementsMinTimeToWaitHours * 60 * 60)))
    result = result.filter((x: any) => x.diffFormatted > 0.01)
    this.logger.debug('done fetching incomplete settlements')
    result = result.map((item: any) => {
      return {
        timestamp: item.timestamp,
        transferRootHash: item.rootHash,
        transferRootId: item.rootId,
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
        isSet: item.isSet,
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
    const date = DateTime.now().toUTC()
    const now = date.toSeconds()
    const dayAgo = date.minus({ days: 1 }).toSeconds()
    const endBlockNumber = await getBlockNumberFromDate(Chain.Ethereum, now)
    const startBlockNumber = await getBlockNumberFromDate(Chain.Ethereum, dayAgo)

    const result: any[] = []
    for (const token of this.tokens) {
      this.logger.debug(`done ${token} bridge for challenged roots`)
      const l1BridgeContract = contracts.get(token, Chain.Ethereum).l1Bridge
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

  async getMissedEvents (): Promise<MissedEvent[]> {
    const missedEvents: MissedEvent[] = []
    const sourceChains = [Chain.Polygon, Chain.Gnosis, Chain.Optimism, Chain.Arbitrum]
    const tokens = getEnabledTokens()
    const now = DateTime.now().toUTC()
    const endDate = now.minus({ hours: 1 })
    const startDate = endDate.minus({ days: this.days })
    const filters = {
      startDate: startDate.toISO(),
      endDate: endDate.toISO()
    }
    const promises: Array<Promise<null>> = []
    for (const sourceChain of sourceChains) {
      for (const token of tokens) {
        if (['arbitrum', 'optimism'].includes(sourceChain) && token === 'MATIC') {
          continue
        }
        promises.push(new Promise(async (resolve, reject) => {
          try {
            const db = getDbSet(token)
            this.logger.debug('fetching getTransferIds', sourceChain, token)
            const transfers = await getTransferIds(sourceChain, token, filters)
            this.logger.debug('checking', sourceChain, token, transfers.length)
            for (const transfer of transfers) {
              const { transferId, amount, bonderFee, timestamp } = transfer
              const item = await db.transfers.getByTransferId(transferId)
              if (!item?.transferSentTxHash && !item.withdrawalBonded) {
                missedEvents.push({ token, sourceChain, transferId, amount, bonderFee, timestamp })
              }
            }
            resolve(null)
          } catch (err: any) {
            reject(err)
          }
        }))
      }
    }

    await Promise.all(promises)
    this.logger.debug('done fetching all getTransferIds')

    return missedEvents
  }

  async getInvalidBondWithdrawals (): Promise<InvalidBondWithdrawal[]> {
    const now = DateTime.now().toUTC()
    const endDate = now.minus({ hours: 1 })
    const startDate = endDate.minus({ days: this.days })
    const items = await getInvalidBondWithdrawals(Math.floor(startDate.toSeconds()), Math.floor(endDate.toSeconds()))
    return items.map((item: any) => {
      const { transferId, token, destinationChain, amount, timestamp } = item
      return {
        transferId,
        amount,
        token,
        destinationChain,
        timestamp
      }
    })
  }

  async getUnrelayedTransfers (): Promise<UnrelayedTransfer[]> {
    const now = DateTime.now().toUTC()
    const endDate = now.minus({ hours: 1 })
    const startDate = endDate.minus({ days: this.days })
    const endDateSeconds = Math.floor(endDate.toSeconds())
    const startDateSeconds = Math.floor(startDate.toSeconds())
    const tokens = ''
    const transfersSent = await getTransferSentToL2(Chain.Ethereum, tokens, startDateSeconds, endDateSeconds)

    // There is no relayerFeeTooLow check here but there may need to be. If too many relayer fees are too low, then we can add logic to check for that.

    const missingTransfers: any[] = []
    for (const chain of RelayableChains) {
      // Transfers received needs a buffer so that a transfer that is seen on L1 has time to be seen on L2
      const endDateWithBuffer = endDate.plus({ minutes: 30 })
      const endDateWithBufferSeconds = Math.floor(endDateWithBuffer.toSeconds())
      const transfersReceived = await getTransferFromL1Completed(chain, tokens, startDateSeconds, endDateWithBufferSeconds)

      // L1 to L2 transfers don't have a unique identifier from the perspective of the L1 event, so we need to track which L2 hashes have been observed
      // and can use that to filter out duplicates.
      const receiveHashesFounds: any = {}
      for (const transferSent of transfersSent) {
        const { transactionHash, recipient, amount, amountOutMin, deadline, relayer, relayerFee, token, destinationChainId } = transferSent
        const destinationChain = chainIdToSlug(destinationChainId)
        if (destinationChain !== chain) {
          continue
        }
        let isFound = false
        for (const transferReceived of transfersReceived) {
          if (
            recipient === transferReceived.recipient &&
            amount === transferReceived.amount &&
            amountOutMin === transferReceived.amountOutMin &&
            deadline === transferReceived.deadline &&
            relayer === transferReceived.relayer &&
            relayerFee === transferReceived.relayerFee &&
            !receiveHashesFounds[transferReceived.transactionHash]
          ) {
            isFound = true
            receiveHashesFounds[transferReceived.transactionHash] = true
            break
          }
        }
        if (!isFound) {
          missingTransfers.push({
            transactionHash,
            token,
            recipient,
            destinationChainId,
            amount,
            relayer,
            relayerFee
          })
        }
      }
    }

    return missingTransfers
  }

  async getUnsetTransferRoots (): Promise<UnsetTransferRoot[]> {
    const now = DateTime.now().toUTC()
    const endDate = now.minus({ hours: 1 })
    const startDate = endDate.minus({ days: this.days })
    const items = await getUnsetTransferRoots(Math.floor(startDate.toSeconds()), Math.floor(endDate.toSeconds()))
    return items.map((item: any) => {
      const { rootHash, totalAmount, timestamp } = item
      return {
        transferRootHash: rootHash,
        totalAmount,
        timestamp
      }
    })
  }

  async getDnsServersChanged (): Promise<DnsNameserversChanged[]> {
    try {
      if (expectedNameservers.length === 0) {
        this.logger.debug('getDnsServersChanged: expectedNameservers not set. skipping check')
        return []
      }
      if (!appTld) {
        this.logger.debug('getDnsServersChanged: appTld not set. skipping check')
        return []
      }

      this.logger.debug(`checking expected DNS name servers: domain: ${appTld}, expectedNameservers: ${expectedNameservers}`)

      const servers = await getNameservers(appTld)
      if (!servers.length) {
        throw new Error('getNameservers call returned no nameservers')
      }

      const doesNotMatch = servers.length !== expectedNameservers.length || servers.sort().join(',') !== expectedNameservers.sort().join(',')
      if (doesNotMatch) {
        return [{
          domain: appTld,
          expectedNameservers,
          gotNameservers: servers
        }]
      }

      this.logger.debug(`got expected DNS name servers: domain: ${appTld}, expectedNameservers: ${expectedNameservers}, gotNameservers: ${servers}`)
    } catch (err) {
      this.logger.error('getDnsServersChanged error:', err)
    }

    return []
  }

  async getLowOsResources (): Promise<LowOsResource[]> {
    const lowOsResources: LowOsResource[] = []
    const {
      usedSizeGb: diskUsed,
      totalSizeGb: diskTotal,
      usedPercent: diskPercent
    } = await OsWatcher.getDiskUsage()

    if (diskPercent > 95) {
      lowOsResources.push({
        kind: 'disk',
        used: diskUsed,
        total: diskTotal,
        percent: diskPercent
      })
    }

    const {
      cpuPercent,
      usedMemoryMb: memoryUsed,
      totalMemoryMb: memoryTotal,
      memoryPercent
    } = await OsWatcher.getCpuMemoryUsage()

    if (cpuPercent > 95) {
      lowOsResources.push({
        kind: 'cpu',
        used: '',
        total: '',
        percent: cpuPercent
      })
    }

    if (memoryPercent > 95) {
      lowOsResources.push({
        kind: 'memory',
        used: memoryUsed,
        total: memoryTotal,
        percent: memoryPercent
      })
    }

    return lowOsResources
  }
}
