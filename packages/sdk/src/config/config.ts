const { metadata } = require('./metadata')
const mainnet = require('./mainnet')
const staging = require('./staging')
const kovan = require('./kovan')
const goerli = require('./goerli')

const addresses: { [network: string]: any } = {
  mainnet: mainnet.addresses,
  staging: staging.addresses,
  kovan: kovan.addresses,
  goerli: goerli.addresses
}

const chains: { [network: string]: any } = {
  mainnet: mainnet.chains,
  staging: staging.chains,
  kovan: kovan.chains,
  goerli: goerli.chains
}

const bonders: { [network: string]: { [token: string]: string[] } } = {
  mainnet: mainnet.bonders,
  staging: staging.bonders,
  kovan: kovan.bonders,
  goerli: goerli.bonders
}

type FeeBps = {
  L2ToL1BonderFeeBps: number
  L2ToL2BonderFeeBps: number
}

const fees: Record<string, FeeBps> = {
  USDC: {
    L2ToL1BonderFeeBps: 18,
    L2ToL2BonderFeeBps: 18
  },
  USDT: {
    L2ToL1BonderFeeBps: 18,
    L2ToL2BonderFeeBps: 18
  },
  DAI: {
    L2ToL1BonderFeeBps: 18,
    L2ToL2BonderFeeBps: 18
  },
  MATIC: {
    L2ToL1BonderFeeBps: 18,
    L2ToL2BonderFeeBps: 18
  },
  ETH: {
    L2ToL1BonderFeeBps: 18,
    L2ToL2BonderFeeBps: 18
  }
}

const config = {
  addresses,
  chains,
  bonders,
  fees
}

export { metadata, config }

export const bondableChains = ['optimism', 'arbitrum']
