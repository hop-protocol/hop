import { amountToBN, fixedDecimals } from './format'

it('should trim a numerical string with decimals', () => {
  const numStr = '1234567890.01234567890123456789012345678901'

  const f1 = fixedDecimals(numStr, 18)
  expect(f1).toBe('1234567890.012345678901234567')

  const f2 = fixedDecimals(numStr, 9)
  expect(f2).toBe('1234567890.012345678')

  const f3 = fixedDecimals(numStr, 0)
  expect(f3).toBe('1234567890.0')

  const f4 = fixedDecimals(numStr, 6)
  expect(f4).toBe('1234567890.012345')
})

it('should allow for input beginning with a decimal (convert "." -> "0.")', () => {
  const numStr1 = '.1'
  const f1 = fixedDecimals(numStr1, 18)
  expect(f1).toBe('0.1')

  const numStr2 = '.12345'
  const f2 = fixedDecimals(numStr2, 2)
  expect(f2).toBe('0.12')

  const numStr3 = '.12345'
  const f3 = fixedDecimals(numStr3, 18)
  expect(f3).toBe('0.12345')

  const numStr4 = '.'
  const f4 = fixedDecimals(numStr4, 18)
  expect(f4).toBe('0.0')
})

// str[0]: input
// str[1]: expected: fixedDecimals(input, 18)
// str[2]: expected: fixedDecimals(input, 9)
// str[3]: expected: amountToBN(input, 18).toString()
// str[4]: expected: amountToBN(input, 9).toString()
// prettier-ignore
const strs = [
  ['0', '0.0', '0.0', '0', '0'],
  ['1', '1.0', '1.0', '1000000000000000000', '1000000000'],
  ['.', '0.0', '0.0', '0', '0'],
  ['0.', '0.0', '0.0', '0', '0'],
  ['.0', '0.0', '0.0', '0', '0'],
  ['00.', '0.0', '0.0', '0', '0'],
  ['.00', '0.0', '0.0', '0', '0'],
  ['0.0', '0.0', '0.0', '0', '0'],
  ['.001', '0.001', '0.001', '1000000000000000', '1000000'],
  ['0.01', '0.01', '0.01', '10000000000000000', '10000000'],
  ['.1', '0.1', '0.1', '100000000000000000', '100000000'],
  ['0.1', '0.1', '0.1', '100000000000000000', '100000000'],
  ['1.', '1.0', '1.0', '1000000000000000000', '1000000000'],
  ['1.0', '1.0', '1.0', '1000000000000000000', '1000000000'],
  ['1.1', '1.1', '1.1', '1100000000000000000', '1100000000'],
  ['010.0', '10.0', '10.0', '10000000000000000000', '10000000000'],
  ['10.01', '10.01', '10.01', '10010000000000000000', '10010000000'],
]

it('should convert various numerical string inputs and pad them with [.0] if necessary', () => {
  for (const str of strs) {
    const result18 = fixedDecimals(str[0], 18)
    expect(result18).toBe(str[1])

    const result9 = fixedDecimals(str[0], 9)
    expect(result9).toBe(str[2])
  }
})

it('should convert various inputs -> BigNumbers', () => {
  for (const str of strs) {
    const result18 = amountToBN(str[0], 18)
    expect(result18.toString()).toBe(str[3])

    const result9 = amountToBN(str[0], 9)
    expect(result9.toString()).toBe(str[4])
  }
})
