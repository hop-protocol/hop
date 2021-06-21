import { erc20Abi } from '../src'

test('abi', () => {
  expect(Array.isArray(erc20Abi)).toBeTruthy()
})
