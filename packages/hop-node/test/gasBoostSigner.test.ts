import GasBoostSigner from 'src/gasboost/GasBoostSigner'
import GasBoostTransaction from 'src/gasboost/GasBoostTransaction'
import MemoryStore from 'src/gasboost/MemoryStore'
import { Wallet } from 'ethers'
import { getRpcProvider } from 'src/utils'
import { privateKey } from './config'

describe('GasBoostSigner', () => {
  it('initialize', async () => {
    const provider = getRpcProvider('xdai')
    const store = new MemoryStore()
    const signer = new GasBoostSigner(privateKey, provider)
    signer.setStore(store)
    expect(await signer.getAddress()).toBeTruthy()
  })
})

describe('GasBoostTransaction', () => {
  const store = new MemoryStore()
  const provider = getRpcProvider('xdai')
  const signer = new Wallet(privateKey, provider)

  it('instance', () => {
    const gTx = new GasBoostTransaction({
      to: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
      value: '1'
    }, signer, store)

    expect(gTx.id).toBeTruthy()
  })
})
