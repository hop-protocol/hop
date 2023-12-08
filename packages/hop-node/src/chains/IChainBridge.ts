import { IAbstractChainBridge } from './IAbstractChainBridge'
import { providers } from 'ethers'

export enum FinalityBlockTag {
  Safe = 'safe',
  Finalized = 'finalized'
}
export type RelayL1ToL2MessageOpts = {
  messageIndex?: number
}

export interface IChainBridge extends IAbstractChainBridge {
  // Relay
  relayL1ToL2Message?(l1TxHash: string, opts?: RelayL1ToL2MessageOpts): Promise<providers.TransactionResponse>
  relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse>

  // Inclusion
  getL1InclusionTx?(l2TxHash: string): Promise<providers.TransactionReceipt | undefined>
  getL2InclusionTx?(l1TxHash: string): Promise<providers.TransactionReceipt | undefined>

  // Finality
  getCustomBlockNumber?(blockTag: FinalityBlockTag): Promise<number | undefined>
}
