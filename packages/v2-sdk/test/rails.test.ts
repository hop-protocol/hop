import { Rails } from '#rails/index.js'
import { getChain } from '#models/index.js'
import { providers } from 'ethers'

describe.only('Rails', () => {
  const chain = getChain('11155111')
  const providerURL = process.env.ETHEREUM_RPC_PROVIDER
  const provider = new providers.JsonRpcProvider(providerURL)

  test('should not allow mismatched length inputs during instantiation', () => {
    const otherChain = getChain('11155420')
    expect(() => new Rails([chain, otherChain], [provider])).toThrow()
  })

  test('should not allow the same chain to be instantiated multiple times', () => {
    expect(() => new Rails([chain, chain], [provider, provider])).toThrow()
  })
})

