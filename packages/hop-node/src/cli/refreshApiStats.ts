import { actionHandler, root } from './shared/index.js'

import { wait } from '@hop-protocol/hop-node-core/utils'

root
  .command('refresh-api-stats')
  .description('Refresh API stats')
  .action(actionHandler(main))

async function main (source: any) {
  //Config
  const numPages = 2
  const waitTimeMs = 2000
  const startDate = '2024-04-03'

  // Fetch pending transfers
  const apiBaseUrl = 'https://explorer-api.hop.exchange'
  const pendingTransferIds: string[] = []
  for (let i = 1; i <= numPages; i++) {
    const url = `${apiBaseUrl}/v1/transfers?page=1&perPage=100&startDate=${startDate}&bonded=pending`
    const res = await fetch(url)
    const jsonRes = await res.json()
    if (!jsonRes?.data) {
      throw new Error('Invalid response')
    }

    const transfers = jsonRes.data
    if (transfers.length === 0) break

    for (const transfer of transfers) {
      const isTransferTimePassed = transfer?.estimatedRelativeTimeUntilBond === 0
      if (!isTransferTimePassed) continue
      pendingTransferIds.push(transfer.transferId)
    }
  }

  // Fetch transfer details to refresh
  for (const transferId of pendingTransferIds) {
    console.log(`Refreshing transfer ${transferId}`)
    const transferQueryUrl = `${apiBaseUrl}/v1/transfers?transferId=${transferId}`
    await fetch(transferQueryUrl)
    await wait(waitTimeMs)
  }
}
