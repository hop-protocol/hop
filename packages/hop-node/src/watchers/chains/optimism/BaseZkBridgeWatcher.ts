import BaseOptimismBridgeWatcher from './BaseOptimismBridgeWatcher'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract?: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

class BaseZkBridgeWatcher extends BaseOptimismBridgeWatcher {
  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })

    // Replace this with SDK function when it becomes available
    this.l1BlockAddr = '0x4200000000000000000000000000000000000015'
    this.sequencerAddress = '0x6088B06c5a187058434655B71057a9ee93E13d0d'
    this.batchInboxAddress = '0xFF00000000000000000000000000000000000010'
  }
}

export default BaseZkBridgeWatcher
