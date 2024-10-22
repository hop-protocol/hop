import { Hop, HopStruct, TransferState } from '#index.js'
import { providers, Wallet, utils, BigNumber } from 'ethers'
import dotenv from 'dotenv'
import { getComputedTransferDataHash, getComputedTransferId, getInitialId } from '#utils/index.js'

dotenv.config()

const { parseUnits } = utils

export const privateKey = process.env.PRIVATE_KEY ?? ''
export const bonderPrivateKey = process.env.BONDER_PRIVATE_KEY ?? ''

describe('Sdk - Hop - e2e', () => {
  it('should do a send', async () => {
    const ethereumRpcUrl = process.env.ETHEREUM_RPC_PROVIDER ?? 'https://rpc2.sepolia.org'
    const ethereumProvider = new providers.StaticJsonRpcProvider(ethereumRpcUrl)

    const baseRpcUrl = process.env.BASE_RPC_PROVIDER ?? 'https://sepolia.base.org'
    const baseProvider = new providers.StaticJsonRpcProvider(baseRpcUrl)

    // ----------------
    const fromChainId = '11155111'
    const fromToken = '0x90C1d7021D027c5665413074f34a8bACb3a57688'
    const toChainId = '84532'
    const toToken = '0x90C1d7021D027c5665413074f34a8bACb3a57688'
    const sendAmount = parseUnits('0.1', 18)
    // ----------------

    const signer = new Wallet(privateKey)
    const sdk = new Hop({
      signersOrProviders: {
        [fromChainId]: signer.connect(ethereumProvider),
        [toChainId]: signer.connect(baseProvider),
      },
    })

    const to = await signer.getAddress()

    const needsApproval = await sdk.getNeedsApprovalForSendTokens({
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      amount: sendAmount,
      account: to
    })

    console.log('needsApproval:', needsApproval)

    if (needsApproval) {
      const approveTx = await sdk.approveSendTokens({
        fromChainId,
        toChainId,
        fromToken,
        toToken,
        amount: sendAmount
      })

      console.log('approval tx:', approveTx.hash)
      await approveTx.wait()
    }

    const minAmountOut = sdk.calcAmountOutMin( { amountOut: sendAmount, slippageTolerance: 0.01 } )

    console.log('minAmountOut:', minAmountOut.toString())

    const willFail = await sdk.getWillSendTokensFail({
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      to,
      amount: sendAmount,
      minAmountOut,
      from: to
    })

    console.log('willFail:', willFail)

    const shouldSend = true // debug
    let sendTxHash = '0xcc78bc7d6a137d7aaaa4a47947ad82dc7b95b191e6a5852300371c9e00b9aa8a' // debug
    // let sendTxHash = '' // debug
    if (shouldSend) {
      const sendTx = await sdk.sendTokens({
        fromChainId,
        toChainId,
        fromToken,
        toToken,
        amount: sendAmount,
        minAmountOut,
        to,
      })

      sendTxHash = sendTx.hash
      console.log('send tx:', sendTx.hash)
      await sendTx.wait()
    }

    const transferId = await sdk.getTransferIdFromTransactionHash({
      chainId: fromChainId,
      transactionHash: sendTxHash
    })

    console.log('transferId:', transferId)

    const transferStatus = await sdk.getTransferStatus({
      fromChainId,
      toChainId,
      transferId
    })

    console.log('transferStatus:', transferStatus)
    expect(transferStatus.state).toBe(TransferState.PendingBond)
    expect(true).toBeDefined()
  }, 10 * 60 * 1000)
})

