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

const bonders: { [network: string]: { [token: string]: Record<string, Record<string, string>>} } = {
  mainnet: mainnet.bonders,
  staging: staging.bonders,
  kovan: kovan.bonders,
  goerli: goerli.bonders
}

type Bps = {
  ethereum: number
  polygon: number
  xdai: number
  optimism: number
  arbitrum: number
}

const fees: Record<string, Bps> = {
  USDC: {
    ethereum: 14,
    polygon: 14,
    xdai: 25,
    optimism: 14,
    arbitrum: 14
  },
  USDT: {
    ethereum: 23,
    polygon: 23,
    xdai: 25,
    optimism: 23,
    arbitrum: 23
  },
  DAI: {
    ethereum: 23,
    polygon: 23,
    xdai: 25,
    optimism: 23,
    arbitrum: 23
  },
  MATIC: {
    ethereum: 20,
    polygon: 20,
    xdai: 25,
    optimism: 0,
    arbitrum: 0
  },
  ETH: {
    ethereum: 6,
    polygon: 6,
    xdai: 18,
    optimism: 6,
    arbitrum: 6
  },
  WBTC: {
    ethereum: 23,
    polygon: 23,
    xdai: 25,
    optimism: 23,
    arbitrum: 23
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
