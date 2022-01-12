import isNativeToken from 'src/utils/isNativeToken'
import { Chain } from 'src/constants'

describe('isNativeToken', () => {
  it('isNativeToken', () => {
    // Happy path
    let network = Chain.Ethereum
    let token = 'ETH'
    expect(isNativeToken(network, token)).toBe(true)

    network = Chain.Optimism
    token = 'ETH'
    expect(isNativeToken(network, token)).toBe(true)

    network = Chain.Arbitrum
    token = 'ETH'
    expect(isNativeToken(network, token)).toBe(true)

    network = Chain.Polygon
    token = 'MATIC'
    expect(isNativeToken(network, token)).toBe(true)

    network = Chain.Gnosis
    token = 'xDai'
    expect(isNativeToken(network, token)).toBe(true)

    // Non-happy path
    network = Chain.Polygon
    token = 'mAtIc'
    expect(isNativeToken(network, token)).toBe(true)

    network = Chain.Ethereum
    token = 'MATIC'
    expect(isNativeToken(network, token)).toBe(false)

    network = Chain.Ethereum
    token = 'abc'
    expect(isNativeToken(network, token)).toBe(false)

    network = Chain.Ethereum
    token = ''
    expect(isNativeToken(network, token)).toBe(false)

    network = Chain.Polygon
    token = 'xDai'
    expect(isNativeToken(network, token)).toBe(false)
  })
})
