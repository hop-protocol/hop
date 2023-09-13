import AbstractOptimismBridgeWatcher from './AbstractOptimismBridgeWatcher'
import { Contract } from 'ethers'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'

// TODO: DRY up
type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract?: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

class OptimismBridgeWatcher extends AbstractOptimismBridgeWatcher {
  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })

    // Replace this with SDK function when it becomes available
    this.l1BlockAddr = '0x4200000000000000000000000000000000000015'
    this.sequencerAddress = '0x6887246668a3b87F54DeB3b94Ba47a6f63F32985'
    this.batchInboxAddress = '0xFF00000000000000000000000000000000000010'
    this.l1BlockContract = new Contract(this.l1BlockAddr, this.l1BlockAbi, this.l2Provider)
  }
}

export default OptimismBridgeWatcher
