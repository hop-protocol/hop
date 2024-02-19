import { Chain } from '@hop-protocol/hop-node-core/src/constants'
import { LambdaSigner } from '@hop-protocol/hop-node-core/src/aws/LambdaSigner'
import { getRpcProvider } from '@hop-protocol/hop-node-core/src/utils/getRpcProvider'

describe.skip('LambdaSigner', () => {
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
    await expect(signer.signMessage(msg)).rejects.toThrow(errMsg)
  })
  it('signTransaction', async () => {
    const address = await signer.getAddress()
    const transaction: any = {
      to: '0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1',
      data: '0x8d8798bf',
      value: '0x'
    }
    const txSignature = await signer.signTransaction(transaction)
    console.log('txSignature:', txSignature)
    expect(txSignature.startsWith('0x')).toBeTruthy()

    const recovered = await signer.recoverAddressFromTxSig(transaction, txSignature)
    expect(address).toBe(recovered)
  })
  it('sign invalid tx (to)', async () => {
    const transaction: any = {
      to: '0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd2',
      data: '0x8d8798bf',
      value: '0x'
    }
    const errMsg = 'Error signing message'
    await expect(signer.signTransaction(transaction)).rejects.toThrow(errMsg)
  })
  it('sign invalid tx (data)', async () => {
    const transaction: any = {
      to: '0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1',
      data: '0x8d8798ba',
      value: '0x'
    }
    const errMsg = 'Error signing message'
    await expect(signer.signTransaction(transaction)).rejects.toThrow(errMsg)
  })
  it('sign invalid tx (value)', async () => {
    const transaction: any = {
      to: '0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1',
      data: '0x8d8798bf',
      value: '0x1'
    }
    const errMsg = 'Error signing message'
    await expect(signer.signTransaction(transaction)).rejects.toThrow(errMsg)
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
