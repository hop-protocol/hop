import { jest } from '@jest/globals'
import { Messenger } from '#messenger/index.js'
import { providers, Wallet } from 'ethers'
import dotenv from 'dotenv'
import { randomBytes } from 'crypto'

dotenv.config()

export const privateKey = process.env.PRIVATE_KEY ?? randomBytes(32).toString('hex')

describe('Messenger', () => {
  const ethereumRpcUrl = process.env.ETHEREUM_RPC_PROVIDER!
  const provider = new providers.StaticJsonRpcProvider(ethereumRpcUrl)
  const signer = new Wallet(privateKey)
  const address = '0xTODO'
  it('should get spokeMessageBridge contract address', async () => {
    const chainId =  1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    jest.spyOn(messenger as any, 'getSpokeMessageBridgeContractAddress').mockReturnValue('0x')
    const address = messenger.getSpokeMessageBridgeContractAddress()
    console.log(address)

    expect(address).toBeDefined()
  })
  it('should get hubMessageBridge contract address', async () => {
    const chainId =  1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    jest.spyOn(messenger as any, 'getHubMessageBridgeContractAddress').mockReturnValue('0x')
    const address = messenger.getHubMessageBridgeContractAddress()
    expect(address).toBeDefined()
  })
  it('should get BundleCommitted events', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const fromBlock = 0
    const toBlock = 1000
    jest.spyOn(messenger as any, 'getBundleCommittedEvents').mockReturnValue([{}] as any)
    const events = await messenger.getBundleCommittedEvents({
      fromBlock,
      toBlock
    })
    expect(events.length).toBe(1)
  })
  it.skip('TODO should get BundleForwared events', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const fromBlock = 0
    const toBlock = 1000
    const events = await messenger.getBundleForwardedEvents({
      fromBlock,
      toBlock
    })
    expect(events.length).toBe(1)
  })
  it.skip('TODO should get BundleReceived events', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const fromBlock = 0
    const toBlock = 1000
    const events = await messenger.getBundleReceivedEvents({
      fromBlock,
      toBlock
    })
    expect(events.length).toBe(1)
  })
  it.skip('TODO should get BundleSet events', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const fromBlock = 0
    const toBlock = 1000
    const events = await messenger.getBundleSetEvents({
      fromBlock,
      toBlock
    })
    expect(events.length).toBe(1)
  })
  it.skip('TODO should get FeesSentToHub events', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const fromBlock = 0
    const toBlock = 1000
    const events = await messenger.getFeesSentToHubEvents({
      fromBlock,
      toBlock
    })
    expect(events.length).toBe(1)
  })
  it.skip('TODO should get MessageBundled events', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const fromBlock = 0
    const toBlock = 1000
    const events = await messenger.getMessageBundledEvents({
      fromBlock,
      toBlock
    })
    expect(events.length).toBe(1)
  })
  it.skip('TODO should get MessageExecuted events', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const fromBlock = 0
    const toBlock = 1000
    const events = await messenger.getMessageExecutedEvents({
      fromBlock,
      toBlock
    })
    expect(events.length).toBe(1)
  })
  it.skip('TODO should get MessageSent events', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const fromBlock = 0
    const toBlock = 1000
    const events = await messenger.getMessageSentEvents({
      fromBlock,
      toBlock
    })
    expect(events.length).toBe(1)
  })
  it.skip('TODO should get has auction started state', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const bundleCommittedEvent: any = {}
    const started = await messenger.getHasAuctionStarted({
      bundleCommittedEvent
    })
    expect(started).toBeDefined()
  })
  it.skip('TODO should get spoke exit time', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const spokeChainId = 2
    const time = await messenger.getSpokeExitTime({
      spokeChainId
    })
    expect(time).toBeGreaterThan(0)
  })
  it.skip('TODO should get relay reward', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const fromChainId = 1
    const bundleCommittedEvent: any = {}
    const reward = await messenger.getRelayReward({
      bundleCommittedEvent
    })
    expect(reward).toBeDefined()
  })
  it.skip('TODO should get estimated tx cost for forward message', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const cost = await messenger.getEstimatedTxCostForForwardMessage()
    expect(cost).toBeDefined()
  })
  it.skip('TODO should get should attempt forward message', async () => {
    const chainId = 2
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const fromChainId = 1
    const bundleCommittedEvent: any = {}
    const attempt = await messenger.getShouldAttemptForwardMessage({
      fromChainId: 1,
      bundleCommittedEvent
    })
    expect(attempt).toBeDefined()
  })
  it.skip('TODO should get bundle exit populated tx', async () => {
    const chainId = 2
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const fromChainId = 2
    const bundleCommittedEvent: any = {}
    const bundleCommittedTransactionHash = '0xTODO'
    const populatedTx = await messenger.populateTransaction.bundleExit({
      fromChainId,
      bundleCommittedEvent,
      bundleCommittedTransactionHash
    })
    expect(populatedTx).toBeDefined()
  })
  it.skip('TODO should exit bundle', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const bundleCommittedEvent: any = {}
    const bundleCommittedTransactionHash = ''
    const tx = await messenger.exitBundle({
      bundleCommittedEvent,
      bundleCommittedTransactionHash,
    })
    expect(tx.hash).toBeDefined()
  })
  it.skip('TODO should get is L2 tx hash exited', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const transactionHash = '0xTODO'
    const exited  = await messenger.getIsL2TxHashExited({
      transactionHash
    })
    expect(exited).toBeDefined()
  })
  it.skip('TODO should get send message populated tx', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const toChainId = 2
    const toAddress = '0xTODO'
    const toCalldata = '0xTODO'
    const populatedTx = await messenger.populateTransaction.sendMessage({
      toChainId,
      toAddress,
      toCalldata,
    })
    expect(populatedTx).toBeDefined()
  })
  it.skip('TODO should get relay window hours', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const hours = await messenger.getRelayWindowHours()
    expect(hours).toBe(12)
  })
  it.skip('TODO should get route data', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const toChainId = 2
    const data = await messenger.getRouteData({
      toChainId
    })
    expect(data).toBeDefined()
  })
  it.skip('TODO should get message fee', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const toChainId = 2
    const fee = await messenger.getMessageFee({
      toChainId
    })
    expect(fee).toBeDefined()
  })
  it.skip('TODO should get max bundle message count', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const toChainId = 2
    const count = await messenger.getMaxBundleMessageCount({
      toChainId
    })
    expect(count).toBeDefined()
  })
  it.skip('TODO should get is bundle set', async () => {
    const chainId = 2
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const fromChainId = 1
    const bundleId = '0xTODO'
    const isSet = await messenger.getIsBundleSet({
      fromChainId,
      bundleId
    })
    expect(isSet).toBeDefined()
  })
  it.skip('should get MessageSent event from transaction receipt', async () => {
    const chainId = '11155111'
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const receipt: any = {
      "to": "0x3791ed182b54e4DBB2522E97A86bC5a7c0cE8D6A",
      "from": "0x6020aAD5CAFB06c33BBF44DBaBD9F55f42fF2BcA",
      "contractAddress": null,
      "transactionIndex": 55,
      "gasUsed": {
        "type": "BigNumber",
        "hex": "0x02cde4"
      },
      "logsBloom": "0x04000000840300000000000000000000000000000000000000000000000000040000002000000000100000000000000000000000000020000002000000200000000000000000000000000008001000000000000000800000000000000000200000000002000000000000008400000400000000000000000000000010000100000000800000020000000000000020000000000000100000000000000004000000020000010000000000000108040000400200000002000000000000000000000000000002000000000000000010000000000000000400000000000040004000020010000000008000000000000100400000000000008100008040000000000000",
      "blockHash": "0x0e85ef181627696d96ecb5812048c8c50e6e336a6e74c9646a1c30f0e4c91e7f",
      "transactionHash": "0x0478a7c71aabda736cf7238fec9ae6e2c8aa6626f0d87b28aeaa5150d521392d",
      "logs": [
        {
          "transactionIndex": 55,
          "blockNumber": 6664679,
          "transactionHash": "0x0478a7c71aabda736cf7238fec9ae6e2c8aa6626f0d87b28aeaa5150d521392d",
          "address": "0x3791ed182b54e4DBB2522E97A86bC5a7c0cE8D6A",
          "topics": [
            "0x3d5679b3c8a1d106e71289dce97aa0f2518e8c2e1279556fca8753c71257b627",
            "0x5be8acd551732a476d4787319ec94ee95a1bd68656a30f577c6fc50f970180e6",
            "0xd2b4de133dd9d0d38fb46e4c858e6c56aa3fb18fd7a738be80fae74604bf8947",
            "0x0000000000000000000000006020aad5cafb06c33bbf44dbabd9f55f42ff2bca"
          ],
          "data": "0x000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000001bc16d674ec800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000",
          "logIndex": 98,
          "blockHash": "0x0e85ef181627696d96ecb5812048c8c50e6e336a6e74c9646a1c30f0e4c91e7f"
        },
        {
          "transactionIndex": 55,
          "blockNumber": 6664679,
          "transactionHash": "0x0478a7c71aabda736cf7238fec9ae6e2c8aa6626f0d87b28aeaa5150d521392d",
          "address": "0x0FcB53Fd9363f186eaB2Eb6a18f3a5d360058981",
          "topics": [
            "0xcd767b5406b2f63d8e220a45e7163c272f174d25a5015149cbf47baed68ff7e4",
            "0x2b4f3f580af9c03bc1f65a94ddba9b1e886ff3c39d98df83afb469c53b285636",
            "0x0000000000000000000000003791ed182b54e4dbb2522e97a86bc5a7c0ce8d6a",
            "0x0000000000000000000000000000000000000000000000000000000000014a34"
          ],
          "data": "0x0000000000000000000000003791ed182b54e4dbb2522e97a86bc5a7c0ce8d6a00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000044040aa57a5be8acd551732a476d4787319ec94ee95a1bd68656a30f577c6fc50f970180e6d2b4de133dd9d0d38fb46e4c858e6c56aa3fb18fd7a738be80fae74604bf894700000000000000000000000000000000000000000000000000000000",
          "logIndex": 99,
          "blockHash": "0x0e85ef181627696d96ecb5812048c8c50e6e336a6e74c9646a1c30f0e4c91e7f"
        },
        {
          "transactionIndex": 55,
          "blockNumber": 6664679,
          "transactionHash": "0x0478a7c71aabda736cf7238fec9ae6e2c8aa6626f0d87b28aeaa5150d521392d",
          "address": "0x0FcB53Fd9363f186eaB2Eb6a18f3a5d360058981",
          "topics": [
            "0x3baa9ea6f10f788d3e1912fddcfa6831f4f9da67b643b348879a787102428ff1",
            "0x4e17e0f8e5a658c99706752108d59951f0e3bea1258ae0cc27e4513e09be8d6f",
            "0x0000000000000000000000000000000000000000000000000000000000000002",
            "0x2b4f3f580af9c03bc1f65a94ddba9b1e886ff3c39d98df83afb469c53b285636"
          ],
          "data": "0x",
          "logIndex": 100,
          "blockHash": "0x0e85ef181627696d96ecb5812048c8c50e6e336a6e74c9646a1c30f0e4c91e7f"
        },
        {
          "transactionIndex": 55,
          "blockNumber": 6664679,
          "transactionHash": "0x0478a7c71aabda736cf7238fec9ae6e2c8aa6626f0d87b28aeaa5150d521392d",
          "address": "0x73bd27b5DB0815979bBCEb1Da519DECeF9F74Baf",
          "topics": [
            "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
            "0x0000000000000000000000006020aad5cafb06c33bbf44dbabd9f55f42ff2bca",
            "0x0000000000000000000000003791ed182b54e4dbb2522e97a86bc5a7c0ce8d6a"
          ],
          "data": "0x0000000000000000000000000000000000000000000000055c8362015e220000",
          "logIndex": 101,
          "blockHash": "0x0e85ef181627696d96ecb5812048c8c50e6e336a6e74c9646a1c30f0e4c91e7f"
        },
        {
          "transactionIndex": 55,
          "blockNumber": 6664679,
          "transactionHash": "0x0478a7c71aabda736cf7238fec9ae6e2c8aa6626f0d87b28aeaa5150d521392d",
          "address": "0x73bd27b5DB0815979bBCEb1Da519DECeF9F74Baf",
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x0000000000000000000000006020aad5cafb06c33bbf44dbabd9f55f42ff2bca",
            "0x0000000000000000000000003791ed182b54e4dbb2522e97a86bc5a7c0ce8d6a"
          ],
          "data": "0x000000000000000000000000000000000000000000000000016345785d8a0000",
          "logIndex": 102,
          "blockHash": "0x0e85ef181627696d96ecb5812048c8c50e6e336a6e74c9646a1c30f0e4c91e7f"
        }
      ],
      "blockNumber": 6664679,
      "confirmations": 6135,
      "cumulativeGasUsed": {
        "type": "BigNumber",
        "hex": "0x6fb021"
      },
      "effectiveGasPrice": {
        "type": "BigNumber",
        "hex": "0xd86107aa"
      },
      "status": 1,
      "type": 2,
      "byzantium": true
    }

    const event = await messenger.getMessageSentEventFromTransactionReceipt({
      receipt
    })
    console.log(event)
    expect(event).toBeDefined()
    expect(event!.logIndex).toBeDefined()
    expect(event!.decoded).toBeDefined()
  })
  it.skip('TODO should get MessageSent event from transaction hash', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const transactionHash = '0xTODO'
    const event = await messenger.getMessageSentEventFromTransactionHash({
      transactionHash
    })
    expect(event).toBeDefined()
  })
  it.skip('TODO should get MessageBundled event from messageId', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const messageId = '0xTODO'
    const event = await messenger.getMessageBundledEventFromMessageId({
      messageId
    })
    expect(event).toBeDefined()
  })
  it.skip('should get MessageSent event from messageId', async () => {
    const chainId = '11155111'
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const messageId = '0x2b4f3f580af9c03bc1f65a94ddba9b1e886ff3c39d98df83afb469c53b285636'
    const event = await messenger.getMessageSentEventFromMessageId({
      messageId
    })
    console.log(event)
    expect(event).toBeDefined()
    expect(event!.decoded).toBeDefined()
    expect(event!.topics).toBeDefined()
  })
  it.skip('TODO should get MessageExecuted event from messageId', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const messageId = '0xTODO'
    const event = await messenger.getMessageExecutedEventFromMessageId({
      messageId
    })
    expect(event).toBeDefined()
  })
  it.skip('TODO should get MessageBundled event from transaction hash', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const transactionHash = '0xTODO'
    const event = await messenger.getMessageBundledEventFromTransactionHash({
      transactionHash
    })
    expect(event).toBeDefined()
  })
  it.skip('TODO should get messageId from transaction hash', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const transactionHash = '0xTODO'
    const messageId = await messenger.getMessageIdFromTransactionHash({
      transactionHash
    })
    expect(messageId).toBeDefined()
  })
  it.skip('TODO should get MessageBundle id from messageId', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const messageId = '0xTODO'
    const messageBundleId = await messenger.getMessageBundleIdFromMessageId({
      messageId
    })
    expect(messageBundleId).toBeDefined()
  })
  it.skip('TODO should get MessageBundle id from transaction hash', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const transactionHash = '0xTODO'
    const messageBundleId = await messenger.getMessageBundleIdFromTransactionHash({
      transactionHash
    })
    expect(messageBundleId).toBeDefined()
  })
  it.skip('TODO should get message tree index from messageId', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const messageId = '0xTODO'
    const index = await messenger.getMessageTreeIndexFromMessageId({
      messageId
    })
    expect(index).toBeDefined()
  })
  it.skip('TODO should get message tree index from transaction hash', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const transactionHash = '0xTODO'
    const index = await messenger.getMessageTreeIndexFromTransactionHash({
      transactionHash
    })
    expect(index).toBeDefined()
  })
  it.skip('TODO should get MessageBundled events for bundleId', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const bundleId = '0xTODO'
    const events = await messenger.getMessageBundledEventsForBundleId({
      bundleId
    })
    expect(events).toBeDefined()
  })
  it.skip('TODO should get messageIds for bundleId', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const bundleId = '0xTODO'
    const messageIds = await messenger.getMessageIdsForBundleId({
      bundleId
    })
    expect(messageIds).toBeDefined()
  })
  it.skip('TODO should get merkle proof for messageId', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const messageIds: string[] = []
    const targetMessageId = '0xTODO'
    const proof = await messenger.getMerkleProofForMessageId({
      messageIds,
      targetMessageId
    })
    expect(proof).toBeDefined()
  })
  it.skip('TODO should get bundle proof from message id', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const messageId = '0xTODO'
    const event = await messenger.getBundleProofFromMessageId({
      messageId
    })
    expect(event).toBeDefined()
  })
  it.skip('TODO should get bundle proof from transaction hash', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const transactionHash = '0xTODO'
    const proof = await messenger.getBundleProofFromTransactionHash({
      transactionHash
    })
    expect(proof).toBeDefined()
  })
  it.skip('TODO should get relay message data from transaction hash', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const transactionHash = '0xTODO'
    const data = await messenger.getRelayMessageDataFromTransactionHash({
      transactionHash
    })
    expect(data).toBeDefined()
  })
  it.skip('TODO should get relay message populated tx', async () => {
    const chainId = 2
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const fromChainId = 1
    const fromAddress = '0xTODO'
    const toAddress = '0xTODO'
    const toCalldata = '0x'
    const bundleProof: any = {}
    const populatedTx = await messenger.populateTransaction.relayMessage({
      fromChainId,
      fromAddress,
      toAddress,
      toCalldata,
      bundleProof
    })
    expect(populatedTx).toBeDefined()
  })
  it.skip('TODO should get message calldata', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const messageId = '0xTODO'
    const calldata = await messenger.getMessageCalldataFromMessageId({
      messageId
    })
    expect(calldata).toBeDefined()
  })
  it.skip('TODO should get is messageId relayed', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const messageId = '0xTODO'
    const relayed = await messenger.getIsMessageIdRelayed({
      messageId
    })
    expect(relayed).toBeDefined()
  })
  it.skip('TODO should get relay fee', async () => {
    const chainId = 1
    const provider = Messenger.getDefaultProvider(chainId)
    const messenger = new Messenger({
      chainId,
      signerOrProvider: provider
    })

    const toChainId = 2
    const toAddress = '0xTODO'
    const toCalldata = '0x'
    const fee = await messenger.getRelayFee({
      toChainId,
      toAddress,
      toCalldata
    })
    expect(fee).toBeDefined()
  })
  it('should get BundleCommitted event signature using static method', async () => {
    const signature = Messenger.getBundleCommittedEventSignature()

    console.log(signature)
    expect(signature).toBeTruthy()
  })
  it('should get BundleForwarded event signature using static method', async () => {
    const signature = Messenger.getBundleForwardedEventSignature()

    console.log(signature)
    expect(signature).toBeTruthy()
  })
  it('should get BundleReceived event signature using static method', async () => {
    const signature = Messenger.getBundleReceivedEventSignature()

    console.log(signature)
    expect(signature).toBeTruthy()
  })
  it('should get BundleSet event signature using static method', async () => {
    const signature = Messenger.getBundleSetEventSignature()

    console.log(signature)
    expect(signature).toBeTruthy()
  })
  it('should get FeesSentToHub event signature using static method', async () => {
    const signature = Messenger.getFeesSentToHubEventSignature()

    console.log(signature)
    expect(signature).toBeTruthy()
  })
  it('should get MessageBundled event signature using static method', async () => {
    const signature = Messenger.getMessageBundledEventSignature()

    console.log(signature)
    expect(signature).toBeTruthy()
  })
  it('should get MessageExecuted event signature using static method', async () => {
    const signature = Messenger.getMessageExecutedEventSignature()

    console.log(signature)
    expect(signature).toBeTruthy()
  })
  it('should get MessageSent event signature using static method', async () => {
    const signature = Messenger.getMessageSentEventSignature()

    console.log(signature)
    expect(signature).toBeTruthy()
  })
})
