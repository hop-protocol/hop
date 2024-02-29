import { ArbitrumInclusionService } from '../src/chains/Chains/arbitrum/Inclusion'

describe.skip('getL1InclusionTx', () => {
  it('should not retry if tx hash not included in batch', async () => {
    const inclusion = new ArbitrumInclusionService()

    const l2TxHash = ''
    const receipt = await inclusion.getL1InclusionTx(l2TxHash)
    console.log(receipt)
    expect(receipt).toBeUndefined()
  }, 10 * 1000)
})
