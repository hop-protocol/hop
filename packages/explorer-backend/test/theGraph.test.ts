import { fetchTransferFromL1Completeds } from '../src/theGraph'

// run with:
// NETWORK=goerli ts-node test/theGraph.test.ts

async function main () {
  const chain = 'linea'
  const startTime = 1684284720
  const endTime = 1684306320
  const events = await fetchTransferFromL1Completeds(chain, startTime, endTime)
  console.log(events.length)
  console.log('done')
}

main().catch(console.error)
