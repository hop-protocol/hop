/* eslint-disable */
import dotenv from 'dotenv'
import os from 'os'
import { TextDecoder, TextEncoder } from 'util'
global.TextEncoder = TextEncoder
dotenv.config()

export const dbPath = process.env.DB_PATH ?? '/tmp/tempdb'
export const privateKey = process.env.PRIVATE_KEY
export const port = Number(process.env.PORT || 8000)
export const ipRateLimitReqPerSec = Number(process.env.IP_RATE_LIMIT_REQ_PER_SEC || 100)
export const ipRateLimitWindowMs = Number(process.env.IP_RATE_LIMIT_WINDOW_MS || 1 * 1000)
export const responseCacheDurationMs = Number(process.env.RESPONSE_CACHE_DURATION_MS || 10 * 1000)
export const defaultConfigDir = `${os.homedir()}/.v2-explorer-backend`
export const defaultConfigFilePath = `${defaultConfigDir}/config.json`
export const defaultKeystoreFilePath = `${defaultConfigDir}/keystore.json`

// TODO: read from core
export const sdkContractAddresses = {
  5: {
    startBlock: 8095954,
    hubCoreMessenger: '0xE3F4c0B210E7008ff5DE92ead0c5F6A5311C4FDC',
    spokeCoreMessenger: '0xE3F4c0B210E7008ff5DE92ead0c5F6A5311C4FDC',
    ethFeeDistributor: '0xf6eED903Ac2A34E115547874761908DD3C5fe4bf',
    nftBridge: '' // TODO
  },
  420: {
    startBlock: 3218800,
    spokeCoreMessenger: '0xeA35E10f763ef2FD5634dF9Ce9ad00434813bddB',
    connector: '0x6be2E6Ce67dDBCda1BcdDE7D2bdCC50d34A7eD24',
    nftBridge: '' // TODO
  }
}

export const postgresConfig = {
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DBNAME || 'postgres',
  password: process.env.POSTGRES_PASS || 'password',
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
  maxConnections: process.env.POSTGRES_MAX_CONNECTIONS ? parseInt(process.env.POSTGRES_MAX_CONNECTIONS, 10) : 10
}
