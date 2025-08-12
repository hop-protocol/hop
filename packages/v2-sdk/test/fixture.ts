import { Rails } from '#rails/index.js'
import { type Chain, getChain, getPath } from '#models/index.js'
import { providers } from 'ethers'

type RailsFixture = {
  chains: Chain[]
  rpcs: providers.JsonRpcProvider[]
  rails: Rails
}

export function setUpRails(): RailsFixture {
  const chains = [
    getChain('11155111'),
    getChain('11155420'),
  ]

  const rpcs = [
    new providers.JsonRpcProvider(process.env.ETHEREUM_RPC_PROVIDER),
    new providers.JsonRpcProvider(process.env.OPTIMISM_RPC_PROVIDER)
  ]

  return {
    chains,
    rpcs,
    rails: new Rails(chains, rpcs)
  }
}
