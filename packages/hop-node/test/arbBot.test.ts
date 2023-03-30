import { ArbBot } from 'src/arbBot'
import getTransfersCommitted from 'src/theGraph/getTransfersCommitted'

describe('ArbBot', () => {
  it('arbBot', async () => {
    // const arbBot = new ArbBot({ dryMode: true })
    const toChain = 5
    const items = await getTransfersCommitted('linea', 'ETH', 0, toChain)
    console.log('items', items)
  })
})
