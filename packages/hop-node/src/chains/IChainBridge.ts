import { providers } from 'ethers'

export type RelayL1ToL2MessageOpts = {
  messageIndex?: number
}

export interface IChainBridge {
  relayL1ToL2Message?(l1TxHash: string, opts?: RelayL1ToL2MessageOpts): Promise<providers.TransactionResponse>
  relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse>

  getL1InclusionTx?(l2TxHash: string): Promise<providers.TransactionReceipt | undefined>
  getL2InclusionTx?(l1TxHash: string): Promise<providers.TransactionReceipt | undefined>
}
