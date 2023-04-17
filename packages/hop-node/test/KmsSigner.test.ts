import { KmsSigner } from 'src/aws/KmsSigner'
import { providers } from 'ethers'

describe('KmsSigner', () => {
  const keyId = '32a977a2-b532-40b3-af2e-f064d3980f75'
  const region = 'us-west-1'
  const signer = new KmsSigner({ keyId, region })
  it('getAddress', async () => {
    const address = await signer.getAddress()
    console.log('address:', address)
    expect(address).toBe('0x38621a41820032e3e1b2787de196b20c19b5df74')
  })
  it('signMessage', async () => {
    const msg = 'Hello World'
    const signature = await signer.signMessage(msg)
    console.log('signature:', signature)
    expect(signature.startsWith('0x')).toBeTruthy()
  })
  it('signTransaction', async () => {
    const transaction = {
      to: '0x0000000000000000000000000000000000000000',
      value: '0x00',
      data: '0x',
      gasLimit: '0x5208',
      gasPrice: '0x4a817c800',
      nonce: '0x00',
      chainId: 1
    }
    const txSignature = await signer.signTransaction(transaction)
    console.log('txSignature:', txSignature)
    expect(txSignature.startsWith('0x')).toBeTruthy()
  })
  it.skip('sendTransaction', async () => {
    const address = await signer.getAddress()
    const transaction = {
      to: address,
      value: '0x00',
      data: '0x',
      gasLimit: '0x5208',
      gasPrice: '0x4a817c800',
      nonce: '0x00',
      chainId: 4
    }
    const provider = new providers.StaticJsonRpcProvider('https://rinkeby.infura.io')
    const tx = await signer.connect(provider).sendTransaction(transaction)
    console.log('tx:', tx)
    expect(tx.hash.startsWith('0x')).toBeTruthy()
  })
})
