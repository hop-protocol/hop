import {
  Hop,
  HopBridge,
  Chain,
  Route,
  Token,
  TokenAmount,
  Transfer,
  utils
} from '../src/index'
import { Wallet, providers } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { privateKey } from './config'
import pkg from '../package.json'

describe('sdk', () => {
  const hop = new Hop()
  const signer = new Wallet(privateKey)
  it('version', () => {
    expect(hop.version).toBe(pkg.version)
  })
  it(
    'send - L1 -> L2',
    async () => {
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await hop
        .connect(signer)
        .bridge(Token.USDC)
        .send(tokenAmount, Chain.Kovan, Chain.Optimism)

      console.log('tx hash:', tx?.hash)

      expect(tx.hash).toBeTruthy()
    },
    120 * 1000
  )
  it(
    'send - L2 -> L2',
    async () => {
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await hop
        .connect(signer)
        .bridge(Token.USDC)
        .send(tokenAmount, Chain.Optimism, Chain.xDai)

      console.log('tx hash:', tx?.hash)

      expect(tx.hash).toBeTruthy()
    },
    120 * 1000
  )
  it(
    'send - L2 -> L1',
    async () => {
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await hop
        .connect(signer)
        .bridge(Token.USDC)
        .send(tokenAmount, Chain.xDai, Chain.Kovan)

      console.log('tx hash:', tx?.hash)

      expect(tx.hash).toBeTruthy()
    },
    120 * 1000
  )
  it(
    'tx watcher - L1 -> L2',
    async () => {
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await hop
        .connect(signer)
        .bridge(Token.USDC)
        .send(tokenAmount, Chain.Kovan, Chain.xDai)

      console.log('tx hash:', tx?.hash)
      console.log('waiting for receipts')

      await new Promise(resolve => {
        let sourceReceipt = null
        let destinationReceipt = null

        hop
          .watch(tx.hash, Token.USDC, Chain.Kovan, Chain.xDai)
          .on('receipt', data => {
            const { receipt, chain } = data
            if (chain.equals(Chain.Kovan)) {
              sourceReceipt = receipt
              console.log('got source transaction receipt')
            }
            if (chain.equals(Chain.xDai)) {
              destinationReceipt = receipt
              console.log('got destination transaction receipt')
            }
            if (sourceReceipt && destinationReceipt) {
              resolve(null)
            }
          })
      })

      expect(tx.hash).toBeTruthy()
    },
    120 * 1000
  )
  it(
    'tx watcher - L2 -> L2',
    async () => {
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await hop
        .connect(signer)
        .bridge(Token.USDC)
        .send(tokenAmount, Chain.xDai, Chain.Optimism)

      console.log('tx hash:', tx?.hash)
      console.log('waiting for receipts')

      await new Promise(resolve => {
        let sourceReceipt = null
        let destinationReceipt = null

        hop
          .watch(tx.hash, Token.USDC, Chain.xDai, Chain.Optimism)
          .on('receipt', data => {
            const { receipt, chain } = data
            if (chain.equals(Chain.xDai)) {
              sourceReceipt = receipt
              console.log(
                'got source transaction receipt:',
                receipt.transactionHash
              )
            }
            if (chain.equals(Chain.Optimism)) {
              destinationReceipt = receipt
              console.log(
                'got destination transaction receipt:',
                receipt.transactionHash
              )
            }
            if (sourceReceipt && destinationReceipt) {
              resolve(null)
            }
          })
      })

      expect(tx.hash).toBeTruthy()
    },
    120 * 1000
  )
  it(
    'tx watcher - L2 -> L1',
    async () => {
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await hop
        .connect(signer)
        .bridge(Token.USDC)
        .send(tokenAmount, Chain.Kovan, Chain.xDai)

      console.log('tx hash:', tx?.hash)
      console.log('waiting for receipts')

      await new Promise(resolve => {
        let sourceReceipt = null
        let destinationReceipt = null

        hop
          .watch(tx.hash, Token.USDC, Chain.Kovan, Chain.xDai)
          .on('receipt', data => {
            const { receipt, chain } = data
            if (chain.equals(Chain.Kovan)) {
              sourceReceipt = receipt
              console.log('got source transaction receipt')
            }
            if (chain.equals(Chain.xDai)) {
              destinationReceipt = receipt
              console.log('got destination transaction receipt')
            }
            if (sourceReceipt && destinationReceipt) {
              resolve(null)
            }
          })
      })

      expect(tx.hash).toBeTruthy()
    },
    120 * 1000
  )
  it(
    'getAmountOut - L2 -> L2',
    async () => {
      const tokenAmount = parseUnits('1', 18)
      const amountOut = await hop
        .connect(signer)
        .bridge(Token.USDC)
        .getAmountOut(tokenAmount, Chain.xDai, Chain.Optimism)

      expect(Number(formatUnits(amountOut.toString(), 18))).toBeGreaterThan(0)
    },
    10 * 1000
  )
})
