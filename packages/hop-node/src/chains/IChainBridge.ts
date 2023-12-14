import { IFinalityService } from 'src/chains/Services/FinalityService'
import { IInclusionService } from 'src/chains/Services/InclusionService'
import { IMessageService } from 'src/chains/Services/MessageService'

export enum FinalityBlockTag {
  Safe = 'safe',
  Finalized = 'finalized'
}

type MessageService = new (chainSlug: string) => IMessageService
type InclusionService = new (chainSlug: string) => IInclusionService
type FinalityService = new (chainSlug: string, inclusionService?: IInclusionService) => IFinalityService

export type ChainServices = {
  MessageService?: MessageService
  InclusionService?: InclusionService
  FinalityService?: FinalityService
}

export interface IChainBridge extends IMessageService, IInclusionService, IFinalityService {
  hasOwnImplementation(methodName: keyof IChainBridge): boolean
}
