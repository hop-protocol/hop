import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import { IChainWatcher } from './classes/IChainWatcher'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { providers } from 'ethers'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract?: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

class LineaBridgeWatcher extends BaseWatcher implements IChainWatcher {
  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'yellow',
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
  }

  async handleCommitTxHash (commitTxHash: string, transferRootId: string, logger: Logger): Promise<void> {
    throw new Error('unimplemented')
  }

  async relayL2ToL1Message (txHash: string): Promise<providers.TransactionResponse> {
    throw new Error('unimplemented')
  }
}

export default LineaBridgeWatcher
