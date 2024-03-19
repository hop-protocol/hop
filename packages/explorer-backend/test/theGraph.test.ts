import { fetchTransferFromL1Completeds, fetchCctpTransferSents, fetchCctpMessageReceiveds } from '../src/theGraph'

// run with:
// NETWORK=goerli ts-node test/theGraph.test.ts

async function testFetchTransferFromL1Completeds () {
  const chain = 'linea'
  const startTime = 1684284720
  const endTime = 1684306320
  const events = await fetchTransferFromL1Completeds(chain, startTime, endTime)
  console.log(events.length)
  console.log('done')
}

async function testFetchCctpTransfers () {
  const chain = 'polygon'
  const startTime = 1710184488
  const endTime = 1710186191
  const events = await fetchCctpTransferSents(chain, startTime, endTime)
  console.log(events.length)
  console.log('done')
}

async function testFetchCctpMessageReceiveds () {
  const chain = 'polygon'
  const txHashes = []
  const events = await fetchCctpMessageReceiveds(chain, txHashes)
  console.log(events.length)
  console.log('done')
}

async function main () {

}

main().catch(console.error)
