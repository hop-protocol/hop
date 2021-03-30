require('dotenv').config()
import os from 'os'
import path from 'path'
export * from './addresses'

const defaultDbPath = path.resolve(__dirname, '../../../db_data')
export const db = {
  path: defaultDbPath
}

export const bonderPrivateKey = process.env.BONDER_PRIVATE_KEY
if (!bonderPrivateKey) {
  throw new Error('BONDER_PRIVATE_KEY is required')
}

export const ipfsHost = process.env.IPFS_HOST || 'http://127.0.0.1:5001'
export const hostname = process.env.HOSTNAME || os.hostname()
