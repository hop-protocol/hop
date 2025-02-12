require('dotenv').config()
const wait = require('wait')

const apiBaseUrl = 'https://explorer-api.hop.exchange'
// const apiBaseUrl = 'http://localhost:8000'
const rateLimitToken = process.env.RATE_LIMIT_TOKEN
const token = process.argv[2] ?? ''
console.log('rateLimitToken set', !!rateLimitToken)
console.log('token', token)

async function main () {
  let page = 0
  while (true) {
    page++
    if (page === 2) {
      break
    }
    const url0 = `${apiBaseUrl}/v1/transfers?page=${page}&bonded=pending&rate_limit_token=${rateLimitToken}&token=${token}`
    const response0 = await fetch(url0)
    const json0 = await response0.json()
    const transferIds = json0.data.map(transfer => transfer.transferId)
    // const transferIds = json0.data.map(transfer => transfer.transactionHash)
    console.log(transferIds.length)
    for (const transferId of transferIds) {
      const url = `${apiBaseUrl}/v1/transfers?transferId=${transferId}&refresh=true&rate_limit_token=${rateLimitToken}`

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
