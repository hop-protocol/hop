import { Bridges } from '@hop-protocol/core/addresses'

export interface IProposalDetail {
  target: string
  functionSig: string
  callData: string
}

export interface IProposal {
  id: string
  title: string
  description: string
  proposer: string
  status: string
  forCount: number
  againstCount: number
  startBlock: number
  endBlock: number
  details: IProposalDetail[]
}

export interface HopAddresses {
  governance: {
    l1Hop: string
    stakingRewardsFactory: string
    stakingRewards: string
    governorAlpha: string
  }
  tokens: Bridges
  bonders: {[token: string]: string[]}
}

export type Networks = {
  [key: string]: {
    networkId: string
    rpcUrls: string[]
    explorerUrl: string,
    nativeBridgeUrl?: string
  }
}
