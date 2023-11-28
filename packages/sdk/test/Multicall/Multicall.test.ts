import { Multicall } from '../../src/Multicall'

describe('Multicall', () => {
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
    expect(balances).toBeDefined()
  }, 60 * 1000)
  it('Should get balances', async () => {
    const accountAddress = '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69'
    const multicall = new Multicall({ network: 'mainnet', accountAddress })
    const balances = await multicall.getBalances()
    console.log(balances)
    expect(balances).toBeDefined()
  }, 60 * 1000)
})
