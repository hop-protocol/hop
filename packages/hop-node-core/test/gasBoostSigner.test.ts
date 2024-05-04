import { GasBoostSigner } from '#gasboost/GasBoostSigner.js'
import { GasBoostTransaction } from '#gasboost/GasBoostTransaction.js'
import { MemoryStore } from '#gasboost/MemoryStore.js'
import { Wallet } from 'ethers'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { utils } from 'ethers'
import { wait } from '#utils/wait.js'

const privateKey = '0x0000000000000000000000000000000000000000000000000000000000000001'
function expectDefined<T> (arg: T): asserts arg is NonNullable<T> {
  expect(arg).toBeDefined()
}

// eslint-disable-next-line max-lines-per-function
describe.skip('GasBoostSigner', () => {
  it('initialize', async () => {
    const provider = getRpcProvider('gnosis')
    expectDefined(provider)
    expectDefined(privateKey)
    const store = new MemoryStore()
    const wallet = new Wallet(privateKey, provider)
    const signer = new GasBoostSigner(wallet)
    expect(await signer.getAddress()).toBeTruthy()
  })
  it.skip('sendTransaction - gnosis', async () => {
    const provider = getRpcProvider('gnosis')
    expectDefined(provider)
    expectDefined(privateKey)
    const store = new MemoryStore()
    const wallet = new Wallet(privateKey, provider)
    const signer = new GasBoostSigner(wallet, store, {
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
        gasPrice: tx.gasPrice?.toString(),
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
  it.skip('sendTransaction - mainnet', async () => {
    const provider = getRpcProvider('ethereum')
    expectDefined(provider)
    expectDefined(privateKey)
    const store = new MemoryStore()
    const wallet = new Wallet(privateKey, provider)
    const signer = new GasBoostSigner(wallet, store, {
      timeTilBoostMs: 10 * 1000
      // compareMarketGasPrice: false
    })
    const recipient = await signer.getAddress()
    console.log('recipient:', recipient)
    const tx = await signer.sendTransaction({
      to: recipient,
      value: '0',
      maxPriorityFeePerGas: '1'
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
        gasPrice: tx.gasPrice?.toString(),
        maxFeePerGas: tx.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas?.toString(),
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
  it.skip('maxGasBoostReached', async () => {
    const provider = getRpcProvider('gnosis')
    expectDefined(provider)
    expectDefined(privateKey)
    const store = new MemoryStore()
    const wallet = new Wallet(privateKey, provider)
    const signer = new GasBoostSigner(wallet, store, {
      timeTilBoostMs: 5 * 1000,
      compareMarketGasPrice: false,
      maxGasPriceGwei: 0.22,
      gasPriceMultiplier: 1.5
    })
    const recipient = await signer.getAddress()
    console.log('recipient:', recipient)
    const tx = await signer.sendTransaction({
      to: recipient,
      value: '0',
      gasPrice: '100000000' // 0.1 gwei
    })
    expect(tx.hash).toBeTruthy()
    let boostedIndex = 0
    ;(tx as GasBoostTransaction).on('boosted', (boostedTx: any, boostIndex: number) => {
      console.log('boosted', {
        hash: boostedTx.hash,
        gasPrice: tx.gasPrice?.toString(),
        boostIndex
      })
      boostedIndex = boostIndex
    })
    let maxGasPriceReached = false
    ;(tx as GasBoostTransaction).on('maxGasPriceReached', (gasPrice: any, boostIndex: number) => {
      console.log('maxGasPriceReached', {
        gasPrice: gasPrice.toString(),
        boostIndex
      })
      maxGasPriceReached = true
    })
    await wait(30 * 1000)
    expect(maxGasPriceReached).toBeTruthy()
    expect(boostedIndex).toBe(1)
  }, 10 * 60 * 1000)
  it.skip('nonceTooLow', async () => {
    const provider = getRpcProvider('gnosis')
    expectDefined(provider)
    expectDefined(privateKey)
    const store = new MemoryStore()
    const wallet = new Wallet(privateKey, provider)
    const signer = new GasBoostSigner(wallet, store, {
      timeTilBoostMs: 5 * 1000
    })
    const recipient = await signer.getAddress()
    console.log('recipient:', recipient)
    expect(signer.getNonce()).toBe(0)
    let errMsg = ''
    const nonce = await signer.getTransactionCount('pending')
    try {
      const tx = await signer.sendTransaction({
        to: recipient,
        value: '0',
        gasPrice: '100000000', // 0.1 gwei
        nonce: nonce - 1
      })
    } catch (err) {
      errMsg = err.message
    }
    expect(errMsg).toBe('NonceTooLow')
    expect(signer.getNonce()).toBe(nonce + 1)
  }, 10 * 60 * 1000)
  it.skip('reorg test', async () => {
    const chain = 'gnosis'
    const provider = getRpcProvider(chain)
    expectDefined(provider)
    expectDefined(privateKey)
    const store = new MemoryStore()
    const wallet = new Wallet(privateKey, provider)
    const signer = new GasBoostSigner(wallet, store, {
      timeTilBoostMs: 5 * 1000,
      reorgConfirmationBlocks: 2
    })
    const recipient = await signer.getAddress()
    const tx = await signer.sendTransaction({
      to: recipient,
      value: '0'
    })
    let confirmed = false
    ;(tx as GasBoostTransaction).on('confirmed', (tx: any) => {
      confirmed = true
    })
    await tx.wait()
    expect(confirmed).toBeTruthy()

    // set invalid tx hash after confirmation to simulate reorg
    const reorgedTxHash = '0x9999999999999999999999999999999999999999999999999999999999999999'
    ;(tx as GasBoostTransaction).txHash = reorgedTxHash

    // a new nonce is needed to send a rebroadcast tx but in practice
    // the same nonce would be reused
    ;(tx as GasBoostTransaction).originalTxParams.nonce = tx.nonce + 1

    let reorged = false
    ;(tx as GasBoostTransaction).on('reorg', (txHash: string) => {
      reorged = true
      expect(txHash).toBe(reorgedTxHash)
    })
    await wait(20 * 1000)
    expect(reorged).toBeTruthy()
    const receipt = await tx.wait()
    expect((tx as GasBoostTransaction).txHash).toBeTruthy()
    expect((tx as GasBoostTransaction).txHash).not.toBe(reorgedTxHash)
  }, 10 * 60 * 1000)
})

describe.skip('GasBoostTransaction', () => {
  const store = new MemoryStore()
  const provider = getRpcProvider('polygon')
  expectDefined(provider)
  expectDefined(privateKey)
  const wallet = new Wallet(privateKey, provider)
  const signer = new GasBoostSigner(wallet)

  it('should use type 0', async () => {
    const recipient = await signer.getAddress()
    const tx = await signer.sendTransaction({
      type: 0,
      to: recipient,
      value: '0'
    })

    expect(tx).toBeTruthy()
    expect(tx.type).toBe(0)
    expect(tx.gasPrice).toBeTruthy()
  }, 10 * 60 * 1000)

  it('should use type 1', async () => {
    const recipient = await signer.getAddress()
    const tx = await signer.sendTransaction({
      to: recipient,
      value: '0'
    })

    expect(tx).toBeTruthy()
    expect(tx.type).toBe(2)
    expect(tx.gasPrice).toBeFalsy()
  }, 10 * 60 * 1000)
})
