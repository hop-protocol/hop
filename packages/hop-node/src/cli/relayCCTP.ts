import chainIdToSlug from 'src/utils/chainIdToSlug'
import chainSlugToId from 'src/utils/chainSlugToId'
import wallets from 'src/wallets'
import { BigNumber, providers } from 'ethers'
import { Message } from 'src/cctp/cctp/Message'
import { RequiredFilter } from 'src/cctp/indexer/OnchainEventIndexer'
import { getRpcProvider } from 'src/utils/getRpcProvider'

import { actionHandler, parseString, root } from './shared'

root
  .command('relay-cctp')
  .description('Relay a CCTP message')
  .option('--chain <slug>', 'Source chain', parseString)
  .option('--tx-hash <hash>', 'Tx hash', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { chain, txHash } = source

  if (!chain) {
    throw new Error('Chain not found')
  }
  if (!txHash) {
    throw new Error('Tx hash not found')
  }

  const message = await getMessageFromTxHash(chain, txHash)
  const destinationChain = await getDestinationChainFromTxHash(chain, txHash)

  const wallet = wallets.get(destinationChain)
  const messageHash = Message.getMessageHashFromMessage(message)
  const attestation = await Message.fetchAttestation(messageHash)
  const tx = await Message.relayMessage(wallet , message, attestation)
  console.log(`Relayed message to ${destinationChain} with tx ${tx.transactionHash}`)
}

// TODO: Get from Message
async function getDestinationChainFromTxHash (chain: string, txHash: string): Promise<string> {
  const provider = getRpcProvider(chain)
  const tx = await provider.getTransaction(txHash)
  if (!tx) {
    throw new Error('Tx not found')
  }

  const chainId = chainSlugToId(chain)
  const eventFilter = Message.getCCTPTransferSentEventFilter(chainId)
  const filter: RequiredFilter = {
    ...eventFilter,
    fromBlock: tx.blockNumber!,
    toBlock: tx.blockNumber!
  }
  const onchainLogs = await provider.getLogs(filter)
  if (onchainLogs.length === 0) {
    throw new Error('No logs found')
  }

  for (const onchainLog of onchainLogs) {
    if (onchainLog.transactionHash === txHash) {
      const destinationChainId = onchainLog.topics?.[2]
      if (!destinationChainId) {
        throw new Error('Destination chain ID not found')
      }

      const destinationChainIdString = BigNumber.from(destinationChainId).toString()
      return chainIdToSlug(destinationChainIdString)
    }
  }

  throw new Error('No message found')
}

// TODO: Get from Message
async function getMessageFromTxHash (chain: string, txHash: string): Promise<string> {
  const provider = getRpcProvider(chain)
  const tx = await provider.getTransaction(txHash)
  if (!tx) {
    throw new Error('Tx not found')
  }

  const chainId = chainSlugToId(chain)
  const eventFilter = Message.getMessageSentEventFilter(chainId)
  const filter: RequiredFilter = {
    ...eventFilter,
    fromBlock: tx.blockNumber!,
    toBlock: tx.blockNumber!
  }
  const onchainLogs = await provider.getLogs(filter)
  if (onchainLogs.length === 0) {
    throw new Error('No logs found')
  }

  for (const onchainLog of onchainLogs) {
    if (onchainLog.transactionHash === txHash) {
      return Message.decodeMessageFromEvent(onchainLog.data)
    }
  }

  throw new Error('No message found')
}