import { Chain } from 'src/constants'
import getSubgraphUrl from 'src/utils/getSubgraphUrl' 

test('getSubgraphUrl', async () => {
  const url = getSubgraphUrl(Chain.Ethereum)
  expect(url).toBeTruthy
})
