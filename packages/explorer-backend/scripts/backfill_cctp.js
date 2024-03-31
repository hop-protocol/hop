const wait = require('wait')

async function queryGraphQL () {
  const query = {
    query: `
      {
        cctptransferSents(first: 1000) {
          id
          cctpNonce
          transaction {
            id
          }
        }
      }
    `
  }

  try {
    const response = await fetch('https://api.thegraph.com/subgraphs/name/hop-protocol/hop-polygon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.data.cctptransferSents
  } catch (error) {
    console.error('Error fetching data: ', error)
    return []
  }
}

async function fetchWithCCTPNonce (cctpTransfers) {
  console.log(cctpTransfers.length)
  for (const transfer of cctpTransfers) {
    const url = `https://explorer-api.hop.exchange/v1/transfers?transferId=${transfer.cctpNonce}`

    console.log(url)

    const response = await fetch(url)
    const data = await response.json()
    console.log(data)
    await wait(2000)
  }
}

// Run the script
queryGraphQL().then(fetchWithCCTPNonce)
