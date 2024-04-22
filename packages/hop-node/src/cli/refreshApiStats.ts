import { actionHandler, parseString, root } from './shared/index.js'

import { wait } from '@hop-protocol/hop-node-core/utils'
root
  .command('refresh-api-stats')
  .description('Refresh API stats')
  .option('--start-date <string>', 'Date to start syncing db from, in ISO format YYYY-MM-DD', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { startDate } = source
  //Config
  const numPages = 2
  const waitTimeMs = 2000

  if (!startDate) {
    throw new Error('startDate is required')
  }

  console.log(`Refreshing API stats from ${startDate}`)

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
    const transferQueryUrl = `${apiBaseUrl}/v1/transfers?transferId=${transferId}&refresh=true`
    await fetch(transferQueryUrl)
    await wait(waitTimeMs)
  }
}
