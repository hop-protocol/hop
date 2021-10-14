require('dotenv').config() // eslint-disable-line @typescript-eslint/no-var-requires

function mustSetEnvVar (envVar: string): string {
  const val = process.env[envVar]
  if (!val) {
    throw new Error(`${envVar} not set`)
  }
  return val
}

export const privateKey = mustSetEnvVar('TEST_USER_PRIVATE_KEY')
export const mnemonic = mustSetEnvVar('TEST_MNEMONIC')
export const faucetPrivateKey = mustSetEnvVar('TEST_FAUCET_PRIVATE_KEY')
export const bonderPrivateKey = mustSetEnvVar('TEST_BONDER_PRIVATE_KEY')
export const governancePrivateKey = mustSetEnvVar('TEST_GOVERNANCE_PRIVATE_KEY')
