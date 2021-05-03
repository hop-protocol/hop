import { Signer, providers, BigNumberish } from 'ethers'
import { Chain, Token } from './models'

/** Chain-ish type */
export type TChain = Chain | string

/** Token-ish type */
export type TToken = Token | string

/** Amount-ish type alias */
export type TAmount = BigNumberish

/** Signer-ish type */
export type TProvider = Signer | providers.Provider
