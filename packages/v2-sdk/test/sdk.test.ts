import { Rails } from '#rails/index.js'
import { getToken, getChain, getPath } from '#models/index.js'
import { providers, utils } from 'ethers'

describe('Models', () => {
  test('getToken() should return a token by symbol', () => {
    const token = getToken('ETH')

    expect(token).toBeDefined()
    expect(token.symbol).toBe('ETH')
    expect(token.name).toBe('Ethereum')
    expect(token.decimals).toBe(18)
    expect(token.isStableCoin).toBe(false)
  })
})

describe('SDK', () => {
  const chains = [
    getChain('11155111'),
    getChain('11155420'),
  ]
  const rpcs = [
    new providers.JsonRpcProvider(process.env.ETHEREUM_RPC_PROVIDER),
    new providers.JsonRpcProvider(process.env.OPTIMISM_RPC_PROVIDER)
  ]
  const rails = new Rails(chains, rpcs)

  test('getToken() should return a token by symbol', () => {
    const token = getToken('ETH')

    expect(token).toBeDefined()
    expect(token.symbol).toBe('ETH')
    expect(token.name).toBe('Ethereum')
    expect(token.decimals).toBe(18)
    expect(token.isStableCoin).toBe(false)
  })

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
    const filter = rails.getFilters(chains[0]).OwnershipTransferred(
      null,
      indexAddress
    )

    expect(filter.address).toBeDefined()
    expect(filter.topics?.[0]).toBeDefined()
    expect(filter.topics?.[1]).toBeNull()
    expect(filter.topics?.[2]).toBe(utils.hexZeroPad(indexAddress, 32))
  })
})
