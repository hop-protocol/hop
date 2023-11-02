import { metadata } from './metadata'
import * as goerli from './goerli'
import * as mainnet from './mainnet'

const addresses: {[network: string]: any} = {
  mainnet: mainnet.addresses,
  goerli: goerli.addresses
}

const chains: {[network: string]: any} = {
  mainnet: mainnet.chains,
  goerli: goerli.chains
}

const bonders: {[network: string]: {[token: string]: Record<string, Record<string, string>>}} = {
  mainnet: mainnet.bonders,
  goerli: goerli.bonders
}

const bonderFeeBps: {[network: string]: {[token: string]: Record<string, number>}} = {
  mainnet: mainnet.bonderFeeBps,
  goerli: goerli.bonderFeeBps
}

const destinationFeeGasPriceMultiplier: {[network: string]: number} = {
  mainnet: mainnet.destinationFeeGasPriceMultiplier,
  goerli: goerli.destinationFeeGasPriceMultiplier
}

const relayerFeeEnabled: {[network: string]: Record<string, boolean>} = {
  mainnet: mainnet.relayerFeeEnabled,
  goerli: goerli.relayerFeeEnabled
}

const proxyEnabled: {[network: string]: {[token: string]: Record<string, boolean>}} = {
  mainnet: mainnet.proxyEnabled,
  goerli: goerli.proxyEnabled
}

const bridgeDeprecated: {[network: string]: Record<string, boolean>} = {
  mainnet: mainnet.bridgeDeprecated,
  goerli: goerli.bridgeDeprecated
}

const config = {
  addresses,
  chains,
  bonders,
  bonderFeeBps,
  destinationFeeGasPriceMultiplier,
  relayerFeeEnabled,
  proxyEnabled,
  bridgeDeprecated
}

export { metadata, config }

export const bondableChains = ['optimism', 'arbitrum', 'nova', 'zksync', 'linea', 'scrollzk', 'base', 'polygonzk']

export const rateLimitMaxRetries = 3
export const rpcTimeoutSeconds = 60

export const etherscanApiKeys: Record<string, string> = {
  ethereum: process.env.ETHERSCAN_ETHEREUM_API_KEY ?? '',
  polygon: process.env.ETHERSCAN_POLYGON_API_KEY ?? '',
  optimism: process.env.ETHERSCAN_OPTIMISM_API_KEY ?? '',
  arbitrum: process.env.ETHERSCAN_ARBITRUM_API_KEY ?? '',
  gnosis: process.env.ETHERSCAN_GNOSIS_API_KEY ?? '',
  nova: process.env.ETHERSCAN_NOVA_API_KEY ?? '',
  base: process.env.ETHERSCAN_BASE_API_KEY ?? ''
}

export const etherscanApiUrls: Record<string, string> = {
  ethereum: 'https://api.etherscan.io',
  polygon: 'https://api.polygonscan.com',
  optimism: 'https://api-optimistic.etherscan.io',
  arbitrum: 'https://api.arbiscan.io',
  gnosis: 'https://api.gnosisscan.io',
  nova: 'https://api-nova.arbiscan.io',
  base: 'https://api.basescan.org'
}

export const defaultRelayerFeeEth: string = '0.01'
