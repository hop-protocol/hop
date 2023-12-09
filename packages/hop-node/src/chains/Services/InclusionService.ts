import { AbstractService } from './AbstractService'
import { providers } from 'ethers'

export interface IInclusionService {
  getL1InclusionTx?(l2TxHash: string): Promise<providers.TransactionReceipt | undefined>
  getL2InclusionTx?(l1TxHash: string): Promise<providers.TransactionReceipt | undefined>
  getLatestL1InclusionTxBeforeBlockNumber?(l1BlockNumber: number): Promise<providers.TransactionReceipt | undefined>
  getLatestL2TxFromL1ChannelTx?(l1InclusionTx: string): Promise<providers.TransactionReceipt | undefined>
}

export abstract class InclusionService extends AbstractService {}
