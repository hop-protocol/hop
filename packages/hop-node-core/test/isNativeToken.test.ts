import { ChainSlug, getChain } from '@hop-protocol/sdk'
import { isNativeToken } from '#utils/isNativeToken.js'

describe('isNativeToken', () => {
  it('isNativeToken', () => {
    // Happy path
    let network = ChainSlug.Ethereum
    let token = 'ETH'
    expect(isNativeToken(getChain('mainnet', network).chainId, token)).toBe(true)

    network = ChainSlug.Optimism
    token = 'ETH'
    expect(isNativeToken(getChain('mainnet', network).chainId, token)).toBe(true)

    network = ChainSlug.Arbitrum
    token = 'ETH'
    expect(isNativeToken(getChain('mainnet', network).chainId, token)).toBe(true)

    network = ChainSlug.Polygon
    token = 'MATIC'
    expect(isNativeToken(getChain('mainnet', network).chainId, token)).toBe(true)

    network = ChainSlug.Gnosis
    token = 'XDAI'
    expect(isNativeToken(getChain('mainnet', network).chainId, token)).toBe(true)

    // Non-happy path
    network = ChainSlug.Polygon
    token = 'mAtIc'
    expect(isNativeToken(getChain('mainnet', network).chainId, token)).toBe(false)

    network = ChainSlug.Ethereum
    token = 'MATIC'
    expect(isNativeToken(getChain('mainnet', network).chainId, token)).toBe(false)

    network = ChainSlug.Ethereum
    token = 'abc'
    expect(isNativeToken(getChain('mainnet', network).chainId, token)).toBe(false)

    network = ChainSlug.Ethereum
    token = ''
    expect(isNativeToken(getChain('mainnet', network).chainId, token)).toBe(false)

    network = ChainSlug.Polygon
    token = 'xDai'
    expect(isNativeToken(getChain('mainnet', network).chainId, token)).toBe(false)
  })
})
