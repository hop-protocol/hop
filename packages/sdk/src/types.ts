import { BigNumberish, Signer, providers } from 'ethers'
import { Chain, Token } from './models'
import { TokenSymbol, ChainSlug } from './constants'

/** Chain-ish type */
export type TChain = Chain | ChainSlug | string

/** Token-ish type */
export type TToken = Token | TokenSymbol

/** Amount-ish type alias */
export type TAmount = BigNumberish

/** Time-ish type alias */
export type TTime = BigNumberish

/** TimeSlot-ish type alias */
export type TTimeSlot = BigNumberish

/** Signer-ish type */
export type TProvider = Signer | providers.Provider
