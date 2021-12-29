import { getRecentBlocks } from './blocks'
import { getProviderByNetworkName } from '.'

describe('getRecentBlocks', () => {
  it('should return recent blocks from a provider', async () => {
    const provider = getProviderByNetworkName('ethereum')

    const blocks = await getRecentBlocks(provider)

    expect(blocks.length).toBe(4)
  })
})
