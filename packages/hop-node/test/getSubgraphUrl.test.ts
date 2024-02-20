import getSubgraphUrl from 'src/utils/getSubgraphUrl'
import { Chain } from '@hop-protocol/hop-node-core/constants'

test('getSubgraphUrl', async () => {
  const url = getSubgraphUrl(Chain.Ethereum)
  expect(url).toBeTruthy()
})
