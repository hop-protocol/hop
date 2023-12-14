import { providers } from 'ethers'

export interface IOptimismInclusionServiceConfig {
  chainSlug: string
  l1Provider: providers.Provider
  l2Provider: providers.Provider
}

export interface IOptimismInclusionService {
  getL1InclusionTx(l2TxHash: string): Promise<providers.TransactionReceipt | undefined>
  getL2InclusionTx(l1TxHash: string): Promise<providers.TransactionReceipt | undefined>

  getLatestL1InclusionTxBeforeBlockNumber?(l1BlockNumber: number): Promise<providers.TransactionReceipt | undefined>
  getLatestL2TxFromL1ChannelTx?(l1InclusionTx: string): Promise<providers.TransactionReceipt | undefined>
}
