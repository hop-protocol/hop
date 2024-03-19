import { getUSDCSwapParams } from '../../src/utils/uniswap'
import { providers, constants } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'

describe('uniswap', () => {
  it.skip('getUSDCSwapParams - mainnet optimism', async () => {
    const provider = new providers.JsonRpcProvider('https://mainnet.optimism.io/')
    const { swapParams, quotedAmountOutFormatted } = await getUSDCSwapParams({
      network: 'mainnet',
      chainId: 420,
      amountIn: parseUnits('10', 6),
      provider,
      recipient: '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69',
      getQuote: true
    })

    console.log('swapParams', swapParams)
    console.log('quotedAmountOut', quotedAmountOutFormatted)
    expect(swapParams).toBeDefined()
  })
  it.skip('getUSDCSwapParams - sepolia ethereum', async () => {
    const provider = new providers.JsonRpcProvider('https://1rpc.io/sepolia')
    const { swapParams, quotedAmountOutFormatted } = await getUSDCSwapParams({
      network: 'sepolia',
      chainId: 11155111,
      amountIn: parseUnits('0.001', 6),
      provider,
      recipient: '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69',
      getQuote: true
    })

    console.log('swapParams', swapParams)
    console.log('quotedAmountOut', quotedAmountOutFormatted)
    expect(swapParams).toBeDefined()
  }, 10 * 1000)
  it.skip('getUSDCSwapParams - goerli ethereum', async () => {
    const provider = new providers.JsonRpcProvider('https://rpc.ankr.com/eth_goerli')
    const { swapParams, quotedAmountOutFormatted } = await getUSDCSwapParams({
      network: 'goerli',
      chainId: 5,
      amountIn: parseUnits('10', 6),
      provider,
      recipient: '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69',
      getQuote: true
    })

    console.log('swapParams', swapParams)
    console.log('quotedAmountOut', quotedAmountOutFormatted)
    expect(swapParams).toBeDefined()
  })
})
