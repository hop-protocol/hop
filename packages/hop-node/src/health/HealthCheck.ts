import contracts from 'src/contracts'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import { config } from 'src/config'
import { wait, chainIdToSlug } from 'src/utils'
import Logger from 'src/logger'
import { Chain } from 'src/constants'
import { DateTime } from 'luxon'

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

    await Promise.all([
      this.checkTransferRootBonded(bridge),
      Promise.all(
        chainIds.map((destinationChainId: number) =>
          this.checkCommiTransfers(bridge, destinationChainId)
        )
      )
    ])
  }

  async checkCommiTransfers (bridge: L2Bridge, destinationChainId: number) {
    const chainId = await bridge.getChainId()
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
      for (let transferId of pendingTransfers) {
        const timestamp = await bridge.getTransferSentTimestamp(transferId)
        if (!timestamp) {
          continue
        }
        const tenMinutesAgo = DateTime.now()
          .minus({ minutes: 10 })
          .toSeconds()
        // skip if transfer sent events are recent (in the last 10 minutes)
        if (timestamp > tenMinutesAgo) {
          continue
        }
        const bondedAmount = await bridge.getBondedWithdrawalAmount(transferId)
        if (bondedAmount.eq(0)) {
          this.logger.debug(
            `(${path}) pending transfer id (${transferId}) has not been bonded yet.`
          )
        }
      }
    }
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
  }

  async checkTransferRootBonded (bridge: L2Bridge) {
    const sourceChain = await bridge.getChainSlug()
    const tokenSymbol = bridge.tokenSymbol
    const path = `${sourceChain}.${tokenSymbol}`

    const l1Bridge = await bridge.getL1Bridge()
    const chainId = await bridge.getChainId()
    const transfersCommittedEvent = await bridge.getLastTransfersCommittedEvent()
    if (!transfersCommittedEvent) {
      return
    }

    const rootHash = transfersCommittedEvent.args.rootHash
    const totalAmount = transfersCommittedEvent.args.totalAmount
    const committedTransferRootId = await l1Bridge.getTransferRootId(
      rootHash,
      totalAmount
    )

    const isConfirmed = await l1Bridge.isTransferRootIdConfirmed(
      committedTransferRootId
    )
    if (!isConfirmed) {
      return
    }

    const committedAt = Number(
      transfersCommittedEvent.args.rootCommittedAt.toString()
    )
    const skipChains: string[] = [Chain.xDai, Chain.Polygon]
    if (skipChains.includes(chainIdToSlug(chainId))) {
      return
    }

    const twentyMinutesAgo = DateTime.now()
      .minus({ minutes: 20 })
      .toSeconds()
    // skip if committed time was less than twenty minutes ago
    if (committedAt > twentyMinutesAgo) {
      return
    }

    const isBonded = await l1Bridge.isTransferRootIdBonded(
      committedTransferRootId
    )
    if (!isBonded) {
      this.logger.warn(
        `(${path}) transferRootId (${committedTransferRootId}) has been committed but not bonded on L1`
      )
      return
    }
  }
}

export default HealthCheck
