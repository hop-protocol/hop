import { type Chain, type Chainish, getChain } from '#models/index.js'
import { Rails } from '#rails/index.js'
import { providers } from 'ethers'

type Fixture = {
  rails: Rails
  chains: Chain[]
  rpcs: providers.JsonRpcProvider[]
}

export function setUpRails(chains?: Chainish[], rpcs?: providers.JsonRpcProvider[]): Fixture {
  const _chains = chains ? chains.map(getChain) : [
    getChain('11155111'),
    getChain('11155420'),
  ]

  const _rpcs = rpcs ? rpcs : [
    new providers.JsonRpcProvider(process.env.ETHEREUM_RPC_PROVIDER),
    new providers.JsonRpcProvider(process.env.OPTIMISM_RPC_PROVIDER)
  ]

  return {
    rails: new Rails(_chains, _rpcs),
    chains: _chains,
    rpcs: _rpcs
  }
}
