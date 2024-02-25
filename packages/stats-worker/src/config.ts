import 'dotenv/config'
import { getDefaultRpcUrl } from './utils/getDefaultRpcProvider.js'
import { mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'

export const pinataApiKey = process.env.PINATA_API_KEY
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY
export const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
export const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
export const awsRegion = process.env.AWS_REGION
export const awsProfile = process.env.AWS_PROFILE
export const dbPath = process.env.SQLITE3_DB ?? './sqlite3.db'
export const coingeckoApiKey = process.env.COINGECKO_API_KEY ?? ''

const tokenSet = new Set<string>([])
const chainSet = new Set<string>([])

const addresses = mainnetAddresses
for (const token in addresses.bridges) {
  tokenSet.add(token)

  for (const chain in addresses.bridges[token]) {
    chainSet.add(chain)
  }
}

export const enabledTokens = Array.from(tokenSet)
export const enabledChains = Array.from(chainSet)

export const etherscanApiKeys: Record<string, string> = {}
export const archiveRpcUrls: Record<string, string> = {}
export const rpcUrls: Record<string, string> = {}

for (const chain of enabledChains) {
  const value = process.env[`ETHERSCAN_${chain.toUpperCase()}_API_KEY`]
  if (value) {
    etherscanApiKeys[chain] = value
  }
}

for (const chain of enabledChains) {
  rpcUrls[chain] =
    process.env[`${chain.toUpperCase()}_RPC`] ?? getDefaultRpcUrl(chain)
}

if (process.env.XDAI_RPC) {
  throw new Error('XDAI_RPC is deprecated, use GNOSIS_RPC instead')
}
if (process.env.XDAI_ARCHIVE_RPC) {
  throw new Error(
    'XDAI_ARCHIVE_RPC is deprecated, use GNOSIS_ARCHIVE_RPC instead'
  )
}

for (const chain of enabledChains) {
  const url = process.env[`${chain.toUpperCase()}_ARCHIVE_RPC`]
  if (url) {
    archiveRpcUrls[chain] = url
  }
}
