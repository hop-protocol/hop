import getRpcProvider from 'src/utils/getRpcProvider'
import { AbstractService } from 'src/chains/Services/AbstractService'
import { Chain } from 'src/constants'
import { providers } from 'ethers'

export interface IInclusionService {
  getL1InclusionTx?(l2TxHash: string): Promise<providers.TransactionReceipt | undefined>
  getL2InclusionTx?(l1TxHash: string): Promise<providers.TransactionReceipt | undefined>
}

export abstract class AbstractInclusionService extends AbstractService {
  protected l1Provider: providers.Provider
  protected l2Provider: providers.Provider

  constructor (chainSlug: string) {
    super(chainSlug)
    this.l1Provider = getRpcProvider(Chain.Ethereum)!
    this.l2Provider = getRpcProvider(this.chainSlug)!
  }
}
