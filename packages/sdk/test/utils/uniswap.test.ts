import { getSwapParams } from '../../src/utils/uniswap'
import { providers, constants } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'

describe.skip('uniswap', () => {
  it('getSwapParams', async () => {
    const provider = new providers.JsonRpcProvider('https://mainnet.optimism.io/')
    const swapParams = await getSwapParams({
      network: 'mainnet',
      chainId: 420,
      amountIn: parseUnits('1', 6),
      provider,
      recipient: constants.AddressZero,
    })

    console.log('swapParams', swapParams)
    expect(swapParams).toBeDefined()
  })
})
