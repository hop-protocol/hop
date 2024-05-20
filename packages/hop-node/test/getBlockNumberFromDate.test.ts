import getBlockNumberFromDate from '#utils/getBlockNumberFromDate.js'
import { ChainSlug } from '@hop-protocol/sdk'

test('getBlockNumberFromDate', async () => {
  const timestamp = 1668139733
  expect(await getBlockNumberFromDate(ChainSlug.Ethereum, timestamp)).toBe(15944292)
  expect(await getBlockNumberFromDate(ChainSlug.Arbitrum, timestamp)).toBe(37100355)
  expect(await getBlockNumberFromDate(ChainSlug.Optimism, timestamp)).toBe(36931743)
  expect(await getBlockNumberFromDate(ChainSlug.Polygon, timestamp)).toBe(35464062)
  expect(await getBlockNumberFromDate(ChainSlug.Gnosis, timestamp)).toBe(24933217)
})
