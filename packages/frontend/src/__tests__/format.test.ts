import { fixedDecimals } from 'src/utils/format'

it('should trim a numerical string with decimals', () => {
  const numStr = '1234567890.01234567890123456789012345678901'

  const f1 = fixedDecimals(numStr, 18)
  expect(f1).toBe('1234567890.012345678901234567')

  const f2 = fixedDecimals(numStr, 9)
  expect(f2).toBe('1234567890.012345678')

  const f3 = fixedDecimals(numStr, 0)
  expect(f3).toBe('1234567890')

  const f4 = fixedDecimals(numStr, 6)
  expect(f4).toBe('1234567890.012345')

  const f5 = fixedDecimals(numStr, 50)
  expect(f5).toBe('1234567890.01234567890123456789012345678901')
})
