import { Multicall } from '../../src/Multicall'

describe('Multicall', () => {
  it('Should get balances', async () => {
    const accountAddress = '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69'
    const multicall = new Multicall({ accountAddress })
    const balances = await multicall.getBalances()
    console.log(balances)
    expect(balances).toBeDefined()
  })
})
