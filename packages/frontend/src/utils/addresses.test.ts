import { isSameAddress } from './addresses'

describe('isSameAddress', () => {
  const addr1 = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  const addr2 = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  const addr3 = '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
  const addr4 = '0x0101010101010101010101010101010101010101'

  it('should return whether 2 addresses match (case-insensitive)', () => {
    const isa1 = isSameAddress(addr1, addr2)

    expect(isa1).toBe(true)

    const isa2 = isSameAddress(addr1, addr3)

    expect(isa2).toBe(true)

    const isa3 = isSameAddress(addr1, addr4)

    expect(isa3).toBe(false)
  })
})
