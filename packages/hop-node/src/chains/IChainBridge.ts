import { IFinalityService } from 'src/chains/Services/FinalityService'
import { IMessageService } from 'src/chains/Services/MessageService'

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
