import { Chain } from 'src/constants'
import { IFinalityService } from './Services/FinalityService'
import { IInclusionService } from './Services/InclusionService'
import { IMessageService } from './Services/MessageService'

export type RelayL1ToL2MessageOpts = {
  messageIndex?: number
}

export type MessageService = new (chainSlug: Chain) => IMessageService
export type InclusionService = new (chainSlug: Chain) => IInclusionService
export type FinalityService = new (chainSlug: Chain, inclusionService?: IInclusionService) => IFinalityService

export interface IChainBridge extends IMessageService, IInclusionService, IFinalityService {}
