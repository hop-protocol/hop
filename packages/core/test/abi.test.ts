import { erc20Abi } from '../src/abi'

test('abi', () => {
  expect(Array.isArray(erc20Abi)).toBeTruthy()
})
