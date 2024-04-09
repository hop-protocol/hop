import { Messenger } from '#messenger/index.js'
import { getAddress, parseUnits } from 'ethers/lib/utils.js'
import { providers, Wallet } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

describe.skip('Messenger', () => {
  const ethereumRpcUrl = process.env.ETHEREUM_RPC_PROVIDER!
  const provider = new providers.StaticJsonRpcProvider(ethereumRpcUrl)
  const signer = new Wallet(process.env.PRIVATE_KEY!)
  const address = '0xTODO'
  const messenger = new Messenger()
  it.skip('TODO should get rpc provider', async () => {
    const chainId = 1
    const provider = messenger.getRpcProvider(chainId)
    expect(provider).toBeDefined()
  })
  it.skip('TODO should get spokeMessageBridge contract address', async () => {
    const chainId = 1
    const address = messenger.getSpokeMessageBridgeContractAddress(chainId)
    expect(address).toBeDefined()
  })
  it.skip('TODO should get hubMessageBridge contract address', async () => {
    const chainId = 1
    const address = messenger.getHubMessageBridgeContractAddress(chainId)
    expect(address).toBeDefined()
  })
  it.skip('TODO should get isValidChainId', async () => {
    const chainId = 1
    const valid = messenger.isValidChainId(chainId)
    expect(valid).toBeTruthy()
  })
  it.skip('TODO should get isValidTxHash', async () => {
    const txHash = '0xTODO'
    const valid = messenger.isValidTxHash(txHash)
    expect(valid).toBeTruthy()
  })
  it.skip('TODO should get chainSlug', async () => {
    const chainId = 1
    const chainSlug = messenger.getChainSlug(1)
    expect(chainSlug).toBe('ethereum')
  })
  it.skip('TODO should get BundleCommitted events', async () => {
    const chainId = 1
    const fromBlock = 0
    const toBlock = 1000
    const events = await messenger.getBundleCommittedEvents({
      chainId,
      fromBlock,
      toBlock
    })
    expect(events.length).toBe(1)
  })
  it.skip('TODO should get BundleForwared events', async () => {
    const chainId = 1
    const fromBlock = 0
    const toBlock = 1000
    const events = await messenger.getBundleForwardedEvents({
      chainId,
      fromBlock,
      toBlock
    })
    expect(events.length).toBe(1)
  })
  it.skip('TODO should get BundleReceived events', async () => {
    const chainId = 1
    const fromBlock = 0
    const toBlock = 1000
    const events = await messenger.getBundleReceivedEvents({
      chainId,
      fromBlock,
      toBlock
    })
    expect(events.length).toBe(1)
  })
  it.skip('TODO should get BundleSet events', async () => {
    const chainId = 1
    const fromBlock = 0
    const toBlock = 1000
    const events = await messenger.getBundleSetEvents({
      chainId,
      fromBlock,
      toBlock
    })
    expect(events.length).toBe(1)
  })
  it.skip('TODO should get FeesSentToHub events', async () => {
    const chainId = 1
    const fromBlock = 0
    const toBlock = 1000
    const events = await messenger.getFeesSentToHubEvents({
      chainId,
      fromBlock,
      toBlock
    })
    expect(events.length).toBe(1)
  })
  it.skip('TODO should get MessageBundled events', async () => {
    const chainId = 1
    const fromBlock = 0
    const toBlock = 1000
    const events = await messenger.getMessageBundledEvents({
      chainId,
      fromBlock,
      toBlock
    })
    expect(events.length).toBe(1)
  })
  it.skip('TODO should get MessageExecuted events', async () => {
    const chainId = 1
    const fromBlock = 0
    const toBlock = 1000
    const events = await messenger.getMessageExecutedEvents({
      chainId,
      fromBlock,
      toBlock
    })
    expect(events.length).toBe(1)
  })
  it.skip('TODO should get MessageSent events', async () => {
    const chainId = 1
    const fromBlock = 0
    const toBlock = 1000
    const events = await messenger.getMessageSentEvents({
      chainId,
      fromBlock,
      toBlock
    })
    expect(events.length).toBe(1)
  })
  it.skip('TODO should get has auction started state', async () => {
    const fromChainId = 1
    const bundleCommittedEvent: any = {}
    const started = await messenger.getHasAuctionStarted({
      fromChainId,
      bundleCommittedEvent
    })
    expect(started).toBeDefined()
  })
  it.skip('TODO should get spoke exit time', async () => {
    const fromChainId = 1
    const toChainId = 2
    const time = await messenger.getSpokeExitTime({
      fromChainId,
      toChainId
    })
    expect(time).toBeGreaterThan(0)
  })
  it.skip('TODO should get relay reward', async () => {
    const fromChainId = 1
    const bundleCommittedEvent: any = {}
    const reward = await messenger.getRelayReward({
      fromChainId,
      bundleCommittedEvent
    })
    expect(reward).toBeDefined()
  })
  it.skip('TODO should get estimated tx cost for forward message', async () => {
    const chainId = 1
    const cost = await messenger.getEstimatedTxCostForForwardMessage({
      chainId
    })
    expect(cost).toBeDefined()
  })
  it.skip('TODO should get should attempt forward message', async () => {
    const fromChainId = 1
    const bundleCommittedEvent: any = {}
    const attempt = await messenger.getShouldAttemptForwardMessage({
      fromChainId,
      bundleCommittedEvent
    })
    expect(attempt).toBeDefined()
  })
  it.skip('TODO should get bundle exit populated tx', async () => {
    const fromChainId = 1
    const bundleCommittedEvent: any = {}
    const bundleCommittedTransactionHash = '0xTODO'
    const populatedTx = await messenger.getBundleExitPopulatedTx({
      fromChainId,
      bundleCommittedEvent,
      bundleCommittedTransactionHash
    })
    expect(populatedTx).toBeDefined()
  })
  it.skip('TODO should exit bundle', async () => {
    const fromChainId = 1
    const bundleCommittedEvent: any = {}
    const bundleCommittedTransactionHash = ''
    const tx = await messenger.exitBundle({
      fromChainId,
      bundleCommittedEvent,
      bundleCommittedTransactionHash,
      signer
    })
    expect(tx.hash).toBeDefined()
  })
  it.skip('TODO should get is L2 tx hash exited', async () => {
    const fromChainId = 1
    const transactionHash = '0xTODO'
    const exited  = await messenger.getIsL2TxHashExited({
      fromChainId,
      transactionHash
    })
    expect(exited).toBeDefined()
  })
  it.skip('TODO should get send message populated tx', async () => {
    const fromChainId = 1
    const toChainId = 2
    const toAddress = '0xTODO'
    const toCalldata = '0xTODO'
    const populatedTx = await messenger.getSendMessagePopulatedTx({
      fromChainId,
      toChainId,
      toAddress,
      toCalldata,
    })
    expect(populatedTx).toBeDefined()
  })
  it.skip('TODO should get relay window hours', async () => {
    const hours = await messenger.getRelayWindowHours()
    expect(hours).toBe(12)
  })
  it.skip('TODO should get route data', async () => {
    const fromChainId = 1
    const toChainId = 2
    const data = await messenger.getRouteData({
      fromChainId,
      toChainId
    })
    expect(data).toBeDefined()
  })
  it.skip('TODO should get message fee', async () => {
    const fromChainId = 1
    const toChainId = 2
    const fee = await messenger.getMessageFee({
      fromChainId,
      toChainId
    })
    expect(fee).toBeDefined()
  })
  it.skip('TODO should get max bundle message count', async () => {
    const fromChainId = 1
    const toChainId = 2
    const count = await messenger.getMaxBundleMessageCount({
      fromChainId,
      toChainId
    })
    expect(count).toBeDefined()
  })
  it.skip('TODO should get is bundle set', async () => {
    const fromChainId = 1
    const toChainId = 2
    const bundleId = '0xTODO'
    const isSet = await messenger.getIsBundleSet({
      fromChainId,
      toChainId,
      bundleId
    })
    expect(isSet).toBeDefined()
  })
  it.skip('TODO should get MessageSent event from transaction receipt', async () => {
    const fromChainId = 1
    const receipt: any = {}
    const event = await messenger.getMessageSentEventFromTransactionReceipt({
      fromChainId,
      receipt
    })
    expect(event).toBeDefined()
  })
  it.skip('TODO should get MessageSent event from transaction hash', async () => {
    const fromChainId = 1
    const transactionHash = '0xTODO'
    const event = await messenger.getMessageSentEventFromTransactionHash({
      fromChainId,
      transactionHash
    })
    expect(event).toBeDefined()
  })
  it.skip('TODO should get MessageBundled event from messageId', async () => {
    const fromChainId = 1
    const messageId = '0xTODO'
    const event = await messenger.getMessageBundledEventFromMessageId({
      fromChainId,
      messageId
    })
    expect(event).toBeDefined()
  })
  it.skip('TODO should get MessageSent event from messageId', async () => {
    const fromChainId = 1
    const messageId = '0xTODO'
    const event = await messenger.getMessageSentEventFromMessageId({
      fromChainId,
      messageId
    })
    expect(event).toBeDefined()
  })
  it.skip('TODO should get MessageExecuted event from messageId', async () => {
    const fromChainId = 1
    const toChainId = 2
    const messageId = '0xTODO'
    const event = await messenger.getMessageExecutedEventFromMessageId({
      fromChainId,
      toChainId,
      messageId
    })
    expect(event).toBeDefined()
  })
  it.skip('TODO should get MessageBundled event from transaction hash', async () => {
    const fromChainId = 1
    const transactionHash = '0xTODO'
    const event = await messenger.getMessageBundledEventFromTransactionHash({
      fromChainId,
      transactionHash
    })
    expect(event).toBeDefined()
  })
  it.skip('TODO should get messageId from transaction hash', async () => {
    const fromChainId = 1
    const transactionHash = '0xTODO'
    const messageId = await messenger.getMessageIdFromTransactionHash({
      fromChainId,
      transactionHash
    })
    expect(messageId).toBeDefined()
  })
  it.skip('TODO should get MessageBundle id from messageId', async () => {
    const fromChainId = 1
    const messageId = '0xTODO'
    const messageBundleId = await messenger.getMessageBundleIdFromMessageId({
      fromChainId,
      messageId
    })
    expect(messageBundleId).toBeDefined()
  })
  it.skip('TODO should get MessageBundle id from transaction hash', async () => {
    const fromChainId = 1
    const transactionHash = '0xTODO'
    const messageBundleId = await messenger.getMessageBundleIdFromTransactionHash({
      fromChainId,
      transactionHash
    })
    expect(messageBundleId).toBeDefined()
  })
  it.skip('TODO should get message tree index from messageId', async () => {
    const fromChainId = 1
    const messageId = '0xTODO'
    const index = await messenger.getMessageTreeIndexFromMessageId({
      fromChainId,
      messageId
    })
    expect(index).toBeDefined()
  })
  it.skip('TODO should get message tree index from transaction hash', async () => {
    const fromChainId = 1
    const transactionHash = '0xTODO'
    const index = await messenger.getMessageTreeIndexFromTransactionHash({
      fromChainId,
      transactionHash
    })
    expect(index).toBeDefined()
  })
  it.skip('TODO should get MessageBundled events for bundleId', async () => {
    const fromChainId = 1
    const bundleId = '0xTODO'
    const events = await messenger.getMessageBundledEventsForBundleId({
      fromChainId,
      bundleId
    })
    expect(events).toBeDefined()
  })
  it.skip('TODO should get messageIds for bundleId', async () => {
    const fromChainId = 1
    const bundleId = '0xTODO'
    const messageIds = await messenger.getMessageIdsForBundleId({
      fromChainId,
      bundleId
    })
    expect(messageIds).toBeDefined()
  })
  it.skip('TODO should get merkle proof for messageId', async () => {
    const messageIds: string[] = []
    const targetMessageId = '0xTODO'
    const proof = await messenger.getMerkleProofForMessageId({
      messageIds,
      targetMessageId
    })
    expect(proof).toBeDefined()
  })
  it.skip('TODO should get bundle proof from message id', async () => {
    const fromChainId = 1
    const messageId = '0xTODO'
    const event = await messenger.getBundleProofFromMessageId({
      fromChainId,
      messageId
    })
    expect(event).toBeDefined()
  })
  it.skip('TODO should get bundle proof from transaction hash', async () => {
    const fromChainId = 1
    const transactionHash = '0xTODO'
    const proof = await messenger.getBundleProofFromTransactionHash({
      fromChainId,
      transactionHash
    })
    expect(proof).toBeDefined()
  })
  it.skip('TODO should get relay message data from transaction hash', async () => {
    const fromChainId = 1
    const transactionHash = '0xTODO'
    const data = await messenger.getRelayMessageDataFromTransactionHash({
      fromChainId,
      transactionHash
    })
    expect(data).toBeDefined()
  })
  it.skip('TODO should get relay message populated tx', async () => {
    const fromChainId = 1
    const toChainId = 2
    const fromAddress = '0xTODO'
    const toAddress = '0xTODO'
    const toCalldata = '0x'
    const bundleProof: any = {}
    const populatedTx = await messenger.getRelayMessagePopulatedTx({
      fromChainId,
      toChainId,
      fromAddress,
      toAddress,
      toCalldata,
      bundleProof
    })
    expect(populatedTx).toBeDefined()
  })
  it.skip('TODO should get message calldata', async () => {
    const fromChainId = 1
    const messageId = '0xTODO'
    const calldata = await messenger.getMessageCalldata({
      fromChainId,
      messageId
    })
    expect(calldata).toBeDefined()
  })
  it.skip('TODO should get is messageId relayed', async () => {
    const fromChainId = 1
    const toChainId = 2
    const messageId = '0xTODO'
    const relayed = await messenger.getIsMessageIdRelayed({
      fromChainId,
      toChainId,
      messageId
    })
    expect(relayed).toBeDefined()
  })
  it.skip('TODO should get relay fee', async () => {
    const fromChainId = 1
    const toChainId = 2
    const toAddress = '0xTODO'
    const toCalldata = '0x'
    const fee = await messenger.getRelayFee({
      fromChainId,
      toChainId,
      toAddress,
      toCalldata
    })
    expect(fee).toBeDefined()
  })
})
