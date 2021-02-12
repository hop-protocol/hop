require('dotenv').config()
export * from './addresses'

export const bonderPrivateKey = process.env.BONDER_PRIVATE_KEY

// Old L2 contract requires different bonder key
export const bonderPrivateKeyOld = process.env.BONDER_PRIVATE_KEY_OLD
