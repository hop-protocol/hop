import { Multicall } from '#multicall/index.js'
import { ERC20__factory } from '#contracts/index.js'

describe.skip('Multicall', () => {
  it('Should get multicall address for chain', async () => {
    const accountAddress = '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69'
    const multicall = new Multicall({ network: 'mainnet', accountAddress })
    const address = multicall.getMulticallAddressForChain('optimism')
    console.log(address)
    expect(address).toBeDefined()
  })
  it('Should get balances', async () => {
    const accountAddress = '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69'
    const multicall = new Multicall({ network: 'mainnet', accountAddress })
    const balances = await multicall.getBalances()
    console.log(balances)
    expect(balances.length > 0).toBeTruthy()
  }, 60 * 1000)
  it('Should get balance from custom getter', async () => {
    const accountAddress = '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69'
    const multicall = new Multicall({ network: 'mainnet', accountAddress })
    const balances = await multicall.getBalancesForChain('polygon', [{
      abi: ERC20__factory.abi,
      method: 'balanceOf',
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      tokenSymbol: 'DAI'
    }, {
      abi: ERC20__factory.abi,
      method: 'balanceOf',
      address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
      tokenSymbol: 'USDC'
    }])
    console.log(balances)
    expect(balances.length > 0).toBeTruthy()
  }, 60 * 1000)
  it('Should get result using multicall calldata', async () => {
    const accountAddress = '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69'
    const multicall = new Multicall({ network: 'mainnet', accountAddress })
    const result = await multicall.multicall('polygon', [{
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
