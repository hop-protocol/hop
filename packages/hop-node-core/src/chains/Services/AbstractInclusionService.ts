import { AbstractService } from '../Services/AbstractService.js'
import { ChainSlug } from '@hop-protocol/sdk'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import type { providers } from 'ethers'

export interface IInclusionService {
  getL1InclusionTx?(l2TxHash: string): Promise<providers.TransactionReceipt | undefined>
  getL2InclusionTx?(l1TxHash: string): Promise<providers.TransactionReceipt | undefined>
}

export abstract class AbstractInclusionService extends AbstractService {
  protected l1Provider: providers.Provider
  protected l2Provider: providers.Provider

  constructor (chainSlug: ChainSlug) {
    super(chainSlug)
    this.l1Provider = getRpcProvider(ChainSlug.Ethereum)
    this.l2Provider = getRpcProvider(this.chainSlug as ChainSlug)
  }
}
