import { ChainSlug } from '@hop-protocol/sdk'
import { findNetworkBySlug, isL1ToL2 } from './networks'

describe('networks', () => {
  it('isL1ToL2: should return the correct value', () => {
    const expected = false
    const actual = isL1ToL2(ChainSlug.Arbitrum, ChainSlug.Ethereum)
    expect(actual).toBe(expected)
  })

  it('isL1ToL2: should be able to handle different arg types', () => {
    const expected = true
    const network = findNetworkBySlug(ChainSlug.Arbitrum)
    const actual = isL1ToL2(ChainSlug.Ethereum, network)
    expect(actual).toBe(expected)
  })
})
