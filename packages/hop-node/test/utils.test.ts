import isTokenSupportedForChain from '#utils/isTokenSupportedForChain.js'
import { ChainSlug, TokenSymbol } from '@hop-protocol/sdk'
import { getAllChains } from '#config/index.js'

describe('isTokenSupportedForChain', () => {
  test('Happy path', () => {
    const token: TokenSymbol = TokenSymbol.USDC
    const chain: ChainSlug = ChainSlug.Optimism
    expect(isTokenSupportedForChain(token, chain)).toBe(true)
  })
  test('Non-Happy path', () => {
    let token: any = TokenSymbol.MAGIC
    let chain: any = ChainSlug.Optimism
    expect(isTokenSupportedForChain(token, chain)).toBe(false)

    // TODO: native jest throw test
    try {
      token = 'test'
      chain = ChainSlug.Optimism
      expect(isTokenSupportedForChain(token, chain)).toBe(false)
      throw new Error('should not reach here')
    } catch (err) {
      expect(err.message).toBe(`token ${token} does not exist`)
    }

    try {
      token = TokenSymbol.MAGIC
      chain = 'test'
      expect(isTokenSupportedForChain(token, chain)).toBe(false)
      throw new Error('should not reach here')
    } catch (err) {
      expect(err.message).toBe(`chainSlug ${chain} does not exist`)
    }
  })
  test('Current routes', () => {
    const supportedChainsForToken: Record<string, string[]> = {
      [TokenSymbol.MATIC]: [
        ChainSlug.Ethereum,
        ChainSlug.Polygon,
        ChainSlug.Gnosis
      ],
      [TokenSymbol.SNX]: [
        ChainSlug.Ethereum,
        ChainSlug.Optimism
      ],
      [TokenSymbol.sUSD]: [
        ChainSlug.Ethereum,
        ChainSlug.Optimism
      ],
      [TokenSymbol.rETH]: [
        ChainSlug.Ethereum,
        ChainSlug.Optimism,
        ChainSlug.Arbitrum
      ],
      [TokenSymbol.MAGIC]: [
        ChainSlug.Ethereum,
        ChainSlug.Arbitrum,
        ChainSlug.Nova
      ]
    }

    for (const token in supportedChainsForToken) {
      for (const chain of getAllChains()) {
        const isSupported = isTokenSupportedForChain(token, chain)
        if (isSupported) {
          expect(supportedChainsForToken[token]).toContain(chain)
        } else {
          expect(supportedChainsForToken[token]).not.toContain(chain)
        }
      }
    }
  })
})
