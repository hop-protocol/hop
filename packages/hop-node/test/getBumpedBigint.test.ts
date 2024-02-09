import getBumpedBigint from 'src/utils/getBumpedBigint'


test('getBumpedBigint', () => {
  expect(getBumpedBigint(BigInt('20'), 1.5).toString()).toBe(BigInt('30').toString())
  expect(getBumpedBigint(BigInt('20'), 2.23456789).toString()).toBe(BigInt('44').toString())
})
