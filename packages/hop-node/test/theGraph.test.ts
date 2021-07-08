import { Chain } from 'src/constants'
import getTransferIdsForTransferRoot from 'src/theGraph/getTransferIdsForTransferRoot'

describe('getTransferIdsForTransferRoot', () => {
  it('xdai', async () => {
    const rootHash =
      '0x332a76463a0aa69332780dc03c4c8123c965667f2ea5bc24a5b515abbe14916d'
    const transferIds = await getTransferIdsForTransferRoot(
      Chain.xDai,
      rootHash
    )
    expect(transferIds.length).toBe(128)
  })
  it('polygon', async () => {
    const rootHash =
      '0x6d6753b28bb59df66525728642c1fbbed6878068620975b51a5fdbc905e3c789'
    const transferIds = await getTransferIdsForTransferRoot(
      Chain.Polygon,
      rootHash
    )
    expect(transferIds.length).toBe(3)
  })
})
