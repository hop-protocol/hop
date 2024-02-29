import pkg from '../package.json'
import { BigNumber, Wallet, providers } from 'ethers'
import { Hop } from '../src/index.js'
require('dotenv').config()

const privateKey = process.env.PRIVATE_KEY

const contractAddresses_v001 = {
  5: {
    startBlock: 8077320,
    hubCoreMessenger: '0x9827315F7D2B1AAd0aa4705c06dafEE6cAEBF920',
    spokeCoreMessenger: '0x9827315F7D2B1AAd0aa4705c06dafEE6cAEBF920',
    ethFeeDistributor: '0x8fF09Ff3C87085Fe4607F2eE7514579FE50944C5'
  },
  420: {
    startBlock: 3218800,
    spokeCoreMessenger: '0x4b844c25ef430e71d42eea89d87ffe929f8db927',
    connector: '0x342EA1227fC0e085704D30cd17a16cA98B58D08B'
  }
}

const contractAddresses_v002 = {
  5: {
    startBlock: 8095954,
    hubCoreMessenger: '0xE3F4c0B210E7008ff5DE92ead0c5F6A5311C4FDC',
    spokeCoreMessenger: '0xE3F4c0B210E7008ff5DE92ead0c5F6A5311C4FDC',
    ethFeeDistributor: '0xf6eED903Ac2A34E115547874761908DD3C5fe4bf'
  },
  420: {
    startBlock: 3218800,
    spokeCoreMessenger: '0xeA35E10f763ef2FD5634dF9Ce9ad00434813bddB',
    connector: '0x6be2E6Ce67dDBCda1BcdDE7D2bdCC50d34A7eD24'
  }
}

const contractAddresses_v003 = {
  5: {
    startBlock: 8818888,
    hubCoreMessenger: '0x23E7046ac7e34DCFaCa85adD8ac72B59e3812E34',
    spokeCoreMessenger: '0x23E7046ac7e34DCFaCa85adD8ac72B59e3812E34',
    ethFeeDistributor: ''
  },
  420: {
    startBlock: 7947719,
    spokeCoreMessenger: '0x323019fac2d13d439ae94765b901466bfa8eeac1',
    connector: ''
  }
}

