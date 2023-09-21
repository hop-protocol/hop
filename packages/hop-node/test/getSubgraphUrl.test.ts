import getSubgraphUrl from 'src/utils/getSubgraphUrl'
import { Chain } from 'src/constants'

test('getSubgraphUrl', async () => {
  const url = getSubgraphUrl(Chain.Ethereum)
  expect(url).toBeTruthy()
})
