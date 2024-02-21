import { BigNumberish, Signer, providers } from 'ethers'
import { models } from '@hop-protocol/sdk-core'
import { ChainSlug, TokenSymbol } from './constants'

/** Chain-ish type */
export type TChain = models.Chain | ChainSlug | string

/** Token-ish type */
export type TToken = models.Token | TokenSymbol

/** Amount-ish type alias */
export type TAmount = BigNumberish

/** Time-ish type alias */
export type TTime = BigNumberish

/** TimeSlot-ish type alias */
export type TTimeSlot = BigNumberish

/** Signer-ish type */
export type TProvider = Signer | providers.Provider
