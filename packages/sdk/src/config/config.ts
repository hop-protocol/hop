import { metadata } from './metadata'
import * as goerli from './goerli'
import * as kovan from './kovan'
import * as mainnet from './mainnet'
import * as staging from './staging'

const addresses: {[network: string]: any} = {
  mainnet: mainnet.addresses,
  staging: staging.addresses,
  kovan: kovan.addresses,
  goerli: goerli.addresses
}

const chains: {[network: string]: any} = {
  mainnet: mainnet.chains,
  staging: staging.chains,
  kovan: kovan.chains,
  goerli: goerli.chains
}

const bonders: {[network: string]: {[token: string]: Record<string, Record<string, string>>}} = {
  mainnet: mainnet.bonders,
  staging: staging.bonders,
  kovan: kovan.bonders,
  goerli: goerli.bonders
}

const bonderFeeBps: {[network: string]: {[token: string]: Record<string, number>}} = {
  mainnet: mainnet.bonderFeeBps,
  staging: staging.bonderFeeBps,
  kovan: kovan.bonderFeeBps,
  goerli: goerli.bonderFeeBps
}

const destinationFeeGasPriceMultiplier: {[network: string]: number} = {
  mainnet: mainnet.destinationFeeGasPriceMultiplier,
  staging: staging.destinationFeeGasPriceMultiplier,
  kovan: kovan.destinationFeeGasPriceMultiplier,
  goerli: goerli.destinationFeeGasPriceMultiplier
}

const relayerFeeEnabled: {[network: string]: Record<string, boolean>} = {
  mainnet: mainnet.relayerFeeEnabled,
  staging: staging.relayerFeeEnabled,
  kovan: kovan.relayerFeeEnabled,
  goerli: goerli.relayerFeeEnabled
}

const config = {
  addresses,
  chains,
  bonders,
  bonderFeeBps,
  destinationFeeGasPriceMultiplier,
  relayerFeeEnabled
}

export { metadata, config }

export const bondableChains = ['optimism', 'arbitrum']
export const relayableChains = ['arbitrum']

export const rateLimitMaxRetries = 1
export const rpcTimeoutSeconds = 2 * 60

export const etherscanApiKeys: Record<string, string> = {
  ethereum: process.env.ETHERSCAN_API_KEY ?? '',
  polygon: process.env.POLYGONSCAN_API_KEY ?? '',
  optimism: process.env.OPTIMISM_API_KEY ?? '',
  arbitrum: process.env.ARBITRUM_API_KEY ?? '',
  gnosis: process.env.XDAI_API_KEY ?? ''
}

export const etherscanApiUrls: Record<string, string> = {
  ethereum: 'https://api.etherscan.io',
  polygon: 'https://api.polygonscan.com',
  optimism: 'https://api-optimistic.etherscan.io',
  arbitrum: 'https://api.arbiscan.io',
  gnosis: 'https://api.gnosisscan.io'
}
