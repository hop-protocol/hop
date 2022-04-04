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
import { Chain } from 'src/constants'
import { DateTime } from 'luxon'
import { TransferBondChallengedEvent } from '@hop-protocol/core/contracts/L1Bridge'
import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils'
import { getUnbondedTransfers } from 'src/theGraph/getUnbondedTransfers'
import { config as globalConfig } from 'src/config'

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

  checks: Record<string, boolean> = {
    lowBonderBalances: true,
    unbondedTransfers: true,
    unbondedTransferRoots: true,
    incompleteSettlements: true,
    challengedRoots: true
  }

  constructor (config: Config) {
    const { days, s3Upload, s3Namespace } = config
    this.incompleteSettlementsWatcher = new IncompleteSettlementsWatcher({
      days,
      format: 'json'
    })
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
      await wait(60 * 1000)
    }
  }

  async poll () {
    this.logger.debug('poll')
    const [
      lowBonderBalances,
      unbondedTransfers,
      unbondedTransferRoots,
      incompleteSettlements,
      challengedRoots
    ] = await Promise.all([
      this.checks.lowBonderBalances ? this.getLowBonderBalances() : Promise.resolve([]),
      this.checks.unbondedTransfers ? this.getUnbondedTransfers() : Promise.resolve([]),
      this.checks.unbondedTransferRoots ? this.getUnbondedTransferRoots() : Promise.resolve([]),
      this.checks.incompleteSettlements ? this.getIncompleteSettlements() : Promise.resolve([]),
      this.checks.challengedRoots ? this.getChallengedRoots() : Promise.resolve([])
    ])

    const data = {
      lowBonderBalances,
      unbondedTransfers,
      unbondedTransferRoots,
      incompleteSettlements,
      challengedRoots
    }
    this.logger.debug('data')
    this.logger.debug(JSON.stringify(data, null, 2))
    if (this.s3Upload) {
      await this.s3Upload.upload(data)
      this.logger.debug(`uploaded to s3 at ${this.s3Filename}`)
    }
    this.logger.debug('poll complete')
  }

  async getLowBonderBalances () {
    const lowBalances: Record<string, BigNumber> = {
      ETH: parseEther('0.5'),
      XDAI: parseEther('100'),
      MATIC: parseEther('100')
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
          native: 'ETH',
          amount: ethBalance.toString(),
          amountFormatted: Number(formatEther(ethBalance.toString()))
        })
      }

      if (xdaiBalance.lt(lowBalances.XDAI)) {
        result.push({
          bonder,
          bridge,
          native: 'XDAI',
          amount: xdaiBalance.toString(),
          amountFormatted: Number(formatEther(xdaiBalance.toString()))
        })
      }

      if (maticBalance.lt(lowBalances.MATIC)) {
        result.push({
          bonder,
          bridge,
          native: 'MATIC',
          amount: maticBalance.toString(),
          amountFormatted: Number(formatEther(maticBalance.toString()))
        })
      }
    }

    this.logger.debug(JSON.stringify(result, null, 2))

    return result
  }

  async getUnbondedTransfers () {
    this.logger.debug('checking for unbonded transfers')

    const timestamp = DateTime.now().toUTC().toSeconds()
    const minMinutes = 20
    let result = await getUnbondedTransfers()
    result = result.filter((x: any) => timestamp > (Number(x.timestamp) + (minMinutes * 60)))
    result = result.filter((x: any) => x.sourceChainSlug !== Chain.Ethereum)

    this.logger.debug(`unbonded transfers: ${result.length}`)
    this.logger.debug(JSON.stringify(result, null, 2))
    this.logger.debug('done checking for unbonded transfers')
    return result
  }

  async getUnbondedTransferRoots () {
    const now = DateTime.now().toUTC()
    const sourceChains = [Chain.Optimism, Chain.Arbitrum]
    const destinationChains = [Chain.Ethereum, Chain.Optimism, Chain.Arbitrum]
    const tokens = ['USDC', 'USDT', 'DAI', 'ETH']
    const startTime = Math.floor(now.minus({ days: 14 }).toSeconds())
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

    const minHours = 6
    result = result.filter((x: any) => endTime > (Number(x.timestamp) + (minHours * 60 * 60)))

    return result
  }

  async getIncompleteSettlements () {
    const timestamp = DateTime.now().toUTC().toSeconds()
    const minHours = 12
    let result = await this.incompleteSettlementsWatcher.getDiffResults()
    result = result.filter((x: any) => timestamp > (Number(x.timestamp) + (minHours * 60 * 60)))
    return result
  }

  async getChallengedRoots () {
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
