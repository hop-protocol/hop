import {
  Hop,
  HopBridge,
  Chain,
  Route,
  // Token,
  TokenAmount,
  Transfer,
  utils
} from '../src/index'
import Token from '../src/models/Token'
import * as addresses from '@hop-protocol/core/addresses'
import { Wallet, providers } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { privateKey } from './config'
// @ts-ignore
import pkg from '../package.json'

describe.skip('sdk setup', () => {
  const hop = new Hop()
  const signer = new Wallet(privateKey)
  it('should return version', () => {
    expect(hop.version).toBe(pkg.version)
  })
})

describe.skip('hop bridge token transfers', () => {
  const hop = new Hop()
  const signer = new Wallet(privateKey)
  it(
    'send token from L1 -> L2',
    async () => {
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await hop
        .connect(signer)
        .bridge(Token.USDC)
        .send(tokenAmount, Chain.Ethereum, Chain.Optimism)

      console.log('tx hash:', tx?.hash)

      expect(tx.hash).toBeTruthy()
    },
    120 * 1000
  )
  it(
    'send token from L2 -> L2',
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
    'send token from L2 -> L1',
    async () => {
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await hop
        .connect(signer)
        .bridge(Token.USDC)
        .send(tokenAmount, Chain.xDai, Chain.Ethereum)

      console.log('tx hash:', tx?.hash)

      expect(tx.hash).toBeTruthy()
    },
    120 * 1000
  )
})

