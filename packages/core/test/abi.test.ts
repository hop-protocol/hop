import { erc20Abi } from '#abi/index.js'

test('abi', () => {
  expect(Array.isArray(erc20Abi)).toBeTruthy()
})
