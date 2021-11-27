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
    ethereum: 18,
    polygon: 18,
    xdai: 25,
    optimism: 18,
    arbitrum: 18
  },
  DAI: {
    ethereum: 18,
    polygon: 18,
    xdai: 25,
    optimism: 18,
    arbitrum: 18
  },
  MATIC: {
    ethereum: 18,
    polygon: 18,
    xdai: 25,
    optimism: 0,
    arbitrum: 0
  },
  ETH: {
    ethereum: 8,
    polygon: 9,
    xdai: 18,
    optimism: 9,
    arbitrum: 9
  },
  WBTC: {
    ethereum: 18,
    polygon: 18,
    xdai: 25,
    optimism: 18,
    arbitrum: 18
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
