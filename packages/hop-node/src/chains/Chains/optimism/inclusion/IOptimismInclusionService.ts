import Logger from 'src/logger'
import { IInclusionService } from '../../../Services/InclusionService'
import { Signer, providers } from 'ethers'

export interface IOptimismInclusionServiceConfig {
  chainSlug: string
  l1Wallet: Signer
  l2Wallet: Signer
  logger: Logger
}

export interface IOptimismInclusionService extends IInclusionService {
  getLatestL1InclusionTxBeforeBlockNumber?(l1BlockNumber: number): Promise<providers.TransactionReceipt | undefined>
  getLatestL2TxFromL1ChannelTx?(l1InclusionTx: string): Promise<providers.TransactionReceipt | undefined>
}
