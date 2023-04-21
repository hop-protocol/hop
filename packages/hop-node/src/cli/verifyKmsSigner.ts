import { KmsSigner } from 'src/aws/KmsSigner'
import { actionHandler, parseBool, root } from './shared'
import { getRpcProvider } from 'src/utils/getRpcProvider'
import { Chain } from 'src/constants'
import { BigNumber } from 'ethers'
import {
  config as globalConfig
} from 'src/config'

root
  .command('verify-kms-signer')
  .description('Verify a KMS signer')
  .option('--send-test-tx [boolean]', 'Send a test transaction', parseBool)
  .action(actionHandler(main))

async function main (source: any) {
  const { sendTestTx } = source
  const { type, keyId, awsRegion } = globalConfig.signerConfig
  if (type !== 'kms') {
    throw new Error('signer type must be kms')
  }

  if (!keyId || !awsRegion) {
    throw new Error('keyId and awsRegion are required')
  }

  const signer = new KmsSigner({ keyId, region: awsRegion })

  // Get address
  const address = await signer.getAddress()
  console.log(`\nWallet address: ${address}`)

  // Generate signature and recover it
  const msg = 'Hello World'
  const signature = await signer.signMessage(msg)
  const recovered = signer.recoverAddressFromSig(msg, signature)
  if (address !== recovered) {
    throw new Error(`Recovered address does not match: ${address} !== ${recovered}`)
  }
  console.log(`Message ('${msg}') signed by ${address} and recovered as ${recovered}`)

  // Send tx to self
  if (sendTestTx) {
    console.log('\nSending test transaction to self...')
    const address = await signer.getAddress()
    const transaction = {
      to: address
    }
    const provider = getRpcProvider(Chain.Ethereum)
    const tx = await signer.connect(provider!).sendTransaction(transaction)
    const receipt = await tx.wait()
    console.log(`Transaction sent: ${tx.hash}`)
    if (receipt.from !== address) {
      throw new Error(`Transaction sent from ${receipt.from} but expected ${address}`)
    }
    console.log('Transaction verified')
  }
}
