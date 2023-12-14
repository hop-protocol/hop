import Logger from 'src/logger'
import { providers } from 'ethers'
import { IInclusionService } from '../../../Services/InclusionService'
import { Signer, providers } from 'ethers'

export interface IOptimismInclusionServiceConfig {
  chainSlug: string
  l1Provider: providers.Provider
  l2Provider: providers.Provider
  logger: Logger
}

export interface IOptimismInclusionService {
  getLatestL1InclusionTxBeforeBlockNumber?(l1BlockNumber: number): Promise<providers.TransactionReceipt | undefined>
  getLatestL2TxFromL1ChannelTx?(l1InclusionTx: string): Promise<providers.TransactionReceipt | undefined>
}
