import os from 'node:os'
import { TextEncoder } from 'node:util'
import { getEnvFilePath } from '#utils/getEnvFilePath.js'
import { loadEnvFile } from 'node:process'

global.TextEncoder = TextEncoder
const envFilePath = getEnvFilePath()
if (envFilePath) {
  loadEnvFile(envFilePath)
}

export const network: string = process.env.NETWORK ?? ''
export const dbPath = process.env.DB_PATH ?? '/tmp/tempdb'
export const privateKey = process.env.PRIVATE_KEY
export const port = Number(process.env.PORT || 8000)
export const ipRateLimitReqPerSec = Number(process.env.IP_RATE_LIMIT_REQ_PER_SEC || 100)
export const ipRateLimitWindowMs = Number(process.env.IP_RATE_LIMIT_WINDOW_MS || 1 * 1000)
export const responseCacheDurationMs = Number(process.env.RESPONSE_CACHE_DURATION_MS || 10 * 1000)
export const defaultConfigDir = `${os.homedir()}/.v2-explorer-backend`
export const defaultConfigFilePath = `${defaultConfigDir}/config.json`
export const defaultKeystoreFilePath = `${defaultConfigDir}/keystore.json`

export const postgresConfig = {
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DBNAME || 'postgres',
  password: process.env.POSTGRES_PASS || 'password',
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
  maxConnections: process.env.POSTGRES_MAX_CONNECTIONS ? parseInt(process.env.POSTGRES_MAX_CONNECTIONS, 10) : 10
}
console.log(postgresConfig)

export const chainNames: any = {
  1: 'Ethereum (Mainnet)',
  10: 'Optimism (Mainnet)',
  420: 'Optimism (Goerli)',
  5: 'Ethereum (Goerli)',
  11155111: 'Ethereum (Sepolia)',
  84532: 'Base (Sepolia)',
  11155420: 'Optimism (Sepolia)'
}

export const rpcUrls: Record<string, string> = {
  '11155111': process.env.RPC_URL_11155111 ?? '',
  '421614': process.env.RPC_URL_421614 ?? '',
  '11155420': process.env.RPC_URL_11155420 ?? '',
  '84532': process.env.RPC_URL_84532 ?? ''
}
