import contracts from 'src/contracts'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import { config } from 'src/config'
import { wait } from 'src/utils'
import Logger from 'src/logger'

class HealthCheck {
  logger: Logger
  bridges: L2Bridge[] = []
  minThresholdAmount: number = 100

  constructor () {
    this.logger = new Logger('HealthCheck')
    const tokens: string[] = ['DAI', 'USDC']
    const networks: string[] = ['optimism', 'xdai']
    for (let token of tokens) {
      for (let network of networks) {
        const tokenContracts = contracts.get(token, network)
        const bridgeContract = tokenContracts.l2Bridge
        const bridge = new L2Bridge(bridgeContract)
        this.bridges.push(bridge)
      }
    }
  }

  async start () {
    this.logger.debug('starting health check watcher')
    while (true) {
      await this.check()
      this.logger.debug('waiting 20s for next poll')
      await wait(20 * 1000)
    }
  }

  async check () {
    this.logger.debug('--- poll ---')
    await Promise.all(
      this.bridges.map((bridge: L2Bridge) => this.checkBridge(bridge))
    )
  }

  async checkBridge (bridge: L2Bridge) {
    const chainIds = await bridge.getChainIds()
    await Promise.all(
      chainIds.map((destinationChainId: number) =>
        this.checkCommiTransfers(bridge, destinationChainId)
      )
    )
  }

  async checkCommiTransfers (bridge: L2Bridge, destinationChainId: number) {
    const { providerNetworkId: chainId } = bridge
    const pendingTransfers = await bridge.getPendingTransfers(
      destinationChainId
    )
    const amount = await bridge.getPendingAmountForChainId(destinationChainId)
    const sourceChain = bridge.chainSlug
    const destinationChain = bridge.chainIdToSlug(destinationChainId)
    const tokenSymbol = bridge.tokenSymbol
    const path = `${sourceChain}.${tokenSymbol}→${destinationChain}`
    this.logger.debug(`checking ${path}`)
    if (pendingTransfers.length) {
      const shouldBeCommitted = amount.gte(
        bridge.parseUnits(this.minThresholdAmount)
      )
      if (shouldBeCommitted) {
        this.logger.warn(
          `(${path}) total ${
            pendingTransfers.length
          } pending transfers amount (${bridge.formatUnits(
            amount
          )}) met min threshold (${
            this.minThresholdAmount
          }) but has not committed yet.`
        )
      }
      for (let transferId of pendingTransfers) {
        const bondedAmount = await bridge.getBondedWithdrawalAmount(transferId)
        if (bondedAmount.eq(0)) {
          this.logger.debug(
            `(${path}) pending transfer id (${transferId}) has not been bonded yet.`
          )
        }
      }
    }
  }
}

export default HealthCheck
