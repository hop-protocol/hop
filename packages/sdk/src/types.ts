import { BigNumberish, Signer, providers } from 'ethers'
import type { Chain, ChainSlug, TokenSymbol } from '@hop-protocol/sdk-core'
import { TokenModel } from '#models/index.js'

/** Chain-ish type */
export type TChain = Chain | ChainSlug | string

/** Token-ish type */
export type TToken = TokenModel | TokenSymbol | string

/** Amount-ish type alias */
export type TAmount = BigNumberish

/** Time-ish type alias */
export type TTime = BigNumberish

/** TimeSlot-ish type alias */
export type TTimeSlot = BigNumberish

/** Signer-ish type */
export type TProvider = Signer | providers.Provider
