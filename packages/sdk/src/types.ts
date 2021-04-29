import { BigNumber, Signer, providers } from 'ethers'
import { Chain, Token } from './models'

/** Chain-ish type */
export type TChain = Chain | string

/** Token-ish type */
export type TToken = Token | string

/** Amount-ish type */
export type TAmount = number | string | BigNumber

/** Signer-ish type */
export type TProvider = Signer | providers.Provider