describe.only('Sdk - RailsGateway - e2e - one hop', () => {
  it('should do an end to end test', async () => {
    const ethereumRpcUrl = process.env.ETHEREUM_RPC_PROVIDER ?? 'https://rpc2.sepolia.org'
    const ethereumProvider = new providers.StaticJsonRpcProvider(ethereumRpcUrl)

    const baseRpcUrl = process.env.BASE_RPC_PROVIDER ?? 'https://sepolia.base.org'
    const baseProvider = new providers.StaticJsonRpcProvider(baseRpcUrl)

    // ----------------
    const fromChainId = '11155111'
    const fromToken = '0xbc357f673879a3145172A95546948DBaFd9Fe1cE'
    const toChainId = '84532'
    const toToken = '0xbc357f673879a3145172A95546948DBaFd9Fe1cE'
    const sendAmount = parseUnits('0.1', 18)
    // ----------------

    const chainProviders: any = {
      '11155111': ethereumProvider,
      '84532': baseProvider
    }

    const senderSigner = new Wallet(privateKey)
    const bonderSigner = new Wallet(bonderPrivateKey)
    const sdk = new Hop({
      signersOrProviders: {
        [fromChainId]: senderSigner.connect(chainProviders[fromChainId]),
        [toChainId]: bonderSigner.connect(chainProviders[toChainId])
      },
    })

    const pathId = await sdk.getRailsGateway(fromChainId).getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: toChainId,
      token1: toToken
    })

    console.log('pathId:', pathId)

    const isLive = await sdk.getRailsGateway(fromChainId).helpers.getIsPathIdLive({
      pathId
    })

    console.log('isPathIdLive:', isLive)

    const needsApproval = await sdk.getRailsGateway(fromChainId).helpers.getNeedsApprovalForSend({
      pathId,
      amount: sendAmount
    })

    console.log('needsSendApproval:', needsApproval)

    if (needsApproval) {
      const approveTx = await sdk.getRailsGateway(fromChainId).helpers.approveSend({
        pathId,
        amount: sendAmount
      })

      console.log('send approval tx:', approveTx.hash)
      await approveTx.wait()
    }

    const attestedClaimId  = await sdk.getRailsGateway(toChainId).getHeadClaim({
      pathId
    })

    const isClaimIdValid = await sdk.getRailsGateway(toChainId).getIsClaimIdValid({
      pathId,
      claimId: attestedClaimId
    })

    console.log('isClaimIdValid:', isClaimIdValid)

    const maxTotalSent = await sdk.getRailsGateway(fromChainId).getTotalSent({ pathId })
    const fee = await sdk.getRailsGateway(fromChainId).getFee({ pathId })
    const to = await senderSigner.getAddress()
    const maxBonderFee = BigNumber.from(0) // TODO
    const blankAttestedClaimId = sdk.utils.generateZeroBytes32()

    const hops: HopStruct[] = [{
      pathId,
      attestedClaimId: blankAttestedClaimId,
      maxTotalSent,
      maxBonderFee
    }]

    let sendTxHash = ''
    const shouldSend = !sendTxHash // debug
    let sendTx: any
    if (shouldSend) {
      sendTx = await sdk.getRailsGateway(fromChainId).send({
        pathId,
        amount: sendAmount,
        to,
        hops,
        fee
      })

      console.log('send tx:', sendTx.hash)
      await sendTx.wait()
    }

    sendTxHash = sendTxHash || sendTx.hash

    const transferSentEvent = (await sdk.getRailsGateway(fromChainId).getTransferSentEventFromTransactionHash({
      transactionHash: sendTxHash,
    }))!

    console.log('TransferSent event:', transferSentEvent)

    const nextHopsHash = await sdk.getRailsGateway(fromChainId).getNextHopsHash({ nextHops: transferSentEvent.decoded.hops.slice(1) })

    console.log('nextHopsHash:', nextHopsHash)

    const transferDataHash = await sdk.getRailsGateway(fromChainId).getTransferDataHash({
      to: transferSentEvent.decoded.to,
      amountOut: transferSentEvent.decoded.amountOut,
      totalSent: transferSentEvent.decoded.totalSent,
      totalClaims: transferSentEvent.decoded.totalClaims,
      hops: transferSentEvent.decoded.hops,
    })

    console.log('transferDataHash:', transferDataHash)

    // const events = await sdk.getRailsGateway(fromChainId).getTransferSentEventsFromPathId({
    //   pathId
    // })

    // console.log('events', events)

    const shouldBatchUpdateClaimChain = false // debug
    if (shouldBatchUpdateClaimChain) {
      const pathId = ''
      const finalTransferId = ''

      console.log('calling batchUpdateClaimChain')

      const events = await sdk.getRailsGateway(fromChainId).getTransferSentEventsFromPathId({
        pathId
      })

      console.log(events)

      const transferDataHashes: any[] = events.map((event: any) => {
        return getComputedTransferDataHash(event.decoded)
      })

      console.log('transferDataHashes:', transferDataHashes)
      console.log('calling batchUpdateClaimChain')

      const tx = await sdk.getRailsGateway(toChainId).batchUpdateClaimChain({
        pathId,
        transferDataHashes,
        finalTransferId
      })

      console.log('batchUpdateClaimChain tx:', tx.hash)

      await tx.wait()
      console.log('done batchUpdateClaimChain')
    }

    const headTransferId = await sdk.getRailsGateway(toChainId).getHeadClaim({ pathId: transferSentEvent.decoded.pathId })
    console.log('headTransferId:', headTransferId)

    const couterchainHeadTransferId = await sdk.getRailsGateway(fromChainId).getHeadClaim({ pathId: transferSentEvent.decoded.pathId })
    console.log('counterchain headTransferId:', couterchainHeadTransferId)

    const shouldUpdateClaimChain = true // debug // TODO: dynamically check
    if (shouldUpdateClaimChain) {
      console.log('calling updateClaimChain')
      const updateClaimChainTx = await sdk.getRailsGateway(toChainId).updateClaimChain({
        pathId: transferSentEvent.decoded.pathId,
        transferDataHash,
        headTransferId: transferSentEvent.decoded.transferId,
      })

      console.log('updateClaimChainTx tx:', updateClaimChainTx.hash)
      await updateClaimChainTx.wait()
    }

    // sendTx: https://sepolia.etherscan.io/tx/0x8dcae807be9a311b0e5e68031001a8850cbb09efe645e34fd1c4f9ecd90ff6ff
    // pathId: '0xaf4f7dee81d15b33fe771710126eeb71f4dd28974d85367b74fc47f6dc784d4b',
    // updateClaimChainTx tx: 0x33df704cb74d0d6b713fa73fc0f833b69857ce0a536b66dbec7664b456268099
    // transferDataHash: 0x9916602b9120695fa4b266c858e2fd42391beb06fb73fdc810801b84f510614c
    // headTransferId: 0x71d3f98ff178251440c6fd21577db1c7d0dd500a5bb7e6e9b8483399c735aea4
    // transferId: '0x71d3f98ff178251440c6fd21577db1c7d0dd500a5bb7e6e9b8483399c735aea4',
    // counterchain headTransferId: 0xc58013006d0b70a83f72aa3c16fa3e4d1546b5ca8aaa2fcaeaaf7ee9c328e793
    // initialId 0x62b24abe737d2acec4664e17f12f71561a67c5d34b8e6e8116eb724333886b8f
    // initialId 0xe458de01a02e5981c3b004de2d96b5ffbddb596fc4ec201203514c9f685a60d7
    // wrong nextHopsHash: 0xd1912390df450908e5cb53da486fdcfb3c56cd3f0c2e38f4657634e99b8b87f0
    // correct nextHopsHash: 0x0000000000000000000000000000000000000000000000000000000000000000
    // postClaim tx: 0x834af03dedf511cfaae9a723562758aeb3073b41e777a0239122002070f572a2
    // bond tx: 0x24610103e13feebcfb10ed5fbf91e06e6a96caeff4a7b5973962250a6fb286f7
    // confirm tx: 0x2f5c6a6576c2318560feee812e29503669fc715552dc85649f48961aab373755
    // execute tx: 0xe93305bbdd3d32b672a7179b762c1686dc41f90d5ebf23ef1a756a411145ce6a

    // const initialId = getInitialId(fromChainId, transferSentEvent.decoded.pathId)
    // console.log('initialId', initialId) // 0x62b24abe737d2acec4664e17f12f71561a67c5d34b8e6e8116eb724333886b8f

    // const transferId1 = getComputedTransferId(initialId, '0x9916602b9120695fa4b266c858e2fd42391beb06fb73fdc810801b84f510614c')
    // console.log('transferId1', transferId1)
    //transferId1 0x5aed2d258752e08f0d6ce44de1feaa80fcc85c2bf2de08860faf2af7ed98ecf5

    const shouldPostClaim = true // debug
    if (shouldPostClaim) {
      console.log('calling postClaim')
      const postClaimTx = await sdk.getRailsGateway(toChainId).postClaim({
        pathId: transferSentEvent.decoded.pathId,
        transferId: transferSentEvent.decoded.transferId,
        to: transferSentEvent.decoded.to,
        amountOut: transferSentEvent.decoded.amountOut,
        maxBonderFee: transferSentEvent.decoded.hops[0].maxBonderFee,
        totalSent: transferSentEvent.decoded.totalSent,
        totalClaims: transferSentEvent.decoded.totalClaims,
        attestedClaimId: transferSentEvent.decoded.hops[0].attestedClaimId,
        nextHopsHash
      })

      console.log('postClaim tx:', postClaimTx.hash)
      await postClaimTx.wait()
    }

    const needsBondApproval = await sdk.getRailsGateway(toChainId).helpers.getNeedsApprovalForBond({
      pathId: transferSentEvent.decoded.pathId,
      amount: transferSentEvent.decoded.amountOut
    })

    console.log('needsBondApproval:', needsBondApproval)

    if (needsBondApproval) {
      const approveTx = await sdk.getRailsGateway(toChainId).helpers.approveBond({
        pathId: transferSentEvent.decoded.pathId,
        amount: transferSentEvent.decoded.amountOut
      })

      console.log('approval tx:', approveTx.hash)
      await approveTx.wait()
    }

    const isBonded = await sdk.getRailsGateway(toChainId).helpers.getIsTransferBonded({
      transferId: transferSentEvent.decoded.transferId,
    })

    console.log('isBonded:', isBonded)

    const shouldBond = true // debug
    let bondTx: any
    if (shouldBond) {
      console.log('calling bond')
      bondTx = await sdk.getRailsGateway(toChainId).bond({
        pathId: transferSentEvent.decoded.pathId,
        claimId: transferSentEvent.decoded.transferId,
        nextHops: transferSentEvent.decoded.hops.slice(1),
        bonderFee: transferSentEvent.decoded.hops[0].maxBonderFee
      })

      console.log('bond tx:', bondTx.hash)
      await bondTx.wait()
    }

    const isClaimed = await sdk.getRailsGateway(toChainId).helpers.getIsTransferClaimed({
      transferId: transferSentEvent.decoded.transferId,
    })

    console.log('isClaimed:', isClaimed)

    // let bondTxHash = '0x24610103e13feebcfb10ed5fbf91e06e6a96caeff4a7b5973962250a6fb286f7' // bondTx.hash
    let bondTxHash = bondTx.hash
    const lastBond = await sdk.getRailsGateway(toChainId).getTransferBondedEventFromTransactionHash({
      transactionHash: bondTxHash
    })

    const bucketIndex = await sdk.getRailsGateway(toChainId).getBucketIndex({ pathId, claimId: lastBond!.decoded.claimId })

    console.log('bucketIndex:', bucketIndex)

    const messageId = await sdk.messenger.getMessageIdFromTransactionHash({
      chainId: fromChainId,
      transactionHash: sendTxHash
    })

    const messageSentEvent = (await sdk.messenger.getMessageSentEventFromMessageId({
      chainId: fromChainId,
      messageId
    }))!

    console.log('MessageSent event:', messageSentEvent)

    const shouldExecute = true // debug
    if (shouldExecute) {
      console.log('calling execute')
      const executeTx = await sdk.messenger.execute({
        messageId,
        fromChainId,
        toChainId: messageSentEvent.decoded.toChainId,
        fromAddress: messageSentEvent.decoded.from,
        toAddress: messageSentEvent.decoded.to,
        toCalldata: messageSentEvent.decoded.data
      })

      console.log('execute tx:', executeTx.hash)
      await executeTx.wait()
    }

    const shouldConfirm = true // debug
    if (shouldConfirm) {
      console.log('calling confirmClaim')
      const confirmTx = await sdk.getRailsGateway(toChainId).confirmClaim({
        pathId: transferSentEvent.decoded.pathId,
        // transferId: transferSentEvent.decoded.transferId
        transferId: lastBond!.decoded.claimId
      })

      console.log('confirm tx:', confirmTx.hash)
      await confirmTx.wait()
    }

    const shouldWithdraw = true // debug
    if (shouldWithdraw) {
      console.log('calling withdraw')
      const withdrawTx = await sdk.getRailsGateway(toChainId).withdrawAll({
        pathId: transferSentEvent.decoded.pathId,
        bucketIndex
      })

      console.log('withdraw tx:', withdrawTx.hash)
      await withdrawTx.wait()
    }

    console.log('done')

    expect(true).toBeDefined()
  }, 10 * 60 * 1000)
})

