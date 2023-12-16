import { IFinalityService } from 'src/chains/Services/FinalityService'
import { IInclusionService } from 'src/chains/Services/InclusionService'
import { IMessageService } from 'src/chains/Services/MessageService'

export enum FinalityBlockTag {
  Safe = 'safe',
  Finalized = 'finalized'
}

export type MessageService = new () => IMessageService
export type InclusionService = new () => IInclusionService
export type FinalityService = new (inclusionService?: IInclusionService) => IFinalityService

export interface IChainBridge extends IMessageService, IInclusionService, IFinalityService {
  hasOwnImplementation(methodName: keyof IChainBridge): boolean
}
