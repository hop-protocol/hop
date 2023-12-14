import { IFinalityService } from 'src/chains/Services/AbstractFinalityService'
import { IMessageService } from 'src/chains/Services/AbstractMessageService'

export enum FinalityBlockTag {
  Safe = 'safe',
  Finalized = 'finalized'
}

export type ChainServices = {
  messageService?: IMessageService
  finalityService?: IFinalityService
}

export interface IChainBridge extends IMessageService, IFinalityService {
  hasOwnImplementation(methodName: keyof IChainBridge): boolean
}
