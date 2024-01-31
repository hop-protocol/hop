import { BigNumber } from 'ethers'
import { bigNumberMin } from './bigNumberMin'

describe('bigNumberMin', () => {
  it('should return whether a big number is larger than another', () => {
    const a = BigNumber.from(1)
    const b = BigNumber.from(1)
    const bnMin = bigNumberMin(a, b)
    expect(bnMin).toEqual(b)
  })
})
