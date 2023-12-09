import { IFinalityService } from './Services/FinalityService'
import { IInclusionService } from './Services/InclusionService'
import { IMessageService } from './Services/MessageService'

export enum FinalityBlockTag {
  Safe = 'safe',
  Finalized = 'finalized'
}

export type MessageService = new () => IMessageService
export type InclusionService = new () => IInclusionService
export type FinalityService = new (inclusionService?: IInclusionService) => IFinalityService

export interface IChainBridge extends IMessageService, IInclusionService, IFinalityService {}