// TODO
describe.skip('Sdk - RailsGateway - e2e - multi hop', () => {
  it('should do an end to end test', async () => {
    const ethereumRpcUrl = process.env.ETHEREUM_RPC_PROVIDER ?? 'https://rpc2.sepolia.org'
    const ethereumProvider = new providers.StaticJsonRpcProvider(ethereumRpcUrl)

    const baseRpcUrl = process.env.BASE_RPC_PROVIDER ?? 'https://sepolia.base.org'
    const baseProvider = new providers.StaticJsonRpcProvider(baseRpcUrl)

    const optimismRpcUrl = process.env.OPTIMISM_RPC_PROVIDER ?? 'https://sepolia.optimism.io'
    const optimismProvider = new providers.StaticJsonRpcProvider(optimismRpcUrl)

    const hubRpcUrl = process.env.HUB_RPC_PROVIDER ?? 'http://hub-testnet.rpc.hop.exchange'
    const hubProvider = new providers.StaticJsonRpcProvider(hubRpcUrl)

    // ----------------
    const fromChainId = '11155420'
    const fromToken = '0x90C1d7021D027c5665413074f34a8bACb3a57688'
    const toChainId = '84532'
    const toToken = '0x90C1d7021D027c5665413074f34a8bACb3a57688'
    const sendAmount = parseUnits('0.1', 18)
    // ----------------

    const fromProvider = optimismProvider
    const toProvider = baseProvider
    const nextChainId = '11155111'
    const nextProvider = ethereumProvider
    const nextToken = '0x90C1d7021D027c5665413074f34a8bACb3a57688'

    const signer = new Wallet(privateKey)
    const sdk = new Hop({
      signersOrProviders: {
        [fromChainId]: signer.connect(fromProvider),
        [toChainId]: signer.connect(toProvider),
        [nextChainId]: signer.connect(nextProvider),
      },
    })

    const nextPathId = await sdk.getRailsGateway(fromChainId).getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: nextChainId,
      token1: nextToken
    })

    console.log('nextPathId:', nextPathId)

    const isLive = await sdk.getRailsGateway(fromChainId).helpers.getIsPathIdLive({
      pathId: nextPathId
    })

    console.log('isPathIdLive:', isLive)
    expect(isLive).toBe(true)

    const needsApproval = await sdk.getRailsGateway(fromChainId).helpers.getNeedsApprovalForSend({
      pathId: nextPathId,
      amount: sendAmount
    })

    console.log('needsSendApproval:', needsApproval)

    if (needsApproval) {
      const approveTx = await sdk.getRailsGateway(fromChainId).helpers.approveSend({
        pathId: nextPathId,
        amount: sendAmount
      })

      console.log('send approval tx:', approveTx.hash)
      await approveTx.wait()
    }

    const attestedClaimId  = await sdk.getRailsGateway(fromChainId).getHeadClaim({
      pathId: nextPathId
    })

    const isClaimIdValid = await sdk.getRailsGateway(nextChainId).getIsClaimIdValid({
      pathId: nextPathId,
      claimId: attestedClaimId
    })

    console.log('isClaimIdValid:', isClaimIdValid)

    // const maxTotalSent = await sdk.getRailsGateway(fromChainId).getTotalSent({ pathId })
    // const fee = await sdk.getRailsGateway(fromChainId).getFee({ pathId })
    const to = await signer.getAddress()
    // const nextHops: HopStruct[] = []

    // const blankAttestedClaimId = sdk.utils.generateZeroBytes32() // should be blank for first transfer

    const shouldSend = false // debug
    let sendTx: any
    if (shouldSend) {
      sendTx = await sdk.sendTokensMultiHop({
        fromChainId,
        toChainId,
        fromToken,
        toToken,
        amount: sendAmount,
        minAmountOut: 0,
        to,
      })

      console.log('send tx:', sendTx.hash)
      await sendTx.wait()
    }

    const sendTxHash = '0xf2d7cef4029f0d59742c2dbeabbd15446227848f0fba5b0608ce2d67bb25988d' // sendTx.hash

    const transferSentEvent = (await sdk.getRailsGateway(fromChainId).getTransferSentEventFromTransactionHash({
      transactionHash: sendTxHash,
    }))!

    console.log('TransferSent event:', transferSentEvent)

    const messageId = await sdk.messenger.getMessageIdFromTransactionHash({
      chainId: fromChainId,
      transactionHash: sendTxHash
    })

    const messageSentEvent = (await sdk.messenger.getMessageSentEventFromMessageId({
      chainId: fromChainId,
      messageId
    }))!

    console.log('MessageSent event:', messageSentEvent)

    const shouldExecute = false // debug
    if (shouldExecute) {
      console.log('calling execute')
      const executeTx = await sdk.messenger.execute({
        messageId,
        fromChainId,
        toChainId: messageSentEvent.decoded.toChainId,
        fromAddress: messageSentEvent.decoded.from,
        toAddress: messageSentEvent.decoded.to,
        toCalldata: messageSentEvent.decoded.data
      })

      console.log('execute tx:', executeTx.hash)
      await executeTx.wait()
    }

    const nextHopsHash = await sdk.getRailsGateway(fromChainId).getNextHopsHash({ nextHops: transferSentEvent.decoded.hops })
    console.log('nextHopsHash:', nextHopsHash)

    const transferDataHash = await sdk.getRailsGateway(fromChainId).getTransferDataHash({
      to: transferSentEvent.decoded.to,
      amountOut: transferSentEvent.decoded.amountOut,
      totalSent: transferSentEvent.decoded.totalSent,
      totalClaims: transferSentEvent.decoded.totalClaims,
      hops: transferSentEvent.decoded.hops,
    })
    console.log('transferDataHash:', transferDataHash)

    const initialIdFrom = getInitialId(fromChainId, transferSentEvent.decoded.pathId)
    console.log('initialIdFrom', initialIdFrom)

    const initialIdNext = getInitialId(nextChainId, transferSentEvent.decoded.pathId)
    console.log('initialIdNext', initialIdNext)
    const initialTransferId = initialIdFrom

    //const blankAttestedClaimId = sdk.utils.generateZeroBytes32()

    const headTransferId = await sdk.getRailsGateway(nextChainId).getHeadClaim({ pathId: transferSentEvent.decoded.pathId })
    console.log('pathId:', transferSentEvent.decoded.pathId)
    console.log('headTransferId:', headTransferId)

    const shouldBatchUpdateClaimChain = true // debug
    if (shouldBatchUpdateClaimChain) {
      console.log('calling batchUpdateClaimChain')
      const pathId = transferSentEvent.decoded.pathId

      const events = await sdk.getRailsGateway(fromChainId).getTransferSentEventsFromPathId({
        pathId
      })

      console.log(events)

      const transferDataHashes: any[] = events.map((event: any) => {
        console.log('event.transferId', event.decoded.transferId)
        return getComputedTransferDataHash(event.decoded)
      })

      //console.log('computed transferDataHash', getComputedTransferDataHash(transferSentEvent.decoded))

      // const transferDataHashes: string[] = [
      //   '0x86bfdffdf3a35b28ef32f73d6282c0d3bcdb4f5d4e9729fa83c4e3e0ec228c60', // 0xf1a2bf03320bbccb50a980d3efbb0f948ae755c6034b03a66d11c7c1be0bfb09
      //   '0xea9d2003a84200efb2800b14ae1ac187d777af0d8110a0c341f314253e8f7864' // 0x3b6dad2133daffc95aaabc97aed10f1f7fccbba6f4e52bb1132dd3ec6f3adf77
      // ]

      // const transferId1 = getComputedTransferId('0xf1a2bf03320bbccb50a980d3efbb0f948ae755c6034b03a66d11c7c1be0bfb09', '')
      // console.log('transferId1', transferId1) //

      // const transferId2 = getComputedTransferId('0x3b6dad2133daffc95aaabc97aed10f1f7fccbba6f4e52bb1132dd3ec6f3adf77', '0x86bfdffdf3a35b28ef32f73d6282c0d3bcdb4f5d4e9729fa83c4e3e0ec228c60')
      // console.log('transferId2', transferId2) //

      // head
      // 0xcb56ad8bf8b8e683f19b60229c31f190cfe8c5ecf66ef5ce5b36f5c2af218fd1

      console.log('transferDataHashes:', transferDataHashes)
      console.log('calling batchUpdateClaimChain')
      return

      const tx = await sdk.getRailsGateway(nextChainId).batchUpdateClaimChain({
        pathId,
        transferDataHashes,
        // finalTransferId: transferSentEvent.decoded.transferId
        finalTransferId: '' // .utils.generateZeroBytes32()
      })

      console.log('batchUpdateClaimChain tx:', tx.hash)

      await tx.wait()
      console.log('done batchUpdateClaimChain')
    }

    const shouldUpdateClaimChain = false // debug // TODO: dynamically check
    if (shouldUpdateClaimChain) {
      console.log('calling updateClaimChain')
      const updateClaimChainTx = await sdk.getRailsGateway(nextChainId).updateClaimChain({
        pathId: transferSentEvent.decoded.pathId,
        transferDataHash,
        headTransferId: '0xcce7295a4609153144e7fc5b8797034b9ef76fda6aee99c2d3bf05613c28f333' // transferSentEvent.decoded.transferId,
      })

      console.log('updateClaimChainTx tx:', updateClaimChainTx.hash)
      await updateClaimChainTx.wait()
    }

    const shouldPostClaim = true // debug
    if (shouldPostClaim) {
      console.log('calling postClaim')
      const postClaimTx = await sdk.getRailsGateway(nextChainId).postClaim({
        pathId: transferSentEvent.decoded.pathId,
        transferId: transferSentEvent.decoded.transferId,
        to: transferSentEvent.decoded.to,
        amountOut: transferSentEvent.decoded.amountOut,
        totalSent: transferSentEvent.decoded.totalSent,
        totalClaims: transferSentEvent.decoded.totalClaims,
        maxBonderFee: transferSentEvent.decoded.hops[0].maxBonderFee,
        attestedClaimId: transferSentEvent.decoded.hops[0].attestedClaimId,
        nextHopsHash
      })

      console.log('postClaim tx:', postClaimTx.hash)
      await postClaimTx.wait()
    }

    const needsBondApproval = await sdk.getRailsGateway(nextChainId).helpers.getNeedsApprovalForBond({
      pathId: transferSentEvent.decoded.pathId,
      amount: transferSentEvent.decoded.amountOut
    })

    console.log('needsBondApproval:', needsBondApproval)

    if (needsBondApproval) {
      const approveTx = await sdk.getRailsGateway(nextChainId).helpers.approveBond({
        pathId: transferSentEvent.decoded.pathId,
        amount: transferSentEvent.decoded.amountOut
      })

      console.log('approval tx:', approveTx.hash)
      await approveTx.wait()
    }

    const isBonded = await sdk.getRailsGateway(nextChainId).helpers.getIsTransferBonded({
      transferId: transferSentEvent.decoded.transferId,
    })

    console.log('isBonded:', isBonded)

    const shouldBond = true // debug
    let bondTx: any
    if (shouldBond) {
      console.log('calling bond')
      bondTx = await sdk.getRailsGateway(nextChainId).bond({
        pathId: transferSentEvent.decoded.pathId,
        claimId: transferSentEvent.decoded.transferId,
        bonderFee: transferSentEvent.decoded.hops[0].maxBonderFee,
        nextHops: transferSentEvent.decoded.hops
      })

      console.log('bond tx:', bondTx.hash)
      await bondTx.wait()
    }

    const isClaimed = await sdk.getRailsGateway(nextChainId).helpers.getIsTransferClaimed({
      transferId: transferSentEvent.decoded.transferId,
    })

    console.log('isClaimed:', isClaimed)

    const shouldConfirm = true // debug
    if (shouldConfirm) {
      console.log('calling confirmClaim')
      const confirmTx = await sdk.getRailsGateway(nextChainId).confirmClaim({
        pathId: transferSentEvent.decoded.pathId,
        transferId: transferSentEvent.decoded.transferId
      })

      console.log('confirm tx:', confirmTx.hash)
      await confirmTx.wait()
    }

    const bucketIndex = await sdk.getRailsGateway(nextChainId).getBucketIndex({ pathId: nextPathId, claimId: transferSentEvent.decoded.transferId })

    console.log('bucketIndex:', bucketIndex)

    const shouldWithdraw = true // debug
    if (shouldWithdraw) {
      const withdrawTx = await sdk.getRailsGateway(nextChainId).withdrawAll({
        pathId: transferSentEvent.decoded.pathId,
        bucketIndex
      })

      console.log('withdraw tx:', withdrawTx.hash)
      await withdrawTx.wait()
    }

    console.log('done')

    expect(true).toBeDefined()
  }, 10 * 60 * 1000)
})
