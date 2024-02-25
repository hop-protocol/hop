import { BigNumberish, Signer, providers } from 'ethers'
import { Chain, TokenModel } from '@hop-protocol/sdk-core'
import { ChainSlug, TokenSymbol } from './constants/index.js'

/** Chain-ish type */
export type TChain = Chain | ChainSlug | string

/** Token-ish type */
export type TToken = TokenModel | TokenSymbol

/** Amount-ish type alias */
export type TAmount = BigNumberish

/** Time-ish type alias */
export type TTime = BigNumberish

/** TimeSlot-ish type alias */
export type TTimeSlot = BigNumberish

/** Signer-ish type */
export type TProvider = Signer | providers.Provider
