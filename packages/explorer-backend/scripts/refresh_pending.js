const wait = require('wait')

async function main () {
  let page = 0
  while (true) {
    page++
    if (page === 2) {
      break
    }
    const url0 = `https://explorer-api.hop.exchange/v1/transfers?page=${page}&bonded=pending`
    const response0 = await fetch(url0)
    const json0 = await response0.json()
    const transferIds = json0.data.map(transfer => transfer.transferId)
    console.log(transferIds.length)
    for (const transferId of transferIds) {
      const url = `https://explorer-api.hop.exchange/v1/transfers?transferId=${transferId}&refresh=true`

      console.log(url)

      const response = await fetch(url)
      const data = await response.json()
      // console.log(data)
      await wait(3000)
    }
  }
}

// Run the script
main().catch(console.error)
