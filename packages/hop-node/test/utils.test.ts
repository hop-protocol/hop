import isTokenSupportedForChain from 'src/utils/isTokenSupportedForChain'
import { Chain, Token } from 'src/constants'
import { getAllChains } from 'src/config'

describe('isTokenSupportedForChain', () => {
  test('Happy path', () => {
    const token: Token = Token.USDC
    const chain: Chain = Chain.Optimism
    expect(isTokenSupportedForChain(token, chain)).toBe(true)
  })
  test('Non-Happy path', () => {
    let token: any = Token.MAGIC
    let chain: any = Chain.Optimism
    expect(isTokenSupportedForChain(token, chain)).toBe(false)

    // TODO: native jest throw test
    try {
      token = 'test'
      chain = Chain.Optimism
      expect(isTokenSupportedForChain(token, chain)).toBe(false)
      throw new Error('should not reach here')
    } catch (err) {
      expect(err.message).toBe(`token ${token} does not exist`)
    }

    try {
      token = Token.MAGIC
      chain = 'test'
      expect(isTokenSupportedForChain(token, chain)).toBe(false)
      throw new Error('should not reach here')
    } catch (err) {
      expect(err.message).toBe(`chainSlug ${chain} does not exist`)
    }
  })
  test('Current routes', () => {
    const supportedChainsForToken: Record<string, string[]> = {
      [Token.MATIC]: [
        Chain.Ethereum,
        Chain.Polygon,
        Chain.Gnosis
      ],
      [Token.SNX]: [
        Chain.Ethereum,
        Chain.Optimism
      ],
      [Token.sUSD]: [
        Chain.Ethereum,
        Chain.Optimism
      ],
      [Token.rETH]: [
        Chain.Ethereum,
        Chain.Optimism,
        Chain.Arbitrum
      ],
      [Token.MAGIC]: [
        Chain.Ethereum,
        Chain.Arbitrum,
        Chain.Nova
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
