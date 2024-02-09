import getRpcProvider from 'src/utils/getRpcProvider'
import { AbstractService } from 'src/chains/Services/AbstractService'
import { Chain } from 'src/constants'
import { TransactionReceipt, Provider } from 'ethers'

export interface IInclusionService {
  getL1InclusionTx?(l2TxHash: string): Promise<TransactionReceipt | undefined>
  getL2InclusionTx?(l1TxHash: string): Promise<TransactionReceipt | undefined>
}

export abstract class AbstractInclusionService extends AbstractService {
  protected l1Provider: Provider
  protected l2Provider: Provider

  constructor (chainSlug: string) {
    super(chainSlug)
    this.l1Provider = getRpcProvider(Chain.Ethereum)
    this.l2Provider = getRpcProvider(this.chainSlug)
  }
}
