import { getChain } from '@hop-protocol/sdk'
import { wallets } from '#wallets/index.js'
import { CCTP } from '#implementations/index.js'
import { actionHandler, root } from '../shared/index.js'

root
  .command('relay-cctp')
  .description('Relay CCTP Messages')
  .action(actionHandler(main))

async function main (source: any) {
  const unrelayedMessages = await CCTP.getUnrelayedMessages()
  if (unrelayedMessages.length === 0) {
    console.log('No unrelayed messages found')
    return
  }

  for (const message of unrelayedMessages) {
    await relayMessage(message)
  }
}

async function relayMessage(item: CCTP.ISentCCTPMessage) {
  const { message, destinationChainId, txContext } = item
  const chainSlug = getChain(destinationChainId).slug
  const wallet = wallets.get(chainSlug)

  try {
    console.log(`Relaying message with txHash ${txContext.txHash}... on destination chain: ${chainSlug}`)
    const attestation = await CCTP.CCTPSDK.fetchAttestation(message)
    await CCTP.CCTPSDK.relayMessage(wallet, message, attestation)
  } catch (e) {
    console.error(`Error relaying message ${message}`)
  }
}
