import Logger from 'src/logger'
import { providers } from 'ethers'

export type RelayL1ToL2MessageOpts = {
  messageIndex?: number
}

export interface IChainWatcher {
  handleCommitTxHash (commitTxHash: string, transferRootId: string, logger: Logger): Promise<void>

  relayL1ToL2Message?(l1TxHash: string, opts?: RelayL1ToL2MessageOpts): Promise<providers.TransactionResponse> 
  relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse>

  getL1InclusionBlock?(l2TxHash: string, l2BlockNumber: number): Promise<providers.Block | undefined>
  getL1BlockOnL2?(l1Block: providers.Block): Promise<providers.Block | undefined>
}
