import { Chain } from '@hop-protocol/hop-node-core/src/constants'
import { KmsSigner } from '@hop-protocol/hop-node-core/src/aws/KmsSigner'
import { getRpcProvider } from '@hop-protocol/hop-node-core/src/utils/getRpcProvider'

describe.skip('KmsSigner', () => {
  const keyId = process.env.TEST_KMS_KEY_ID!
  const region = process.env.TEST_KMS_KEY_REGION!
  const ethereumAddressOfKmsKey = process.env.ETHEREUM_ADDRESS_OF_KMS_KEY!
  const signer = new KmsSigner({ keyId, region })
  it('getAddress', async () => {
    const address = await signer.getAddress()
    console.log('address:', address)
    expect(address).toBe(ethereumAddressOfKmsKey)
  })
  it('signMessage', async () => {
    const msg = 'Hello World'
    const signature = await signer.signMessage(msg)
    console.log('signature:', signature)
    expect(signature.startsWith('0x')).toBeTruthy()
  })
  it('recoverAddressFromSig', async () => {
    const msg = 'Hello World'
    const signature = await signer.signMessage(msg)

    const address = await signer.getAddress()
    const recovered = signer.recoverAddressFromSig(msg, signature)
    expect(address).toBe(recovered)
  })
  it('signTransaction', async () => {
    const address = await signer.getAddress()
    const transaction: any = {
      to: address,
      data: '0x12345678',
      value: '0x'
    }
    const txSignature = await signer.signTransaction(transaction)
    console.log('txSignature:', txSignature)
    expect(txSignature.startsWith('0x')).toBeTruthy()

    const recovered = await signer.recoverAddressFromTxSig(transaction, txSignature)
    expect(address).toBe(recovered)
  })
  it('sendTransaction', async () => {
    const address = await signer.getAddress()
    const transaction = { to: address }
    const provider = getRpcProvider(Chain.Ethereum)
    const tx = await signer.connect(provider!).sendTransaction(transaction)
    console.log('tx:', tx)
    expect(tx.hash.startsWith('0x')).toBeTruthy()
  })
})
