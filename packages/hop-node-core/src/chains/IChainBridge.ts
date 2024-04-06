import { IFinalityService } from './Services/AbstractFinalityService.js'
import { IMessageService } from './Services/AbstractMessageService.js'

export enum FinalityBlockTag {
  Safe = 'safe',
  Finalized = 'finalized'
}

export type ChainServices = {
  messageService: IMessageService
  finalityService: IFinalityService
}

export interface IChainBridge extends IMessageService, IFinalityService {}
