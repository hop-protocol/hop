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

describe.skip('Sdk - RailsGateway - e2e - one hop', () => {
  it('should do an end to end test', async () => {
    const ethereumRpcUrl = process.env.ETHEREUM_RPC_PROVIDER ?? 'https://rpc2.sepolia.org'
    const ethereumProvider = new providers.StaticJsonRpcProvider(ethereumRpcUrl)

    const baseRpcUrl = process.env.BASE_RPC_PROVIDER ?? 'https://sepolia.base.org'
    const baseProvider = new providers.StaticJsonRpcProvider(baseRpcUrl)

    const hubRpcUrl = process.env.HUB_RPC_PROVIDER ?? 'http://hub-testnet.rpc.hop.exchange'
    const hubProvider = new providers.StaticJsonRpcProvider(hubRpcUrl)

    // ----------------
    const fromChainId = '42069'
    const fromToken = '0xbc357f673879a3145172A95546948DBaFd9Fe1cE'
    const toChainId = '84532'
    const toToken = '0xbc357f673879a3145172A95546948DBaFd9Fe1cE'
    const sendAmount = parseUnits('0.1', 18)
    // ----------------

    const chainProviders: any = {
      '11155111': ethereumProvider,
      '84532': baseProvider,
      '42069': hubProvider
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

    const shouldUpdateClaimChain = true // debug
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
        transferId: transferSentEvent.decoded.transferId
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
describe.only('Sdk - RailsGateway - e2e - multi hop', () => {
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
    const fromToken = '0xbc357f673879a3145172A95546948DBaFd9Fe1cE'
    const toChainId = '84532'
    const toToken = '0xbc357f673879a3145172A95546948DBaFd9Fe1cE'
    const sendAmount = parseUnits('0.1', 18)
    // ----------------

    const chainProviders: any = {
      '11155111': ethereumProvider,
      '84532': baseProvider,
      '11155420': optimismProvider,
      '42069': hubProvider
    }

    const fromProvider = chainProviders[fromChainId]
    const toProvider = chainProviders[toChainId]
    const nextChainId = '42069'
    const nextProvider = chainProviders[nextChainId]
    const nextToken = '0xbc357f673879a3145172A95546948DBaFd9Fe1cE'

    const senderSigner = new Wallet(privateKey)
    const bonderSigner = new Wallet(bonderPrivateKey)

    const signer = new Wallet(privateKey)
    const sdk = new Hop({
      signersOrProviders: {
        [fromChainId]: senderSigner.connect(fromProvider),
        [nextChainId]: bonderSigner.connect(nextProvider),
        [toChainId]: bonderSigner.connect(toProvider)
      },
    })

    const nextPathId = await sdk.getRailsGateway(fromChainId).getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: nextChainId,
      token1: nextToken
    })

    console.log('nextPathId:', nextPathId)

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
    const to = await senderSigner.getAddress()
    // const nextHops: HopStruct[] = []

    // const blankAttestedClaimId = sdk.utils.generateZeroBytes32() // should be blank for first transfer

    const shouldUpdateClaimChain = true // debug
    const shouldPostClaim = true
    const shouldExecute = true // debug
    const shouldConfirm = true // debug
    const shouldWithdraw = true // debug
    const shouldUpdateClaimChain2 = true // debug
    const shouldPostClaim2 = true // debug
    const shouldExecute2 = true // debug
    const shouldConfirm2 = true // debug
    const shouldWithdraw2 = true // debug

    let sendTxHash = ''
    let bondTxHash = ''

    const shouldSend = !sendTxHash // debug
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

    sendTxHash = sendTxHash || sendTx.hash

    // ----------------------------------------------------------------------------

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

    const headTransferId = await sdk.getRailsGateway(nextChainId).getHeadClaim({ pathId: transferSentEvent.decoded.pathId })
    console.log('pathId:', transferSentEvent.decoded.pathId)
    console.log('headTransferId:', headTransferId)

    if (shouldUpdateClaimChain) {
      console.log('calling updateClaimChain')
      const updateClaimChainTx = await sdk.getRailsGateway(nextChainId).updateClaimChain({
        pathId: transferSentEvent.decoded.pathId,
        transferDataHash,
        headTransferId: transferSentEvent.decoded.transferId
      })

      console.log('updateClaimChainTx tx:', updateClaimChainTx.hash)
      await updateClaimChainTx.wait()
    }

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

    const shouldBond = !bondTxHash // debug
    let bondTx: any
    if (shouldBond) {
      console.log('calling bond')
      bondTx = await sdk.getRailsGateway(nextChainId).bond({
        pathId: transferSentEvent.decoded.pathId,
        claimId: transferSentEvent.decoded.transferId,
        nextHops: transferSentEvent.decoded.hops.slice(1),
        bonderFee: transferSentEvent.decoded.hops[0].maxBonderFee
      })

      console.log('bond tx:', bondTx.hash)
      await bondTx.wait()
    }

    bondTxHash = bondTxHash || bondTx.hash

    const lastBond1 = await sdk.getRailsGateway(nextChainId).getTransferBondedEventFromTransactionHash({
      transactionHash: bondTxHash
    })

    const messageId = await sdk.messenger.getMessageIdFromTransactionHash({
      chainId: fromChainId,
      transactionHash: sendTxHash
    })

    const messageSentEvent = (await sdk.messenger.getMessageSentEventFromMessageId({
      chainId: fromChainId,
      messageId
    }))!

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

    if (shouldConfirm) {
      console.log('calling confirmClaim')
      const confirmTx = await sdk.getRailsGateway(nextChainId).confirmClaim({
        pathId: transferSentEvent.decoded.pathId,
        transferId: transferSentEvent.decoded.transferId
      })

      console.log('confirm tx:', confirmTx.hash)
      await confirmTx.wait()
    }

    if (shouldWithdraw) {
      const bucketIndex = await sdk.getRailsGateway(nextChainId).getBucketIndex({
        pathId: transferSentEvent.decoded.pathId,
        claimId: lastBond1!.decoded.claimId
      })
      console.log('bucketIndex', bucketIndex)
      console.log('calling withdraw')
      const withdrawTx = await sdk.getRailsGateway(nextChainId).withdrawAll({
        pathId: transferSentEvent.decoded.pathId,
        bucketIndex
      })

      console.log('withdraw tx:', withdrawTx.hash)
      await withdrawTx.wait()
    }

    // ----------------------------------------------------------------------------

    const transferSentEvent2 = (await sdk.getRailsGateway(nextChainId).getTransferSentEventFromTransactionHash({
      transactionHash: bondTxHash,
    }))!
    console.log('transferSentEvent2', transferSentEvent2)

    const nextHopsHash2 = await sdk.getRailsGateway(nextChainId).getNextHopsHash({ nextHops: transferSentEvent2.decoded.hops.slice(1) })
    console.log('nextHopsHash2', nextHopsHash2)

    const headTransferId2 = await sdk.getRailsGateway(toChainId).getHeadClaim({ pathId: transferSentEvent2.decoded.pathId })
    console.log('headTransferId2:', headTransferId2)
    // hub chain head: 0x6c70264bdf0c44013de9d73bae21c40f356ccc913d27b628d76a725e91c9113a
    // base headTransferId2: 0x1feec003d80c942c3bcca182532ee297f73511864d96ebfe4097baf248574037

    // const transferDataHash2 = await sdk.getRailsGateway(nextChainId).getTransferDataHash({
    //   to: transferSentEvent2.decoded.to,
    //   amountOut: transferSentEvent2.decoded.amountOut,
    //   totalSent: transferSentEvent2.decoded.totalSent,
    //   totalClaims: transferSentEvent2.decoded.totalClaims,
    //   hops: transferSentEvent2.decoded.hops,
    // })

    const lastBond2 = await sdk.getRailsGateway(nextChainId).getTransferBondedEventFromTransactionHash({
      transactionHash: bondTxHash
    })

    if (shouldUpdateClaimChain2) {
      await updateClaimChain(sdk, transferSentEvent2, nextChainId, toChainId)
    }

    if (shouldPostClaim2) {
      console.log('calling postClaim2')
      const postClaimTx = await sdk.getRailsGateway(toChainId).postClaim({
        pathId: transferSentEvent2.decoded.pathId,
        transferId: transferSentEvent2.decoded.transferId,
        to: transferSentEvent2.decoded.to,
        amountOut: transferSentEvent2.decoded.amountOut,
        totalSent: transferSentEvent2.decoded.totalSent,
        totalClaims: transferSentEvent2.decoded.totalClaims,
        maxBonderFee: transferSentEvent2.decoded.hops[0].maxBonderFee,
        attestedClaimId: transferSentEvent2.decoded.hops[0].attestedClaimId,
        nextHopsHash: nextHopsHash2
      })

      console.log('postClaim tx2:', postClaimTx.hash)
      await postClaimTx.wait()
    }

    const needsBondApproval2 = await sdk.getRailsGateway(toChainId).helpers.getNeedsApprovalForBond({
      pathId: transferSentEvent2.decoded.pathId,
      amount: transferSentEvent2.decoded.amountOut
    })

    console.log('needsBondApproval2:', needsBondApproval2)

    if (needsBondApproval2) {
      const approveTx = await sdk.getRailsGateway(toChainId).helpers.approveBond({
        pathId: transferSentEvent2.decoded.pathId,
        amount: transferSentEvent2.decoded.amountOut
      })

      console.log('approval tx:', approveTx.hash)
      await approveTx.wait()
    }

    let bondTxHash2 = ''
    const shouldBond2 = !bondTxHash2 // debug
    let bondTx2: any
    if (shouldBond2) {
      console.log('calling bond')
      bondTx2 = await sdk.getRailsGateway(toChainId).bond({
        pathId: transferSentEvent2.decoded.pathId,
        claimId: transferSentEvent2.decoded.transferId,
        nextHops: transferSentEvent2.decoded.hops.slice(1),
        bonderFee: transferSentEvent2.decoded.hops[0].maxBonderFee
      })

      console.log('bond tx2:', bondTx2.hash)
      await bondTx2.wait()
    }

    const messageId2 = await sdk.messenger.getMessageIdFromTransactionHash({
      chainId: nextChainId,
      transactionHash: bondTxHash
    })

    const messageSentEvent2 = (await sdk.messenger.getMessageSentEventFromMessageId({
      chainId: nextChainId,
      messageId: messageId2
    }))!

    if (shouldExecute2) {
      console.log('calling execute2')
      const executeTx = await sdk.messenger.execute({
        messageId: messageId2,
        fromChainId: nextChainId,
        toChainId: messageSentEvent2.decoded.toChainId,
        fromAddress: messageSentEvent2.decoded.from,
        toAddress: messageSentEvent2.decoded.to,
        toCalldata: messageSentEvent2.decoded.data
      })

      console.log('execute tx2:', executeTx.hash)
      await executeTx.wait()
    }

    if (shouldConfirm2) {
      console.log('calling confirmClaim2')
      const confirmTx = await sdk.getRailsGateway(toChainId).confirmClaim({
        pathId: transferSentEvent2.decoded.pathId,
        transferId: transferSentEvent2.decoded.transferId
      })

      console.log('confirm tx2:', confirmTx.hash)
      await confirmTx.wait()
    }

    if (shouldWithdraw2) {
      const bucketIndex = await sdk.getRailsGateway(toChainId).getBucketIndex({
        pathId: transferSentEvent2.decoded.pathId,
        claimId: lastBond2!.decoded.claimId
      })
      console.log('bucketIndex', bucketIndex)
      console.log('calling withdraw')
      const withdrawTx = await sdk.getRailsGateway(toChainId).withdrawAll({
        pathId: transferSentEvent2.decoded.pathId,
        bucketIndex
      })

      console.log('withdraw tx:', withdrawTx.hash)
      await withdrawTx.wait()
    }

    // ----------------------------------------------------------------------------

    console.log('done')

    expect(true).toBeDefined()
  }, 10 * 60 * 1000)
})

function updateClaimChain(sdk: any, transferSentEvent: any, fromChainId: string, toChainId: string) {
  const headTransferId = await sdk.getRailsGateway(toChainId).getHeadClaim({ pathId: transferSentEvent.decoded.pathId })
  console.log('headTransferId:', headTransferId)

  const events = await sdk.getRailsGateway(fromChainId).getTransferSentEventsFromPathId({
    pathId: transferSentEvent.decoded.pathId
  })

  console.log(events)

  const transferDataHashes: any[] = events.map((event: any) => {
    return {
      ...event.decoded,
      transferDataHash: getComputedTransferDataHash({
        to: event.decoded.to,
        amountOut: event.decoded.amountOut,
        maxBonderFee: event.decoded.hops[0].maxBonderFee,
        attestedClaimId: event.decoded.hops[0].attestedClaimId,
        totalSent: event.decoded.totalSent,
        totalClaims: event.decoded.totalClaims,
        nextHops: event.decoded.hops
      })
    }
  })

  console.log('transferDataHashes:', transferDataHashes)

  let index = transferDataHashes.findIndex((item: any) => {
    return item.transferId === headTransferId
  })

  while (index < transferDataHashes.length - 1) {
    const item = transferDataHashes[index + 1];

    const transferDataHash = await sdk.getRailsGateway(fromChainId).getTransferDataHash({
      to: item.to,
      amountOut: item.amountOut,
      totalSent: item.totalSent,
      totalClaims: item.totalClaims,
      hops: item.hops,
    })

    console.log('item', item)
    console.log('transferDataHash', transferDataHash)
    console.log('calling updateClaimChain', index)
    const updateClaimChainTx = await sdk.getRailsGateway(toChainId).updateClaimChain({
      pathId: item.pathId,
      transferDataHash: transferDataHash0,
      headTransferId: item.transferId
    })

    console.log('updateClaimChainTx tx', index, updateClaimChainTx.hash)
    await updateClaimChainTx.wait()

    index++;
  }
}