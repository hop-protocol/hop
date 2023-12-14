import { AbstractService } from 'src/chains/Services/AbstractService'
import { FinalityBlockTag } from 'src/chains/IChainBridge'

export interface IFinalityService {
  getCustomBlockNumber?(blockTag: FinalityBlockTag): Promise<number | undefined>
}

export abstract class FinalityService extends AbstractService {}
