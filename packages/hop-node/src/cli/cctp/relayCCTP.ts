import { getUnrelayedMessages } from './utils.js'
import { getChain } from '@hop-protocol/sdk'
import { wallets } from '#wallets/index.js'
import { MessageSDK } from '#cctp/cctp/sdk/MessageSDK.js'
import { type ISentMessage } from '#cctp/cctp/types.js'
import { actionHandler, root } from '../shared/index.js'

root
  .command('relay-cctp')
  .description('Relay CCTP Messages')
  .action(actionHandler(main))

async function main (source: any) {
  const unrelayedMessages = await getUnrelayedMessages()
  if (unrelayedMessages.length === 0) {
    console.log('No unrelayed messages found')
    return
  }

  for (const message of unrelayedMessages) {
    await relayMessage(message)
  }
}

async function relayMessage(item: ISentMessage) {
  const { message, destinationChainId, sentTxHash } = item
  const chainSlug = getChain(destinationChainId).slug
  const wallet = wallets.get(chainSlug)

  try {
    console.log(`Relaying message with txHash ${sentTxHash}... on destination chain: ${chainSlug}`)
    const attestation = await MessageSDK.fetchAttestation(message)
    await MessageSDK.relayMessage(wallet, message, attestation)
  } catch (e) {
    console.error(`Error relaying message ${message}`)
  }
}
