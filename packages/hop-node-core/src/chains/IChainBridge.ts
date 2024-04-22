import type { IFinalityService } from './Services/AbstractFinalityService.js'
import type { IMessageService } from './Services/AbstractMessageService.js'

export enum FinalityBlockTag {
  Safe = 'safe',
  Finalized = 'finalized'
}

export type ChainServices = {
  messageService: IMessageService
  finalityService: IFinalityService
}

export interface IChainBridge extends IMessageService, IFinalityService {}
