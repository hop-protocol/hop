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

export const rateLimitMaxRetries = 5
export const rpcTimeoutSeconds = 300
