import { AbstractService } from 'src/chains/Services/AbstractService'
import { FinalityBlockTag } from 'src/chains/IChainBridge'
import { providers } from 'ethers'
import { CacheService } from 'src/chains/Services/CacheService'

export interface IFinalityService {
  // Inclusion
  getL1InclusionTx?(l2TxHash: string): Promise<providers.TransactionReceipt | undefined>
  getL2InclusionTx?(l1TxHash: string): Promise<providers.TransactionReceipt | undefined>

  // Block number
  getCustomBlockNumber?(blockTag: FinalityBlockTag): Promise<number | undefined>
}

export abstract class AbstractFinalityService extends AbstractService {
  protected cache: CacheService

  constructor (chainSlug: string) {
    super(chainSlug)

    this.cache = new CacheService()
  }
}
