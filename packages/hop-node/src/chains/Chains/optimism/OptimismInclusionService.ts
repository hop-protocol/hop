import AlchemyInclusionService from 'src/chains/Chains/optimism/inclusion/AlchemyInclusionService'
import { IInclusionService, InclusionService } from 'src/chains/Services/InclusionService'
import { IOptimismInclusionService, IOptimismInclusionServiceConfig } from 'src/chains/Chains/optimism/inclusion/IOptimismInclusionService'
import { providers } from 'ethers'

export class OptimismInclusionService extends InclusionService implements IInclusionService {
  private readonly inclusionService: IOptimismInclusionService | undefined

  constructor () {
    super()

    const inclusionServiceConfig: IOptimismInclusionServiceConfig = {
      chainSlug: this.chainSlug,
      l1Wallet: this.l1Wallet,
      l2Wallet: this.l2Wallet,
      logger: this.logger
    }

    this.inclusionService = new AlchemyInclusionService(inclusionServiceConfig)
  }

  async getL1InclusionTx (l2TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    if (!this.inclusionService?.getL1InclusionTx) return
    return this.inclusionService.getL1InclusionTx(l2TxHash)
  }

  async getL2InclusionTx (l1TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    if (!this.inclusionService?.getL2InclusionTx) return
    return this.inclusionService.getL2InclusionTx(l1TxHash)
  }
}
