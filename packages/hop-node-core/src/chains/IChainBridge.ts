import type { IFinalityService } from './Services/AbstractFinalityService.js'
import type { IMessageService } from './Services/AbstractMessageService.js'

export enum FinalityBlockTag {
  Safe = 'safe',
  Finalized = 'finalized'
}

export type ChainServices = {
  readonly messageService: IMessageService
  readonly finalityService: IFinalityService
}

export interface IChainBridge extends IMessageService, IFinalityService {}
