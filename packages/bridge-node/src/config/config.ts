require('dotenv').config()
import os from 'os'
export * from './addresses'

export const bonderPrivateKey = process.env.BONDER_PRIVATE_KEY

export const ipfsHost = process.env.IPFS_HOST || 'http://127.0.0.1:5001'
export const hostname = process.env.HOSTNAME || os.hostname()
