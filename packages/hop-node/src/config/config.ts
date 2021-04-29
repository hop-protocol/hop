require('dotenv').config()
import os from 'os'
import path from 'path'
export * from './addresses'

const defaultDbPath = path.resolve(__dirname, '../../../db_data')
export const db = {
  path: defaultDbPath
}

export const ipfsHost = process.env.IPFS_HOST || 'http://127.0.0.1:5001'
export const hostname = process.env.HOSTNAME || os.hostname()
export const slackChannel = process.env.SLACK_CHANNEL
export const slackAuthToken = process.env.SLACK_AUTH_TOKEN
export const slackUsername = process.env.SLACK_USERNAME || 'Hop Node'

export const metadata = {
  tokens: {
    DAI: {
      symbol: 'DAI',
      name: 'DAI Stablecoin',
      decimals: 18
    },
    ARB: {
      symbol: 'ARB',
      name: 'ARB Token',
      decimals: 18
    },
    sETH: {
      symbol: 'sETH',
      name: 'Synth ETH',
      decimals: 18
    },
    sBTC: {
      symbol: 'sBTC',
      name: 'Synth BTC',
      decimals: 18
    },
    USDC: {
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6
    },
    WBTC: {
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      decimals: 18
    }
  }
}
