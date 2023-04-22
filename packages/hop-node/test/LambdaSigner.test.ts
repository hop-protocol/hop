import { LambdaSigner } from 'src/aws/LambdaSigner'
import { Chain } from 'src/constants'
import { getRpcProvider } from 'src/utils/getRpcProvider'

describe.only('KmsSigner', () => {
  const keyId = process.env.TEST_KMS_KEY_ID!
  const region = process.env.TEST_KMS_KEY_REGION!
  const ethereumAddressOfKmsKey = process.env.ETHEREUM_ADDRESS_OF_KMS_KEY!
  const lambdaFunctionName = process.env.TEST_LAMBDA_FUNCTION_NAME!
  const signer = new LambdaSigner({ keyId, region, lambdaFunctionName })
  it('getAddress', async () => {
    const address = await signer.getAddress()
    console.log('address:', address)
    expect(address).toBe(ethereumAddressOfKmsKey)
  })
  it('signMessage', async () => {
    const msg = 'Hello World'
    const errMsg = 'Signing arbitrary messages is not supported. LambdaSigner performs validation on transactions. Validation can be bypassed with arbitrary data.'
    expect(signer.signMessage(msg)).rejects.toThrow(errMsg)
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
  it.skip('sendTransaction', async () => {
    const address = await signer.getAddress()
    const transaction = { to: address }
    const provider = getRpcProvider(Chain.Ethereum)
    const tx = await signer.connect(provider!).sendTransaction(transaction)
    console.log('tx:', tx)
    expect(tx.hash.startsWith('0x')).toBeTruthy()
  })
})
