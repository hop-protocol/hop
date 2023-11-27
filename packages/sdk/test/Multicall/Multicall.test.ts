import { Multicall } from '../../src/Multicall'

describe('Multicall', () => {
  it('Should get balances', async () => {
    const userAddress = '0x9997da3de3ec197C853BCC96CaECf08a81dE9D69'
    const multicall = new Multicall()
    const balances = await multicall.getBalances(userAddress)
    console.log(balances)
    expect(balances).toBeDefined()
  })
})
