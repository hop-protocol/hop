import { IAbstractChainBridge } from './IAbstractChainBridge'
import { providers } from 'ethers'
import { Chain } from 'src/constants'

export enum MessageDirection {
  L1_TO_L2 = 0,
  L2_TO_L1 = 1
}

export type RelayL1ToL2MessageOpts = {
  messageIndex?: number
}

export type RelayL2ToL1MessageOpts = {
  messageIndex?: number
}


export interface IMessageService {
  relayL1ToL2Message?(l1TxHash: string, opts?: RelayL1ToL2MessageOpts): Promise<providers.TransactionResponse>
  relayL2ToL1Message (l2TxHash: string, opts?: RelayL2ToL1MessageOpts): Promise<providers.TransactionResponse>
}

export interface IInclusionService {
  getL1InclusionTx?(l2TxHash: string): Promise<providers.TransactionReceipt | undefined>
  getL2InclusionTx?(l1TxHash: string): Promise<providers.TransactionReceipt | undefined>
}

export interface IFinalityService {
  getCustomSafeBlockNumber?(): Promise<number | undefined>
}

export interface IChainBridge extends IMessageService, IInclusionService, IFinalityService {}

export type MessageService = new (chainSlug: Chain) => IMessageService
export type InclusionService = new (chainSlug: Chain) => IInclusionService
export type FinalityService = new (chainSlug: Chain, inclusionService?: IInclusionService) => IFinalityService
