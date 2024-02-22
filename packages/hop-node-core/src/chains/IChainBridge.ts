import { IFinalityService } from '#chains/Services/AbstractFinalityService.js'
import { IMessageService } from '#chains/Services/AbstractMessageService.js'

export enum FinalityBlockTag {
  Safe = 'safe',
  Finalized = 'finalized'
}

export type ChainServices = {
  messageService: IMessageService
  finalityService: IFinalityService
}

export interface IChainBridge extends IMessageService, IFinalityService {}
