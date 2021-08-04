import GasBoostSigner from 'src/gasboost/GasBoostSigner'
import GasBoostTransaction from 'src/gasboost/GasBoostTransaction'
import MemoryStore from 'src/gasboost/MemoryStore'
import { Wallet } from 'ethers'
import { getRpcProvider, wait } from 'src/utils'
import { privateKey } from './config'

describe.only('GasBoostSigner', () => {
  it('initialize', async () => {
    const provider = getRpcProvider('xdai')
    const store = new MemoryStore()
    const signer = new GasBoostSigner(privateKey, provider)
    signer.setStore(store)
    expect(await signer.getAddress()).toBeTruthy()
  })
  it.only('sendTransaction', async () => {
    const provider = getRpcProvider('xdai')
    const store = new MemoryStore()
    const signer = new GasBoostSigner(privateKey, provider, store, {
      timeTilBoostMs: 10 * 1000
      // compareMarketGasPrice: false
    })
    const recipient = await signer.getAddress()
    console.log('recipient:', recipient)
    const tx = await signer.sendTransaction({
      to: recipient,
      value: '0',
      gasPrice: '1'
    })
    expect(tx.hash).toBeTruthy()
    let confirmed = false
    ;(tx as GasBoostTransaction).on('confirmed', (tx: any) => {
      confirmed = true
    })
    let boosted = false
    ;(tx as GasBoostTransaction).on('boosted', (boostedTx: any, boostIndex: number) => {
      console.log('boosted', {
        hash: boostedTx.hash,
        gasPrice: tx.gasPrice.toString(),
        boostIndex
      })
      boosted = true
      expect(boostedTx).toBeTruthy()
    })
    await tx.wait()
    await wait(1 * 1000)
    expect(confirmed).toBeTruthy()
    expect(boosted).toBeTruthy()
  }, 10 * 60 * 1000)
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
