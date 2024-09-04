import type { BondInput as BondInputSDK } from '../../RailsSDK.js'

export enum RailsTransferFunctions {
  Bond = 'bond'
}

export interface BondInput extends BondInputSDK {}

export type IRailsTransferRelayItem = BondInput
