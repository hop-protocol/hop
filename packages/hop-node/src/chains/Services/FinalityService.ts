import { AbstractService } from 'src/chains/Services/AbstractService'
import { FinalityBlockTag } from 'src/chains/IChainBridge'
import { providers } from 'ethers'

export interface IFinalityService {
  // Inclusion
  getL1InclusionTx?(l2TxHash: string): Promise<providers.TransactionReceipt | undefined>
  getL2InclusionTx?(l1TxHash: string): Promise<providers.TransactionReceipt | undefined>

  // Block number
  getCustomBlockNumber?(blockTag: FinalityBlockTag): Promise<number | undefined>
}

export abstract class FinalityService extends AbstractService {}
