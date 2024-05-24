import { BigNumber } from 'ethers'
import { CCTP_DOMAIN_MAP } from '#cctp/cctp/utils.js'
import { ChainSlug, NetworkSlug, getChainSlug } from '@hop-protocol/sdk'
import { Message } from '#cctp/cctp/Message.js'
import { actionHandler, root } from './shared/index.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { chainSlugToId } from '#utils/chainSlugToId.js'
import { getDefaultStartBlockNumber } from '#cctp/db/utils.js'
import { getEventsInRange } from '#cctp/indexer/OnchainEventIndexer.js'
import { config as globalConfig } from '#config/index.js'

// TODO: Replace all this with efficient subgraph lookup
// TODO: This is CLI call so does not assume local DB

// TODO: Automate
const CHAINS: Partial<Record<NetworkSlug, ChainSlug[]>> = {
  [NetworkSlug.Mainnet]: [
    ChainSlug.Ethereum,
    ChainSlug.Optimism,
    ChainSlug.Arbitrum,
    ChainSlug.Base,
    ChainSlug.Polygon
  ],
  [NetworkSlug.Sepolia]: [
    ChainSlug.Ethereum,
    ChainSlug.Optimism,
    ChainSlug.Arbitrum,
    ChainSlug.Base
  ]
}

root
  .command('get-unrelayed-cctp-messages')
  .description('Get unrelayed CCTP messages')
  .action(actionHandler(main))

async function main (source: any) {
  const chains = CHAINS[globalConfig.network as NetworkSlug]!


  const transfersSent: any[] = []
  const transfersRelayed: any[] = []
  const promises = chains.map(async (chain) => {
    console.log(`Getting transfers for ${chain}`)
    const sent = await getTransfersSent(chain)
    if (!sent || sent.length === 0) {
      console.log('No sent found')
      return
    }
    transfersSent.push(...sent)

    console.log(`Getting relays for ${chain}`)
    const relayed = await getTransfersRelayed(chain)
    transfersRelayed.push(...relayed)
  })

  await Promise.all(promises)

  console.log('Checking for unrelayed messages')

  // Don't look within 30 mins to avoid recent transfers
  const currentTime = Date.now()
  const thirtyMinutes = 30 * 60 * 1000
  const timestampToCheck = currentTime - thirtyMinutes

  for (const transferSent of transfersSent) {
    const { nonce, destinationChainId, sourceChainId } = transferSent
    const destinationChain = getChainSlug(destinationChainId.toString())
    const isRelayed = transfersRelayed.find((transferRelayed) => {
      return transferRelayed.nonce === nonce && transferRelayed.sourceChainId === sourceChainId
    })
    if (isRelayed) {
      continue
    }

    // TODO: Better
    const sourceChain = getChainSlug(transferSent.sourceChainId)
    const sourceProvider = getRpcProvider(sourceChain)
    const transaction = await sourceProvider.getTransaction(transferSent.transactionHash)
    const block = await sourceProvider.getBlock(transaction.blockNumber!)
    const timestamp = block.timestamp!
    const sourceTxTimestamp = timestamp * 1000
    if (sourceTxTimestamp > timestampToCheck) {
      continue
    }

    console.log(`Not relayed: sourceChainId: ${transferSent.sourceChainId}, destinationChain: ${destinationChain}, nonce: ${nonce}, txHash: ${transferSent.transactionHash} `)
  }
}

// TODO: Get from Message
async function getTransfersSent (chain: string): Promise<{ sourceChainId: number, transactionHash: string, nonce: number, destinationChainId: number }[]> {
  const chainId = chainSlugToId(chain)
  const eventFilter = Message.getCCTPTransferSentEventFilter(chainId)
  const startBlock = getDefaultStartBlockNumber(chainId)
  const { logs } = await getEventsInRange(chain as ChainSlug, eventFilter, startBlock)
  if (logs.length === 0) {
    return []
  }

  return logs.map((log: any) => {
    return {
      sourceChainId: chainId,
      transactionHash: log.transactionHash,
      nonce: BigNumber.from(log.topics[1]).toNumber(),
      destinationChainId: BigNumber.from(log.topics[2]).toNumber()
    }
  })
}

async function getTransfersRelayed (chain: string): Promise<{ nonce: number, sourceChainId: number }[]> {
  const chainId = chainSlugToId(chain)
  const eventFilter = Message.getMessageReceivedEventFilter(chainId)
  const startBlock = getDefaultStartBlockNumber(chainId)
  const { logs } = await getEventsInRange(chain as ChainSlug, eventFilter, startBlock)
  if (logs.length === 0) {
    return []
  }

  const items = []
  for (const log of logs) {
    // TODO: Not as hacky
    const decodedSourceDomain = BigNumber.from(log.data.substring(0, 66)).toNumber()
    const sourceChainId = CCTP_DOMAIN_MAP[globalConfig.network as NetworkSlug]?.[decodedSourceDomain]
    if (!sourceChainId) {
      continue
    }

    items.push({
      nonce: BigNumber.from(log.topics[2]).toNumber(),
      sourceChainId
    })
  }

  return items
}
