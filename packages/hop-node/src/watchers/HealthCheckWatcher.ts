import IncompleteSettlementsWatcher from 'src/watchers/IncompleteSettlementsWatcher'
import L1Bridge from 'src/watchers/classes/L1Bridge'
import Logger from 'src/logger'
import S3Upload from 'src/aws/s3Upload'
import contracts from 'src/contracts'
import getRpcProvider from 'src/utils/getRpcProvider'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import getUnbondedTransferRoots from 'src/theGraph/getUnbondedTransferRoots'
import wait from 'src/utils/wait'
import { BigNumber, providers } from 'ethers'
import { Chain, NativeChainToken } from 'src/constants'
import { DateTime } from 'luxon'
import { Notifier } from 'src/notifier'
import { TransferBondChallengedEvent } from '@hop-protocol/core/contracts/L1Bridge'
import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils'
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

type UnbondedTransfer = {
  sourceChain: string
  destinationChain: string
  token: string
  timestamp: number
  transferId: string
  transactionHash: string
  amount: string
  amountFormatted: number
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

type Result = {
  lowBonderBalances: LowBonderBalance[]
  unbondedTransfers: UnbondedTransfer[]
  unbondedTransferRoots: UnbondedTransferRoot[]
  incompleteSettlements: IncompleteSettlement[]
  challengedTransferRoots: ChallengedTransferRoot[]
}

export type Config = {
  days?: number
  s3Upload?: boolean
  s3Namespace?: string
}

export class HealthCheckWatcher {
  tokens: string[] = ['USDC', 'USDT', 'DAI', 'ETH', 'MATIC']
  logger: Logger = new Logger('HealthCheckWatcher')
  s3Upload: S3Upload
  incompleteSettlementsWatcher: IncompleteSettlementsWatcher
  s3Filename: string
  days: number = 1 // days back to check for
  pollIntervalSeconds: number = 300
  notifier: Notifier
  sentMessages: Record<string, boolean> = {}
  lowBalanceThresholds: Record<string, number> = {
    [NativeChainToken.ETH]: 0.5,
    [NativeChainToken.XDAI]: 100,
    [NativeChainToken.MATIC]: 100
  }

  unbondedTransfersMinTimeToWaitMinutes: number = 20
  unbondedTransferRootsMinTimeToWaitHours: number = 6
  incompleteSettlemetsMinTimeToWaitHours: number = 12
  enabledChecks: Record<string, boolean> = {
    lowBonderBalances: true,
    unbondedTransfers: true,
    unbondedTransferRoots: true,
    incompleteSettlements: true,
    challengedTransferRoots: true
  }

  constructor (config: Config) {
    const { days, s3Upload, s3Namespace } = config
    if (days) {
      this.days = days
    }
    this.incompleteSettlementsWatcher = new IncompleteSettlementsWatcher({
      days: this.days,
      format: 'json'
    })
    this.notifier = new Notifier(
      `HealthCheck: ${hostname}`
    )
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
      unbondedTransfers,
      unbondedTransferRoots,
      incompleteSettlements,
      challengedTransferRoots
    ] = await Promise.all([
      this.enabledChecks.lowBonderBalances ? this.getLowBonderBalances() : Promise.resolve([]),
      this.enabledChecks.unbondedTransfers ? this.getUnbondedTransfers() : Promise.resolve([]),
      this.enabledChecks.unbondedTransferRoots ? this.getUnbondedTransferRoots() : Promise.resolve([]),
      this.enabledChecks.incompleteSettlements ? this.getIncompleteSettlements() : Promise.resolve([]),
      this.enabledChecks.challengedTransferRoots ? this.getChallengedTransferRoots() : Promise.resolve([])
    ])

    return {
      lowBonderBalances,
      unbondedTransfers,
      unbondedTransferRoots,
      incompleteSettlements,
      challengedTransferRoots
    }
  }

  private async sendNotifications (result: Result) {
    const {
      lowBonderBalances,
      unbondedTransfers,
      unbondedTransferRoots,
      incompleteSettlements,
      challengedTransferRoots
    } = result

    const messages: string[] = []
    for (const item of lowBonderBalances) {
      const msg = `LowBonderBalance: bonder: ${item.bonder}, chain: ${item.chain}, amount: ${item.amountFormatted} ${item.nativeToken}`
      messages.push(msg)
    }

    for (const item of unbondedTransfers) {
      const msg = `UnbondedTransfer: transferId: ${item.transferId}, source: ${item.sourceChain}, destination: ${item.destinationChain}, amount: ${item.amountFormatted}, token: ${item.token}, transferSentAt: ${item.timestamp}`
      messages.push(msg)
    }

    for (const item of unbondedTransferRoots) {
      const msg = `UnbondedTransferRoot: transferRootHash: ${item.transferRootHash}, source: ${item.sourceChain}, destination: ${item.destinationChain}, totalAmount: ${item.totalAmountFormatted}, token: ${item.token}, committedAt: ${item.timestamp}`
      messages.push(msg)
    }

    for (const item of incompleteSettlements) {
      const msg = `IncompleteSettlements: transferRootHash: ${item.transferRootHash}, source: ${item.sourceChain}, destination: ${item.destinationChain}, totalAmount: ${item.totalAmountFormatted}, diffAmount: ${item.diffAmountFormatted}, token: ${item.token}, committedAt: ${item.timestamp}`
      messages.push(msg)
    }

    for (const item of challengedTransferRoots) {
      const msg = `ChallengedTransferRoot: transferRootHash: ${item.transferRootHash}, transferRootId: ${item.transferRootId}, originalAmount: ${item.originalAmountFormatted}, token: ${item.token}`
      messages.push(msg)
    }

    for (const msg of messages) {
      if (this.sentMessages[msg]) {
        continue
      }
      this.sentMessages[msg] = true
      this.logger.warn(msg)
      if (healthCheckerWarnSlackChannel) {
        this.notifier.warn(msg, { channel: healthCheckerWarnSlackChannel })
      }
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
    await this.sendNotifications(result)
    await this.uploadToS3(result)
  }

  private async getLowBonderBalances (): Promise<LowBonderBalance[]> {
    const lowBalances: Record<string, BigNumber> = {
      [NativeChainToken.ETH]: parseEther(this.lowBalanceThresholds[NativeChainToken.ETH].toString()),
      [NativeChainToken.XDAI]: parseEther(this.lowBalanceThresholds[NativeChainToken.XDAI].toString()),
      [NativeChainToken.MATIC]: parseEther(this.lowBalanceThresholds[NativeChainToken.MATIC].toString())
    }
    const providers: Record<string, providers.Provider> = {
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
        providers[Chain.Ethereum].getBalance(bonder),
        providers[Chain.Gnosis].getBalance(bonder),
        providers[Chain.Polygon].getBalance(bonder)
      ])

      if (ethBalance.lt(lowBalances.ETH)) {
        result.push({
          bonder,
          bridge,
          chain: Chain.Ethereum,
          nativeToken: NativeChainToken.ETH,
          amount: ethBalance.toString(),
          amountFormatted: Number(formatEther(ethBalance.toString()))
        })
      }

      if (xdaiBalance.lt(lowBalances.XDAI)) {
        result.push({
          bonder,
          bridge,
          chain: Chain.Gnosis,
          nativeToken: NativeChainToken.XDAI,
          amount: xdaiBalance.toString(),
          amountFormatted: Number(formatEther(xdaiBalance.toString()))
        })
      }

      if (maticBalance.lt(lowBalances.MATIC)) {
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

    this.logger.debug(JSON.stringify(result, null, 2))

    return result
  }

  private async getUnbondedTransfers (): Promise<UnbondedTransfer[]> {
    this.logger.debug('checking for unbonded transfers')

    const timestamp = DateTime.now().toUTC().toSeconds()
    let result = await getUnbondedTransfers(this.days)
    result = result.filter((x: any) => timestamp > (Number(x.timestamp) + (this.unbondedTransfersMinTimeToWaitMinutes * 60)))
    result = result.filter((x: any) => x.sourceChainSlug !== Chain.Ethereum)

    this.logger.debug(`unbonded transfers: ${result.length}`)
    this.logger.debug('done checking for unbonded transfers')
    return result.map(item => {
      return {
        sourceChain: item.sourceChainSlug,
        destinationChain: item.destinationChainSlug,
        token: item.token,
        timestamp: item.timestamp,
        transferId: item.transferId,
        transactionHash: item.transactionHash,
        amount: item.amount,
        amountFormatted: Number(item.formattedAmount)
      }
    })
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
    let result = await this.incompleteSettlementsWatcher.getDiffResults()
    result = result.filter((x: any) => timestamp > (Number(x.timestamp) + (this.incompleteSettlemetsMinTimeToWaitHours * 60 * 60)))
    this.logger.debug('done fetching incomplete settlements')
    return result.map((item: any) => {
      return {
        timestamp: item.timestamp,
        transferRootHash: item.rootHash,
        sourceChain: item.sourceChain,
        destinationChain: item.destinationChain,
        token: item.token,
        totalAmount: item.totalAmount,
        totalAmountFormatted: item.totalAmountFormatted,
        diffAmount: item.diff,
        diffAmountFormatted: Number(item.diffFormatted),
        settlementEvents: item.settlementEvents,
        withdrewEvents: item.withdrewEvents,
        isConfirmed: item.isConfirmed
      }
    })
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
}
