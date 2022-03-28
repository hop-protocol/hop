require('dotenv').config()

export const pinataApiKey = process.env.PINATA_API_KEY
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY
export const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
export const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
export const awsRegion = process.env.AWS_REGION
export const awsProfile = process.env.AWS_PROFILE
export const ethereumRpc = process.env.ETHEREUM_RPC
export const gnosisRpc = process.env.XDAI_RPC
export const gnosisArchiveRpc = process.env.XDAI_ARCHIVE_RPC
export const polygonRpc = process.env.POLYGON_RPC
export const optimismRpc = process.env.OPTIMISM_RPC
export const arbitrumRpc = process.env.ARBITRUM_RPC
export const dbPath = process.env.SQLITE3_DB || './sqlite3.db'
export const etherscanApiKeys: Record<string, string> = {
  ethereum: process.env.ETHERSCAN_ETHEREUM_API_KEY,
  optimism: process.env.ETHERSCAN_OPTIMISM_API_KEY,
  arbitrum: process.env.ETHERSCAN_ARBITRUM_API_KEY,
  polygon: process.env.ETHERSCAN_POLYGON_API_KEY,
  gnosis: process.env.ETHERSCAN_GNOSIS_API_KEY
}
