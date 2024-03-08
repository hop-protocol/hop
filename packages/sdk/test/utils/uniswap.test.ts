import { getUSDCSwapParams } from '../../src/utils/uniswap'
import { providers, constants } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'

describe('uniswap', () => {
  it('getUSDCSwapParams', async () => {
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
})
