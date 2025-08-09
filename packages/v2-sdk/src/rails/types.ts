import type { Signer, providers } from 'ethers'

type RPCUrl = string

// TODO: Add web3 and viem versions
export type RPCish = Signer | providers.Provider | RPCUrl
