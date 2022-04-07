import getBondedWithdrawal from 'src/theGraph/getBondedWithdrawal'
import getBondedWithdrawals from 'src/theGraph/getBondedWithdrawals'
import getTransfer from 'src/theGraph/getTransfer'
import getTransferIdsForTransferRoot from 'src/theGraph/getTransferIdsForTransferRoot'
import getTransferRoot from 'src/theGraph/getTransferRoot'
import getTransferRoots from 'src/theGraph/getTransferRoots'
import { Chain } from 'src/constants'
import { fetchTransfers } from 'src/theGraph/getUnbondedTransfers'
import { getSubgraphLastBlockSynced } from 'src/theGraph/getSubgraphLastBlockSynced'

describe.skip('getTransferIdsForTransferRoot', () => {
  it('gnosis - 1', async () => {
    const rootHash =
      '0x332a76463a0aa69332780dc03c4c8123c965667f2ea5bc24a5b515abbe14916d'
    const transferIds = await getTransferIdsForTransferRoot(
      Chain.Gnosis,
      'USDC',
      rootHash
    )
    expect(transferIds.length).toBe(128)
  })
  it('gnosis - 2', async () => {
    const rootHash =
      '0x8d4379105927cf5bc4d1aa5006b38ac4637e369f4462a650fc87cc80e91f7e79'
    const transferIds = await getTransferIdsForTransferRoot(
      Chain.Gnosis,
      'USDC',
      rootHash
    )
    expect(transferIds.length).toBe(77)
  })
  it('polygon - 1', async () => {
    const rootHash =
      '0x6d6753b28bb59df66525728642c1fbbed6878068620975b51a5fdbc905e3c789'
    const transferIds = await getTransferIdsForTransferRoot(
      Chain.Polygon,
      'USDC',
      rootHash
    )
    expect(transferIds.length).toBe(3)
  })
  it('polygon - 2', async () => {
    const rootHash =
      '0x1670c930b8e54815714219269f434bccb019e66846a4f0a2763e5afde7841bac'
    const transferIds = await getTransferIdsForTransferRoot(
      Chain.Polygon,
      'USDC',
      rootHash
    )
    expect(transferIds.length).toBe(17)
  })
})

describe.skip('getTransferRoots', () => {
  it('gnosis', async () => {
    const transferRoots = await getTransferRoots(Chain.Gnosis, 'USDC')
    expect(transferRoots.length).toBeGreaterThan(0)
  })
})

describe.skip('getTransferRoot', () => {
  it('gnosis', async () => {
    const transferRootHash = '0x332a76463a0aa69332780dc03c4c8123c965667f2ea5bc24a5b515abbe14916d'
    const transferRoot = await getTransferRoot(Chain.Gnosis, 'USDC', transferRootHash)
    expect(transferRoot.rootSet).toBeTruthy()
    expect(transferRoot.rootConfirmed).toBeTruthy()
    expect(transferRoot.transferIds.length).toBeGreaterThan(0)
  })
})

describe.skip('getTransfer', () => {
  it('gnosis - 1', async () => {
    const transferId = '0xb7329b58f3ab879e40df7d2fabf21e591a35adb42803cc4b676fa726a6252ab7'
    const transfer = await getTransfer(Chain.Gnosis, 'USDC', transferId)
    expect(transfer.transferId).toBe(transferId)
    expect(transfer.transactionHash).toBe('0xf65c586478e6b3d96379fc5b98f246a5f31e39f84e9bd479e6281601dd79fcbd')
    expect(transfer.bondedWithdrawal.transactionHash).toBe('0x94e7fed9b1a18c2824f49c7dddacccbd487116c3b05db32ccd438b26ad171cf3')
  }, 10 * 1000)
  it('gnosis - 2', async () => {
    const transferId = '0xd363e79ac21502354ac30403c6984592dd4718cec2f1896526493d8d1779dd33'
    const transfer = await getTransfer(Chain.Gnosis, 'USDC', transferId)
    expect(transfer.transferId).toBe(transferId)
    expect(transfer.transferRootHash).toBe('0x94a8cb4f0261c26937703bf4598b93ac815fd39efcecadf092e7657cbe51a0fe')
  }, 10 * 1000)
})

describe.skip('getBondedWithdrawal', () => {
  it('polygon', async () => {
    const transferId = '0xb7329b58f3ab879e40df7d2fabf21e591a35adb42803cc4b676fa726a6252ab7'
    const item = await getBondedWithdrawal(Chain.Polygon, 'USDC', transferId)
    expect(item.transferId).toBe(transferId)
  })
})

describe.skip('getBondedWithdrawals', () => {
  it('polygon', async () => {
    const items = await getBondedWithdrawals(Chain.Ethereum, 'USDC')
    expect(items.length).toBeGreaterThan(0)
  }, 60 * 1000)
})

describe.skip('check bonded withdrawals without a transfer', () => {
  it('polygon', async () => {
    const items = await getBondedWithdrawals(Chain.Ethereum, 'USDC')
    let i = 0
    for (const item of items.slice(i)) {
      try {
        let transfer = await getTransfer(Chain.Gnosis, 'USDC', item.transferId)
        if (!transfer) {
          transfer = await getTransfer(Chain.Polygon, 'USDC', item.transferId)
        }
        if (!transfer) {
          throw new Error(`no transfer ${item.transferId}`)
        }
        console.log(i)
        i++
      } catch (err) {
        console.log(err.message)
        break
      }
    }
  }, 60 * 60 * 1000)
})

describe.skip('getSubgraphLastBlockSynced', () => {
  it('gnosis', async () => {
    const block = await getSubgraphLastBlockSynced(Chain.Gnosis)
    console.log(block)
    expect(block).toBeGreaterThan(0)
  }, 60 * 1000)
})

describe.skip('getUnbondedTransfers', () => {
  it('fetchTransfers', async () => {
    const endTime = Math.floor(Date.now() / 1000)
    const startTime = endTime - (2 * 30 * 24 * 60 * 60) // 2 months
    const transfers = await fetchTransfers(Chain.Polygon, startTime, endTime)
    console.log(transfers)
    console.log(transfers.length)
    expect(transfers.length).toBeGreaterThan(0)
  }, 30 * 1000)
})
