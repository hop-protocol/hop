require('dotenv').config()

export const privateKey = process.env.TEST_USER_PRIVATE_KEY
export const mnemonic = process.env.TEST_MNEMONIC
export const faucetPrivateKey = process.env.TEST_FAUCET_PRIVATE_KEY
export const bonderPrivateKey = process.env.TEST_BONDER_PRIVATE_KEY
export const governancePrivateKey = process.env.TEST_GOVERNANCE_PRIVATE_KEY
