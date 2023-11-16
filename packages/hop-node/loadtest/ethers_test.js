const { ethers } = require('ethers')

async function main () {
  const url = 'http://localhost:8000' // local proxy
  const options = {
    allowGzip: false,
    url
  }
  const provider = new ethers.providers.JsonRpcProvider(options)

  // arbitrum logs request
  const logsQuery = {
    fromBlock: '0x8d05c52',
    toBlock: '0x8d05c52',
    address: '0x3749c4f034022c39ecaffaba182555d4508caccc',
    topics: [
        '0xe35dddd4ea75d7e9b3fe93af4f4e40e778c3da4074c9d93e7c6536f1e803c1eb',
        '0xe0aac768287ec7fc77986c67d0ca495c56d32fbc1a190b5d128b11eb2ec8e619',
        '0x0000000000000000000000000000000000000000000000000000000000000001',
        '0x000000000000000000000000b35bba6fa684de5ed5bc2666373778365231c9bd'
    ]
  }
  const logs = await provider.getLogs(logsQuery)
  console.log(logs)
}

main().catch(console.error)
