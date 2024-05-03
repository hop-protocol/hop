import getSubgraphUrl from '#utils/getSubgraphUrl.js'
import { ChainSlug } from '@hop-protocol/sdk'

test('getSubgraphUrl', async () => {
  const url = getSubgraphUrl(ChainSlug.Ethereum)
  expect(url).toBeTruthy()
})
