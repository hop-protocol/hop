import { BigNumber } from 'ethers'
import { BNMin } from './BNMin'

describe('BNMin', () => {
  it('should return whether a big number is larger than another', () => {
    const a = BigNumber.from(1)
    const b = BigNumber.from(1)
    const bnMin = BNMin(a, b)
    expect(bnMin).toEqual(b)
  })
})
