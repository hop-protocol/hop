import { BigNumber, Signer, providers } from 'ethers'
import { Chain, Token } from './models'

export type TChain = Chain | string
export type TToken = Token | string
export type TAmount = number | string | BigNumber
export type TProvider = Signer | providers.Provider
