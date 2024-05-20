import { Multicall } from '#multicall/index.js'
import { ERC20__factory } from '#contracts/index.js'
import { ChainSlug } from '#chains/index.js'
import { TokenSymbol } from '#tokens/index.js'

describe.skip('Multicall', () => {
  it('Should get balance from custom getter', async () => {
    const accountAddress = '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69'
    const multicall = new Multicall({ network: 'mainnet', accountAddress })
    const balances = await multicall.getBalancesForChain(ChainSlug.Polygon, [{
      abi: ERC20__factory.abi,
      method: 'balanceOf',
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      tokenSymbol: TokenSymbol.DAI
    }, {
      abi: ERC20__factory.abi,
      method: 'balanceOf',
      address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
      tokenSymbol: TokenSymbol.USDC
    }])
    console.log(balances)
    expect(balances.length > 0).toBeTruthy()
  }, 60 * 1000)
  it('Should get result using multicall calldata', async () => {
    const accountAddress = '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69'
    const multicall = new Multicall({ network: 'mainnet', accountAddress })
    const result = await multicall.multicall(ChainSlug.Polygon, [{
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      abi: ERC20__factory.abi,
      method: 'balanceOf',
      args: [accountAddress]
    }])
    console.log(result)
    expect(result).toBeTruthy()
    expect(result[0][0].toString()).toBeTruthy()
  }, 60 * 1000)
})
