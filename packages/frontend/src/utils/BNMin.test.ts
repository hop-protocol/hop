import { BNMin } from './BNMin'
import { BigNumber } from 'ethers'

describe('BNMin', () => {
  it('should return whether a big number is larger than another', () => {
    const a = BigNumber.from(1)
    const b = BigNumber.from(1)
    const bnMin = BNMin(a, b)
    expect(bnMin).toEqual(b)
  })
})
