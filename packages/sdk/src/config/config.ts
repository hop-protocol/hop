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

type Bps = {
  L2ToL1: number
  L2ToL2: number
}

const fees: Record<string, Bps> = {
  USDC: {
    L2ToL1: 18,
    L2ToL2: 18
  },
  USDT: {
    L2ToL1: 18,
    L2ToL2: 18
  },
  DAI: {
    L2ToL1: 18,
    L2ToL2: 18
  },
  MATIC: {
    L2ToL1: 18,
    L2ToL2: 18
  },
  ETH: {
    L2ToL1: 9,
    L2ToL2: 9
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
