require('dotenv').config()
const wait = require('wait')

const rateLimitToken = process.env.RATE_LIMIT_TOKEN
console.log('rateLimitToken set', !!rateLimitToken)

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
      const url = `https://explorer-api.hop.exchange/v1/transfers?transferId=${transferId}&refresh=true&rate_limit_token=${rateLimitToken}`

      console.log(url)

      const response = await fetch(url)
      const data = await response.json()
      // console.log(data)
      await wait(100)
    }
  }
}

// Run the script
main().catch(console.error)
