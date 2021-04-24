import { erc20Abi } from '../'

test('abi', () => {
  expect(Array.isArray(erc20Abi)).toBeTruthy()
})
