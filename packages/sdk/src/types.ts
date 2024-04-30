import { BigNumberish, Signer, providers } from 'ethers'
import type { Chain, ChainSlugish, TokenSymbolish } from '@hop-protocol/sdk-core'
import { TokenModel } from '#models/index.js'

/** Chain-ish type */
export type TChain = Chain | ChainSlugish | string

/** Token-ish type */
export type TToken = TokenModel | TokenSymbolish

/** Amount-ish type alias */
export type TAmount = BigNumberish

/** Time-ish type alias */
export type TTime = BigNumberish

/** TimeSlot-ish type alias */
export type TTimeSlot = BigNumberish

/** Signer-ish type */
export type TProvider = Signer | providers.Provider
