import getSubgraphUrl from '#utils/getSubgraphUrl.js'
import { Chain } from '@hop-protocol/hop-node-core/constants'

test('getSubgraphUrl', async () => {
  const url = getSubgraphUrl(Chain.Ethereum)
  expect(url).toBeTruthy()
})
