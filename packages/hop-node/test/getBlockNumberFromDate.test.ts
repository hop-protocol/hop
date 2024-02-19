import getBlockNumberFromDate from 'src/utils/getBlockNumberFromDate'
import { Chain } from '@hop-protocol/hop-node-core/src/constants'

test('getBlockNumberFromDate', async () => {
  const timestamp = 1668139733
  expect(await getBlockNumberFromDate(Chain.Ethereum, timestamp)).toBe(15944292)
  expect(await getBlockNumberFromDate(Chain.Arbitrum, timestamp)).toBe(37100355)
  expect(await getBlockNumberFromDate(Chain.Optimism, timestamp)).toBe(36931743)
  expect(await getBlockNumberFromDate(Chain.Polygon, timestamp)).toBe(35464062)
  expect(await getBlockNumberFromDate(Chain.Gnosis, timestamp)).toBe(24933217)
})
