import { BigNumber } from 'ethers'
import { stringifyBigNumbers } from '#utils/stringifyBigNumbers.js'

describe('utils', () => {
  it('stringifyBigNumbers', async () => {
    const input = {
      a: BigNumber.from('0xa'),
      b: {
        id: 1,
        c: BigNumber.from('0xc'),
      },
      d: [
        {
          e: BigNumber.from('0xe'),
        }
      ]
    }

    const expected = {
      a: '10',
      b: {
        id: 1,
        c: '12'
      },
      d: [
        {
          e: '14'
        }
      ]
    }

    const result = stringifyBigNumbers(input)

    expect(result).toEqual(expected)
  })
})
