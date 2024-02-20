import { IFinalityService } from '#src/chains/Services/AbstractFinalityService.js'
import { IMessageService } from '#src/chains/Services/AbstractMessageService.js'

export enum FinalityBlockTag {
  Safe = 'safe',
  Finalized = 'finalized'
}

export type ChainServices = {
  messageService: IMessageService
  finalityService: IFinalityService
}

export interface IChainBridge extends IMessageService, IFinalityService {}