describe.skip('tx watcher', () => {
  const hop = new Hop('mainnet')
  const signer = new Wallet(privateKey)
  it(
    'receive events on token transfer from L1 -> L2 Polygon (no swap)',
    async () => {
      const txHash =
        '0xb92c61e0a1e674eb4c9a52cc692c92709c8a4e4cb66fb22eb7cd9a958cf33a70'
      console.log('tx hash:', txHash)

      await new Promise(resolve => {
        let sourceReceipt: any = null
        let destinationReceipt: any = null

        hop
          .watch(txHash, Token.USDC, Chain.Ethereum, Chain.Polygon)
          .on('receipt', (data: any) => {
            const { receipt, chain } = data
            if (chain.equals(Chain.Ethereum)) {
              sourceReceipt = receipt
              console.log('got source transaction receipt')
            }
            if (chain.equals(Chain.Polygon)) {
              destinationReceipt = receipt
              console.log('got destination transaction receipt')
            }
            if (sourceReceipt && destinationReceipt) {
              resolve(null)
            }
          })
          .on('error', (err: Error) => {
            console.error(err)
            //expect(err).toBeFalsy()
          })
      })
    },
    120 * 1000
  )
  it(
    'receive events on token transfer from L1 -> L2 xDai',
    async () => {
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await hop
        .connect(signer)
        .bridge(Token.USDC)
        .send(tokenAmount, Chain.Ethereum, Chain.xDai)

      console.log('tx hash:', tx?.hash)
      console.log('waiting for receipts')

      await new Promise(resolve => {
        let sourceReceipt: any = null
        let destinationReceipt: any = null

        hop
          .watch(tx.hash, Token.USDC, Chain.Ethereum, Chain.xDai)
          .on('receipt', (data: any) => {
            const { receipt, chain } = data
            if (chain.equals(Chain.Ethereum)) {
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
  it.skip(
    'receive events on token transfer from L2 -> L2',
    async () => {
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await hop
        .connect(signer)
        .bridge(Token.USDC)
        .send(tokenAmount, Chain.xDai, Chain.Optimism)

      const txHash = tx?.hash
      console.log('tx hash:', txHash)
      console.log('waiting for receipts')

      await new Promise(resolve => {
        let sourceReceipt: any = null
        let destinationReceipt: any = null

        hop
          .watch(txHash, Token.USDC, Chain.xDai, Chain.Optimism)
          .on('receipt', (data: any) => {
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

      expect(txHash).toBeTruthy()
    },
    120 * 1000
  )
  it.skip(
    '(mainnet) receive events on token transfer from L2 xDai -> L2 Polygon',
    async () => {
      const tokenAmount = parseUnits('0.1', 18)
      const txHash =
        '0x439ae4839621e13317933e1fa4ca9adab359074090e00e3db1105a982cf9a6ac'

      await new Promise(resolve => {
        let sourceReceipt: any = null
        let destinationReceipt: any = null

        hop
          .watch(txHash, Token.USDC, Chain.xDai, Chain.Polygon, false, {
            destinationHeadBlockNumber: 14779300 // estimate
          })
          .on('receipt', (data: any) => {
            const { receipt, chain } = data
            if (chain.equals(Chain.xDai)) {
              sourceReceipt = receipt
              console.log(
                'got source transaction receipt:',
                receipt.transactionHash
              )
              expect(sourceReceipt.transactionHash).toBe(
                '0x439ae4839621e13317933e1fa4ca9adab359074090e00e3db1105a982cf9a6ac'
              )
            }
            if (chain.equals(Chain.Polygon)) {
              destinationReceipt = receipt
              console.log(
                'got destination transaction receipt:',
                receipt.transactionHash
              )
              expect(destinationReceipt.transactionHash).toBe(
                '0xdcdf05b4171610bab3b69465062e29fab4d6ea3a70ea761336d1fa566dede4a7'
              )
            }
            if (sourceReceipt && destinationReceipt) {
              resolve(null)
            }
          })
      })

      expect(txHash).toBeTruthy()
    },
    300 * 1000
  )
  it(
    'receive events on token transfer from L2 -> L1',
    async () => {
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await hop
        .connect(signer)
        .bridge(Token.USDC)
        .send(tokenAmount, Chain.Ethereum, Chain.xDai)

      console.log('tx hash:', tx?.hash)
      console.log('waiting for receipts')

      await new Promise(resolve => {
        let sourceReceipt: any = null
        let destinationReceipt: any = null

        hop
          .watch(tx.hash, Token.USDC, Chain.Ethereum, Chain.xDai)
          .on('receipt', (data: any) => {
            const { receipt, chain } = data
            if (chain.equals(Chain.Ethereum)) {
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

describe.skip('canonical bridge transfers', () => {
  const hop = new Hop()
  const signer = new Wallet(privateKey)
  it(
    'deposit token from L1 -> xDai L2 canonical bridge',
    async () => {
      const bridge = hop.canonicalBridge(Token.USDC, Chain.xDai)
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await bridge.connect(signer).deposit(tokenAmount)
      console.log('tx:', tx.hash)
      expect(tx.hash).toBeTruthy()
    },
    120 * 1000
  )
  it(
    'withdraw token from xDai L2 canonical bridge -> L1',
    async () => {
      const bridge = hop.canonicalBridge(Token.USDC, Chain.xDai)
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await bridge.connect(signer).withdraw(tokenAmount)
      console.log('tx:', tx.hash)
      expect(tx.hash).toBeTruthy()
    },
    120 * 1000
  )
  it(
    'deposit token from L1 -> Optimism L2 canonical bridge',
    async () => {
      const bridge = hop.canonicalBridge(Token.USDC, Chain.Optimism)
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await bridge.connect(signer).deposit(tokenAmount)
      console.log('tx:', tx.hash)
      expect(tx.hash).toBeTruthy()
    },
    120 * 1000
  )
  it(
    'withdraw token from Optimism L2 canonical bridge -> L1',
    async () => {
      const bridge = hop.canonicalBridge(Token.USDC, Chain.Optimism)
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await bridge.connect(signer).withdraw(tokenAmount)
      console.log('tx:', tx.hash)
      expect(tx.hash).toBeTruthy()
    },
    120 * 1000
  )
  it(
    'deposit token from L1 -> Arbitrum L2 canonical bridge',
    async () => {
      const bridge = hop.canonicalBridge(Token.USDC, Chain.Arbitrum)
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await bridge.connect(signer).deposit(tokenAmount)
      console.log('tx:', tx.hash)
      expect(tx.hash).toBeTruthy()
    },
    120 * 1000
  )
  it(
    'withdraw token from Arbitrum L2 canonical bridge -> L1',
    async () => {
      const bridge = hop.canonicalBridge(Token.USDC, Chain.Arbitrum)
      const tokenAmount = parseUnits('0.1', 18)
      const tx = await bridge.connect(signer).withdraw(tokenAmount)
      console.log('tx:', tx.hash)
      expect(tx.hash).toBeTruthy()
    },
    120 * 1000
  )
})

describe.skip('liqudity provider', () => {
  const hop = new Hop()
  const signer = new Wallet(privateKey)
  it('should add liqudity on xDai', async () => {
    const bridge = hop.bridge(Token.USDC)
    const tokenAmount = parseUnits('0.1', 18)
    const amount0Desired = tokenAmount
    const amount1Desired = tokenAmount
    const tx = await bridge
      .connect(signer)
      .addLiquidity(amount0Desired, amount1Desired, Chain.xDai)
    console.log('tx:', tx.hash)
    expect(tx.hash).toBeTruthy()
  })
  it('should remove liqudity on xDai', async () => {
    const bridge = hop.bridge(Token.USDC)
    const liqudityTokenAmount = parseUnits('0.1', 18)
    const tx = await bridge
      .connect(signer)
      .removeLiquidity(liqudityTokenAmount, Chain.xDai)
    console.log('tx:', tx.hash)
    expect(tx.hash).toBeTruthy()
  })
})

describe('custom addresses', () => {
  it('should set custom addresses', () => {
    const address = '0x1111111111111111111111111111111111111111'
    const newAddresses = Object.assign({}, addresses)
    newAddresses.mainnet.bridges.USDC.xdai.l2CanonicalToken = address

    const sdk = new Hop('mainnet')
    sdk.setConfigAddresses(newAddresses.mainnet)
    expect(sdk.getL2CanonicalTokenAddress('USDC', 'xdai')).toBe(address)

    const bridge = sdk.bridge('USDC')
    expect(bridge.getL2CanonicalTokenAddress('USDC', 'xdai')).toBe(address)
  })
})

describe('approve addresses', () => {
  const sdk = new Hop('mainnet')
  const bridge = sdk.bridge('USDC')
  it('get send approval address (L1 -> L2)', () => {
    const approvalAddress = bridge.getSendApprovalAddress(
      Chain.Ethereum,
      Chain.xDai
    )
    const expectedAddress = addresses.mainnet.bridges.USDC.ethereum.l1Bridge
    expect(approvalAddress).toBe(expectedAddress)
  })
  it('get send approval address (L2 -> L2)', () => {
    const approvalAddress = bridge.getSendApprovalAddress(
      Chain.Polygon,
      Chain.xDai
    )
    const expectedAddress = addresses.mainnet.bridges.USDC.polygon.l2AmmWrapper
    expect(approvalAddress).toBe(expectedAddress)
  })
})
