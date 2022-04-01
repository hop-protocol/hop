import IncompleteSettlementsWatcher from 'src/watchers/IncompleteSettlementsWatcher'
import L1Bridge from 'src/watchers/classes/L1Bridge'
import Logger from 'src/logger'
import S3Upload from 'src/aws/s3Upload'
import contracts from 'src/contracts'
import getRpcProvider from 'src/utils/getRpcProvider'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import wait from 'src/utils/wait'
import { BigNumber, providers } from 'ethers'
import { Chain } from 'src/constants'
import { TransferBondChallengedEvent } from '@hop-protocol/core/contracts/L1Bridge'
import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils'
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
          const originalAmountFormatted = formatUnits(originalAmount, tokenDecimals)
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
    const challengedRoots = await this.getChallengedRoots()
    const lowBonderBalances = await this.getLowBonderBalances()
    const incompleteSettlements = await this.incompleteSettlementsWatcher.getDiffResults()
    const data = {
      lowBonderBalances,
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
}
