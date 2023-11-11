import AlchemyInclusionService from './inclusion/AlchemyInclusionService'
import InclusionService, { IInclusionService } from '../../Services/InclusionService'
import { IInclusionService as IInclusionServiceTmp, InclusionServiceConfig } from './inclusion/IInclusionService'
import { providers } from 'ethers'

export class Inclusion extends InclusionService implements IInclusionService {
  private readonly inclusionService: IInclusionServiceTmp | undefined

  constructor (chainSlug: string) {
    super(chainSlug)

    const inclusionServiceConfig: InclusionServiceConfig = {
      chainSlug: this.chainSlug,
      l1Wallet: this.l1Wallet,
      l2Wallet: this.l2Wallet,
      logger: this.logger
    }

    this.inclusionService = new AlchemyInclusionService(inclusionServiceConfig)
  }

  async getL1InclusionTx (l2TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    if (!this.inclusionService) return
    return this.inclusionService.getL1InclusionTx(l2TxHash)
  }

  async getL2InclusionTx (l1TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    if (!this.inclusionService) return
    return this.inclusionService.getL2InclusionTx(l1TxHash)
  }
}

export default Inclusion
