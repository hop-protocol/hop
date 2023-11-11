import AbstractService from './AbstractService'

export interface IFinalityService {
  getCustomSafeBlockNumber?(): Promise<number | undefined>
}

abstract class FinalityService extends AbstractService {}

export default FinalityService
