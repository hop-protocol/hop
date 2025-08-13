import { getPath } from '#models/index.js'
import { utils } from 'ethers'
import { Rails } from '#rails/index.js'
import { setUpRails } from './fixture.js'

describe('SDK', () => {

  const { chains, rpcs, rails } = setUpRails()

  test('should not allow mismatched length inputs during instantiation', () => {
    expect(() => new Rails(chains, [rpcs[0]])).toThrow()
  })

  test('should not allow the same chain to be instantiated multiple times', () => {
    expect(() => new Rails([chains[0], chains[0]], rpcs)).toThrow()
  })

  test('should retrieve the valid head claim', async () => {
    const path = getPath('0xf2562f695ac4ba9361f3c5f05041d5f53ec86062b47561fe0d9f29e1675b5ace')
    const claimId = await rails.getValidHeadClaimId(path, chains[0])
    expect(claimId).toBeDefined()
  })

  test('should retrieve a filtered event with indexes', async () => {
    const indexAddress = '0x0000000000000000000000000000000000000123'
    const path = getPath('0xf2562f695ac4ba9361f3c5f05041d5f53ec86062b47561fe0d9f29e1675b5ace')
    const filter = rails.getFilters(path, chains[0]).ClaimBonded(
      null,
      indexAddress
    )
    expect(filter.address).toBeDefined()
    expect(filter.topics?.[0]).toBeDefined()
    expect(filter.topics?.[1]).toBeNull()
    expect(filter.topics?.[2]).toBe(utils.hexZeroPad(indexAddress, 32))
  })
})

