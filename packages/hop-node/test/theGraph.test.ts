import getTransferIdsForTransferRoot from 'src/theGraph/getTransferIdsForTransferRoot'
import { Chain } from 'src/constants'

describe('getTransferIdsForTransferRoot', () => {
  it('xdai - 1', async () => {
    const rootHash =
      '0x332a76463a0aa69332780dc03c4c8123c965667f2ea5bc24a5b515abbe14916d'
    const transferIds = await getTransferIdsForTransferRoot(
      Chain.xDai,
      rootHash
    )
    expect(transferIds.length).toBe(128)
  })
  it('xdai - 2', async () => {
    const rootHash =
      '0x8d4379105927cf5bc4d1aa5006b38ac4637e369f4462a650fc87cc80e91f7e79'
    const transferIds = await getTransferIdsForTransferRoot(
      Chain.xDai,
      rootHash
    )
    expect(transferIds.length).toBe(77)
  })
  it('polygon - 1', async () => {
    const rootHash =
      '0x6d6753b28bb59df66525728642c1fbbed6878068620975b51a5fdbc905e3c789'
    const transferIds = await getTransferIdsForTransferRoot(
      Chain.Polygon,
      rootHash
    )
    expect(transferIds.length).toBe(3)
  })
  it('polygon - 2', async () => {
    const rootHash =
      '0x1670c930b8e54815714219269f434bccb019e66846a4f0a2763e5afde7841bac'
    const transferIds = await getTransferIdsForTransferRoot(
      Chain.Polygon,
      rootHash
    )
    expect(transferIds.length).toBe(17)
  })
})