describe('sdk setup', () => {
  it('should return version', () => {
    const hop = new Hop()
    expect(hop.version).toBe(pkg.version)
  })
  it('should return supported chains', () => {
    const hop = new Hop('goerli')
    expect(hop.getSupportedChainIds()).toStrictEqual([5, 420])
  })
  it.skip('getSendMessagePopulatedTx', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    const fromChainId = 420
    const toChainId = 5
    const toAddress = '0x0000000000000000000000000000000000000000'
    const toCalldata = '0x'
    const txData = await hop.getSendMessagePopulatedTx({ fromChainId, toChainId, toAddress, toCalldata })
    expect(txData.data.startsWith('0x7056f41f')).toBe(true)
    // expect(txData.to).toBe('0x4b844c25EF430e71D42EEA89d87Ffe929f8db927')
    expect(txData.to).toBe('0xeA35E10f763ef2FD5634dF9Ce9ad00434813bddB')
    const fee = await hop.getMessageFee({ fromChainId, toChainId })
    expect(BigNumber.from(txData.value).gt(0)).toBe(true)
    expect(txData.value).toBe(fee.toString())
    const shouldSend = false
    const times = 8
    if (shouldSend) {
      for (let i = 0; i < times; i++) {
        const signer = new Wallet(privateKey)
        const provider = hop.getRpcProvider(fromChainId)
        const fee = await hop.getMessageFee({ fromChainId, toChainId })
        const tx = await signer.connect(provider).sendTransaction({
          to: txData.to,
          data: txData.data,
          value: fee
        })
        console.log(tx)
        expect(tx.hash).toBeTruthy()
      }
    }
  }, 60 * 1000)
  it('getEvents', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v001
    })
    const chainId = 420
    const toBlock = 3218900
    const fromBlock = toBlock - 10
    let eventNames = ['BundleCommitted']
    let events = await hop.getEvents({ eventNames, chainId, fromBlock, toBlock })
    // console.log(events)
    expect(events.length).toBe(1)

    eventNames = ['BundleCommitted', 'MessageSent']
    events = await hop.getEvents({ eventNames, chainId, fromBlock, toBlock })
    console.log(events)
    expect(events.length).toBe(2)
  }, 60 * 1000)
  it('getBundleCommittedEvents', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v001
    })
    const chainId = 420
    const toBlock = 3218900
    const fromBlock = toBlock - 100
    const events = await hop.getBundleCommittedEvents({ chainId, fromBlock, toBlock })
    console.log(events)
    expect(events.length).toBe(1)
    expect(events[0].bundleId).toBe('0x941b97adc8856fc13c566e5b9aaa9cd5fd953324452f0aa1fe24ca227a5e2ab6')
    expect(events[0].bundleRoot).toBe('0x1ff2a2c860acb0772ae0aa3971f114f48a7df7649c3ee8978c41c3577c3dd0c8')
    expect(events[0].bundleFees.toString()).toBe('8000000000000')
    expect(events[0].toChainId).toBe(5)
    expect(events[0].commitTime).toBe(1670287396)
    expect(events[0].context).toBeTruthy()
    expect(events[0].context?.transactionHash).toBe('0xed78039ec57b7f1bc882aa833c921d22f407363fc95834b670ae64f78f128fd4')
    expect(events[0].context?.from).toBeTruthy()
    expect(events[0].context?.to).toBeTruthy()
    expect(events[0].context?.value).toBeTruthy()
    expect(events[0].context?.nonce).toBeTruthy()
    expect(events[0].context?.gasLimit).toBeTruthy()
    expect(events[0].context?.gasUsed).toBeTruthy()
    expect(events[0].context?.gasPrice).toBeTruthy()
    expect(events[0].context?.data).toBeTruthy()
    expect(events[0].eventLog).toBeTruthy()
  }, 60 * 1000)
  it('getBundleForwardedEvents', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v001
    })
    const chain = 'ethereum'
    const chainId = 5
    const toBlock = 3218900
    const fromBlock = toBlock - 100
    const events = await hop.getBundleForwardedEvents({ chainId, fromBlock, toBlock })
    console.log(events)
    expect(events.length).toBe(0)
  }, 60 * 1000)
  it('getBundleReceivedEvents', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v001
    })
    const chain = 'ethereum'
    const chainId = 5
    const toBlock = 3218900
    const fromBlock = toBlock - 100
    const events = await hop.getBundleReceivedEvents({ chainId, fromBlock, toBlock })
    console.log(events)
    expect(events.length).toBe(0)
  }, 60 * 1000)
  it('getBundleSetEvents', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v001
    })
    const chain = 'ethereum'
    const chainId = 5
    const toBlock = 3218900
    const fromBlock = toBlock - 100
    const events = await hop.getBundleSetEvents({ chainId, fromBlock, toBlock })
    console.log(events)
    expect(events.length).toBe(0)
  }, 60 * 1000)
  it('getFeesSentToHubEvents', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v001
    })
    const chainId = 420
    const toBlock = 3218900
    const fromBlock = toBlock - 100
    const events = await hop.getFeesSentToHubEvents({ chainId, fromBlock, toBlock })
    console.log(events)
    expect(events.length).toBe(1)
    expect(events[0].amount.toString()).toBe('8000000000000')
  }, 60 * 1000)
  it('getMessageBundledEvents', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v001
    })
    const chainId = 420
    const toBlock = 3216770
    const fromBlock = toBlock - 100
    const events = await hop.getMessageBundledEvents({ chainId, fromBlock, toBlock })
    console.log(events)
    expect(events.length).toBe(1)
    expect(events[0].bundleId).toBe('0x941b97adc8856fc13c566e5b9aaa9cd5fd953324452f0aa1fe24ca227a5e2ab6')
    expect(events[0].treeIndex).toBe(0)
    expect(events[0].messageId).toBe('0x1dcab020e2c5973e3461028e6d6cce6e8785c18c8d47257836800170d37b9e3e')
    expect(events[0].eventLog).toBeTruthy()
  }, 60 * 1000)
  it.skip('getMessageExecutedEvents', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v003
    })
    const chainId = 420
    const toBlock = 8826985
    const fromBlock = toBlock - 100
    const events = await hop.getMessageExecutedEvents({ chainId, fromBlock, toBlock })
    console.log(events)
    expect(events.length).toBe(0)
    expect(events[0].messageId).toBe('0x5ceb2a1d141067d39a03fb4707b24b84a5f2862b291ff3d4f9e3ef28470071ad')
    expect(events[0].fromChainId).toBe(420)
  }, 60 * 1000)
  it('getMessageSentEvents', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v001
    })
    const chainId = 420
    const toBlock = 3216770
    const fromBlock = toBlock - 100
    const events = await hop.getMessageSentEvents({ chainId, fromBlock, toBlock })
    console.log(events)
    expect(events.length).toBe(1)
    expect(events[0].messageId).toBe('0x1dcab020e2c5973e3461028e6d6cce6e8785c18c8d47257836800170d37b9e3e')
    expect(events[0].from).toBe('0x75f222420C75Da8a59091a23368f97De43F54D9b')
    expect(events[0].toChainId).toBe(5)
    expect(events[0].data).toBe('0x')
    expect(events[0].eventLog).toBeTruthy()
  }, 60 * 1000)
  it('getEventNames', async () => {
    const hop = new Hop('goerli')
    expect(hop.getEventNames()).toStrictEqual([
      'BundleCommitted',
      'BundleForwarded',
      'BundleReceived',
      'BundleSet',
      'FeesSentToHub',
      'MessageBundled',
      'MessageExecuted',
      'MessageSent'
    ])
  }, 60 * 1000)
  it('getEstimatedTxCostForForwardMessage', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v001
    })
    // const toBlock = 3218900
    // const fromBlock = toBlock - 100
    // const chainId = 420
    const toChainId = 5
    // const [bundleCommittedEvent] = await hop.getBundleCommittedEvents({ chainId, fromBlock, toBlock })
    const estimatedTxCost = await hop.getEstimatedTxCostForForwardMessage({ chainId: toChainId })
    console.log(estimatedTxCost)
    expect(estimatedTxCost).toBeGreaterThan(0)
  }, 60 * 1000)
  it('getRelayReward', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v001
    })
    const toBlock = 3218900
    const fromBlock = toBlock - 100
    const fromChainId = 420
    const [bundleCommittedEvent] = await hop.getBundleCommittedEvents({ chainId: fromChainId, fromBlock, toBlock })
    expect(bundleCommittedEvent).toBeTruthy()
    const amount = await hop.getRelayReward({ fromChainId, bundleCommittedEvent })
    console.log(amount)
    expect(typeof amount).toBe('number')
  }, 60 * 1000)
  it('shouldAttemptForwardMessage', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v001
    })
    const toBlock = 3218900
    const fromBlock = toBlock - 100
    const fromChainId = 420
    const [bundleCommittedEvent] = await hop.getBundleCommittedEvents({ chainId: fromChainId, fromBlock, toBlock })
    const shouldAttempt = await hop.shouldAttemptForwardMessage({ fromChainId, bundleCommittedEvent })
    console.log(shouldAttempt)
    expect(shouldAttempt).toBe(false)
  }, 60 * 1000)
  it.skip('getBundleExitPopulatedTx', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v001
    })
    const fromChainId = 420
    const toChainId = 5
    const toBlock = 3218900
    const fromBlock = toBlock - 100
    const [bundleCommittedEvent] = await hop.getBundleCommittedEvents({ chainId: fromChainId, fromBlock, toBlock })
    const txData = await hop.getBundleExitPopulatedTx({ fromChainId, bundleCommittedEvent })
    console.log(txData)
    expect(txData.data).toBeTruthy()
    expect(txData.to).toBeTruthy()
    const shouldSend = false
    if (shouldSend) {
      const signer = new Wallet(privateKey)
      const provider = hop.getRpcProvider(toChainId)
      const tx = await signer.connect(provider).sendTransaction({
        to: txData.to,
        data: txData.data,
        value: '0'
      })
      expect(tx.hash).toBeTruthy()
    }
  }, 60 * 1000)
  it('getRouteData', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v001
    })
    const fromChainId = 420
    const toChainId = 5
    const routeData = await hop.getRouteData({ fromChainId, toChainId })
    console.log(routeData)
    expect(routeData.messageFee).toBeTruthy()
    expect(routeData.maxBundleMessages).toBeTruthy()
  }, 60 * 1000)
  it('getMessageFee', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v001
    })
    const fromChainId = 420
    const toChainId = 5
    const messageFee = await hop.getMessageFee({ fromChainId, toChainId })
    console.log(messageFee)
    expect(messageFee.gt(0)).toBe(true)
  }, 60 * 1000)
  it('getMaxBundleMessageCount', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v001
    })
    const fromChainId = 420
    const toChainId = 5
    const maxBundleMessageCount = await hop.getMaxBundleMessageCount({ fromChainId, toChainId })
    console.log(maxBundleMessageCount)
    expect(maxBundleMessageCount).toBe(8)
  }, 60 * 1000)
  it('getContractAddresses', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v001
    })
    const addresses = hop.getContractAddresses()
    expect(addresses['5'].hubCoreMessenger).toBe('0x9827315F7D2B1AAd0aa4705c06dafEE6cAEBF920')
  }, 60 * 1000)
  it('isBundleSet - false', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    const bundleId = '0x5e26c4282d410e7e0c892561566ce0a6522f4762de1fc59d9bfba068890d9123'
    const fromChainId = 420
    const toChainId = 5
    const isSet = await hop.getIsBundleSet({ fromChainId, toChainId, bundleId })
    expect(isSet).toBe(false)
  }, 60 * 1000)
  it('isBundleSet - true', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    const bundleId = '0x5e26c4282d410e7e0c892561566ce0a6522f4762de1fc59d9bfba068890d9f75'
    const fromChainId = 420
    const toChainId = 5
    const isSet = await hop.getIsBundleSet({ fromChainId, toChainId, bundleId })
    expect(isSet).toBe(true)
  }, 60 * 1000)
  it('getMessageSentEventFromTransactionHash', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    const transactionHash = '0x3992b59210847c9c6d180f05c96a8dcf94809c8f58f597ef0801942ddeecdf51'
    const fromChainId = 420
    const event = await hop.getMessageSentEventFromTransactionHash({ fromChainId, transactionHash })
    console.log(event)
    expect(event).toBeTruthy()
  }, 60 * 1000)
  it('getMessageBundledEventFromTransactionHash', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    const transactionHash = '0x3992b59210847c9c6d180f05c96a8dcf94809c8f58f597ef0801942ddeecdf51'
    const fromChainId = 420
    const event = await hop.getMessageBundledEventFromTransactionHash({ fromChainId, transactionHash })
    console.log(event)
    expect(event).toBeTruthy()
  }, 60 * 1000)
  it('getMessageBundleIdFromTransactionHash', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    const transactionHash = '0x3992b59210847c9c6d180f05c96a8dcf94809c8f58f597ef0801942ddeecdf51'
    const fromChainId = 420
    const bundleId = await hop.getMessageBundleIdFromTransactionHash({ fromChainId, transactionHash })
    console.log(bundleId)
    expect(bundleId).toBe('0x5e26c4282d410e7e0c892561566ce0a6522f4762de1fc59d9bfba068890d9f7a')
  }, 60 * 1000)
  it('getMessageTreeIndexFromTransactionHash', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    const transactionHash = '0x3992b59210847c9c6d180f05c96a8dcf94809c8f58f597ef0801942ddeecdf51'
    const fromChainId = 420
    const treeIndex = await hop.getMessageTreeIndexFromTransactionHash({ fromChainId, transactionHash })
    console.log(treeIndex)
    expect(treeIndex).toBe(7)
  }, 60 * 1000)
  it('getMessageIdFromTransactionHash', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    const transactionHash = '0x3992b59210847c9c6d180f05c96a8dcf94809c8f58f597ef0801942ddeecdf51'
    const fromChainId = 420
    const messageId = await hop.getMessageIdFromTransactionHash({ fromChainId, transactionHash })
    console.log(messageId)
    expect(messageId).toBe('0xf0d21b61d0b49b40caf94be6bef72760e5a7b154d59f7ce7b06036718f55fecf')
  }, 60 * 1000)
  it('getMessageBundledEventsForBundleId', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    const fromChainId = 420
    const bundleId = '0x5e26c4282d410e7e0c892561566ce0a6522f4762de1fc59d9bfba068890d9f7a'
    const events = await hop.getMessageBundledEventsForBundleId({ fromChainId, bundleId })
    console.log(events)
    expect(events.length).toBe(8)
  }, 5 * 60 * 1000)
  it('getMessageIdsForBundleId', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    const fromChainId = 420
    const bundleId = '0x5e26c4282d410e7e0c892561566ce0a6522f4762de1fc59d9bfba068890d9f7a'
    const messageIds = await hop.getMessageIdsForBundleId({ fromChainId, bundleId })
    console.log(messageIds)
    expect(messageIds.length).toBe(8)
  }, 5 * 60 * 1000)
  it('getMerkleProofForMessageId', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    const messageIds = [
      '0x949e97cfdf880e647b5d52cf43efac927ef93a6db53fa5594f8c66b03055929e',
      '0xe66de037c45650911138e7337a4246c45c662e2b9dd3c12ff2a5d054a62534bc',
      '0x68fa511b02dcda258728d758f34b274841c0462fb26cb55af3096f6be2c5f3e2',
      '0xf067644936a2986c6527109e187e6686b0ce6ec998da45ad169e3a646570dfd7',
      '0xb8219286d809fb60e8f14551543b468af59001c9ec7a766d16a0ab39cfe7d5ee',
      '0x29744fe90f14f9ffad620b97a353661c6709fc7212d793df7435c218677b46b4',
      '0x03a110400ca2f3b59f856b6d839f3be1bcfc06f9b0ff3177f9fd8fb3138df3cd',
      '0xf0d21b61d0b49b40caf94be6bef72760e5a7b154d59f7ce7b06036718f55fecf'
    ]
    const targetMessageId = '0xf0d21b61d0b49b40caf94be6bef72760e5a7b154d59f7ce7b06036718f55fecf'
    const proof = hop.getMerkleProofForMessageId({ messageIds, targetMessageId })
    console.log(proof)
    expect(proof.length).toBe(3)
  }, 5 * 60 * 1000)
  it('getBundleProofFromTransactionHash', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    const transactionHash = '0x3992b59210847c9c6d180f05c96a8dcf94809c8f58f597ef0801942ddeecdf51'
    const fromChainId = 420
    const bundleProof = await hop.getBundleProofFromTransactionHash({ fromChainId, transactionHash })
    console.log(bundleProof)
    expect(bundleProof).toBeTruthy()
  }, 5 * 60 * 1000)
  it('getBundleProofFromMessageId', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    const messageId = '0xf0d21b61d0b49b40caf94be6bef72760e5a7b154d59f7ce7b06036718f55fecf'
    const fromChainId = 420
    const bundleProof = await hop.getBundleProofFromMessageId({ fromChainId, messageId })
    console.log(bundleProof)
    expect(bundleProof).toBeTruthy()
  }, 5 * 60 * 1000)
  it.skip('getRelayMessagePopulatedTx', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    // const transactionHash = '0x3992b59210847c9c6d180f05c96a8dcf94809c8f58f597ef0801942ddeecdf51'
    const fromChainId = 420
    const toChainId = 5

    const fromAddress = '0x75f222420c75da8a59091a23368f97de43f54d9b'
    const toAddress = '0x0000000000000000000000000000000000000000'
    const toCalldata = '0x'

    const bundleProof = {
      bundleId: '0x5e26c4282d410e7e0c892561566ce0a6522f4762de1fc59d9bfba068890d9f7a',
      treeIndex: 7,
      siblings: [
        '0x03a110400ca2f3b59f856b6d839f3be1bcfc06f9b0ff3177f9fd8fb3138df3cd',
        '0x0ac703d67cf8f7a0fe1df5a2ed9ee5320eb5084e624b0b2d36ebad8e0cfc48fe',
        '0xdee34a02f502e70448801278444d804d419198bba994225d451bacf192a0ac74'
      ],
      totalLeaves: 8
    }
    const txData = await hop.getRelayMessagePopulatedTx({ fromChainId, toChainId, fromAddress, toAddress, toCalldata, bundleProof })
    console.log(txData)
    expect(txData).toBeTruthy()
    const shouldSend = false
    if (shouldSend) {
      const signer = new Wallet(privateKey)
      const provider = hop.getRpcProvider(toChainId)
      const tx = await signer.connect(provider).sendTransaction({
        to: txData.to,
        data: txData.data
      })
      console.log(tx)
      expect(tx.hash).toBeTruthy()
    }
  }, 5 * 60 * 1000)
  it('setRpcProviders', async () => {
    const hop = new Hop('goerli')
    expect(hop.getRpcProvider(5).connection.url).toBe('https://goerli.infura.io/v3/84842078b09946638c03157f83405213')
    const rpcProviders = {
      5: new providers.StaticJsonRpcProvider('https://rpc.ankr.com/eth_goerli')
    }
    hop.setRpcProviders(rpcProviders)
    expect(hop.getRpcProvider(5).connection.url).toBe('https://rpc.ankr.com/eth_goerli')
  }, 60 * 1000)
  it('getMessageCalldata', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    const fromChainId = 5
    const messageId = '0x1d1e0dacfa77b6efe93040cf26d2054b03f1d594383a936498e29c26b7ff0130'
    const calldata = await hop.getMessageCalldata({ fromChainId, messageId })
    console.log(calldata)
    expect(calldata.length > 10).toBe(true)
  }, 60 * 1000)
  it.skip('getIsMessageIdRelayed - true', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    const fromChainId = 5
    const toChainId = 420
    const messageId = '0x1d1e0dacfa77b6efe93040cf26d2054b03f1d594383a936498e29c26b7ff0130'
    const isRelayed = await hop.getIsMessageIdRelayed({ fromChainId, toChainId, messageId })
    console.log(isRelayed)
    expect(isRelayed).toBe(true)
  }, 60 * 1000)
  it.skip('getIsMessageIdRelayed - false', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v002
    })
    const fromChainId = 5
    const toChainId = 420
    const messageId = '0xe8e4885871d370ef17693db9fc0f34bda218c8685a9bb3ab40648cf8d2a5358e'
    const isRelayed = await hop.getIsMessageIdRelayed({ fromChainId, toChainId, messageId })
    console.log(isRelayed)
    expect(isRelayed).toBe(false)
  }, 60 * 1000)
  it.skip('getRelayFee', async () => {
    const hop = new Hop('goerli', {
      contractAddresses: contractAddresses_v003
    })
    const fromChainId = 420
    const toChainId = 5
    const toAddress = '0x0000000000000000000000000000000000000000'
    const toCalldata = '0x'
    const relayFee = await hop.getRelayFee({ fromChainId, toChainId, toAddress, toCalldata })
    console.log(relayFee)
    expect(relayFee).toBeDefined()
  }, 60 * 1000)
})
