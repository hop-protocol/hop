import erc20Abi from '@hop-protocol/core/abi/generated/ERC20.json'
import stakingRewardsAbi from '@hop-protocol/core/abi/static/StakingRewards.json'
import { Multicall } from '../../src/Multicall'

describe.only('Multicall', () => {
  it('Should get token addresses for chain', async () => {
    const accountAddress = '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69'
    const multicall = new Multicall({ network: 'mainnet', accountAddress })
    const tokenAddresses = multicall.getTokenAddressesForChain('optimism')
    console.log(tokenAddresses)
    expect(tokenAddresses.length > 0).toBeTruthy()
  })
  it('Should get chains', async () => {
    const accountAddress = '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69'
    const multicall = new Multicall({ network: 'mainnet', accountAddress })
    const chains = multicall.getChains()
    console.log(chains)
    expect(chains.length > 0).toBeTruthy()
  })
  it('Should get multicall address for chain', async () => {
    const accountAddress = '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69'
    const multicall = new Multicall({ network: 'mainnet', accountAddress })
    const address = multicall.getMulticallAddressForChain('optimism')
    console.log(address)
    expect(address).toBeDefined()
  })
  it('Should get balances for chain', async () => {
    const accountAddress = '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69'
    const multicall = new Multicall({ network: 'mainnet', accountAddress })
    const balances = await multicall.getBalancesForChain('optimism')
    console.log(balances)
    expect(balances.length > 0).toBeTruthy()
  }, 60 * 1000)
  it('Should get balances', async () => {
    const accountAddress = '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69'
    const multicall = new Multicall({ network: 'mainnet', accountAddress })
    const balances = await multicall.getBalances()
    console.log(balances)
    expect(balances.length > 0).toBeTruthy()
  }, 60 * 1000)
  it.only('Should get balance from custom getter', async () => {
    const accountAddress = '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69'
    const multicall = new Multicall({ network: 'mainnet', accountAddress })
    const balances = await multicall.getBalancesForChain('polygon', [{
      abi: erc20Abi,
      method: 'balanceOf',
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      tokenSymbol: 'DAI'
    }, {
      abi: stakingRewardsAbi,
      method: 'earned',
      address: '0xd6dC6F69f81537Fe9DEcc18152b7005B45Dc2eE7',
      tokenSymbol: 'DAI'
    }])
    console.log(balances)
    expect(balances.length > 0).toBeTruthy()
  }, 60 * 1000)
})
