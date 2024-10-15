import { Hop, HopStruct, TransferState } from '#index.js'
import { providers, Wallet, utils } from 'ethers'
import dotenv from 'dotenv'
import { getComputedTransferDataHash } from '#utils/index.js'

dotenv.config()

const { parseUnits } = utils

export const privateKey = process.env.PRIVATE_KEY ?? ''

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
        [toChainId]: signer.connect(baseProvider)
      },
    })

    const shouldBatchUpdateClaimChain = false // debug
    if (shouldBatchUpdateClaimChain) {
      const pathId = '0xb3a7b3f7f8451629de6395167aa5d6d2525d592d733a5d4389c4feafa2ec0cab'
      const finalTransferId = '0x55d71bbb1e0f5f297dabb748558edc0eb79c6e9fa41346f34121fc31cbcb1203'

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
    const to = await signer.getAddress()
    const nextHops: HopStruct[] = []

    const blankAttestedClaimId = sdk.utils.generateZeroBytes32()

    const shouldSend = true // debug
    let sendTx: any
    if (shouldSend) {
      sendTx = await sdk.getRailsGateway(fromChainId).send({
        pathId,
        amount: sendAmount,
        attestedClaimId: blankAttestedClaimId,
        maxTotalSent,
        to,
        nextHops,
        fee
      })

      console.log('send tx:', sendTx.hash)
      await sendTx.wait()
    }

    const transferSentEvent = (await sdk.getRailsGateway(fromChainId).getTransferSentEventFromTransactionHash({
      // transactionHash: '0xf64016ec54fb1d608b35da727354da199dc4c12ebde44de34b98ee3a8c577b66', // debug
      transactionHash: sendTx.hash,
    }))!

    console.log('TransferSent event:', transferSentEvent)

    const messageId = await sdk.messenger.getMessageIdFromTransactionHash({
      chainId: fromChainId,
      // transactionHash: '0xf64016ec54fb1d608b35da727354da199dc4c12ebde44de34b98ee3a8c577b66', // debug
      transactionHash: sendTx.hash
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

    const nextHopsHash = await sdk.getRailsGateway(fromChainId).getNextHopsHash({ nextHops: transferSentEvent.decoded.nextHops })

    console.log('nextHopsHash:', nextHopsHash)

    const transferDataHash = await sdk.getRailsGateway(fromChainId).getTransferDataHash(transferSentEvent.decoded)

    console.log('transferDataHash:', transferDataHash)

    const shouldUpdateClaimChain = true // debug // TODO: dynamically check
    if (shouldUpdateClaimChain) {
      const headTransferId = await sdk.getRailsGateway(toChainId).getHeadClaim({ pathId: transferSentEvent.decoded.pathId })
      console.log('headTransferId:', headTransferId)
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
        totalSent: transferSentEvent.decoded.totalSent,
        totalClaims: transferSentEvent.decoded.totalClaims,
        attestedClaimId: transferSentEvent.decoded.attestedClaimId,
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
        nextHops: transferSentEvent.decoded.nextHops
      })

      console.log('bond tx:', bondTx.hash)
      await bondTx.wait()
    }

    const isClaimed = await sdk.getRailsGateway(toChainId).helpers.getIsTransferClaimed({
      transferId: transferSentEvent.decoded.transferId,
    })

    console.log('isClaimed:', isClaimed)

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

    const bucketIndex = await sdk.getRailsGateway(toChainId).getBucketIndex({ pathId, claimId: transferSentEvent.decoded.transferId })

    console.log('bucketIndex:', bucketIndex)

    const shouldWithdraw = true // debug
    if (shouldWithdraw) {
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

    const hubRpcUrl = process.env.HUB_RPC_PROVIDER ?? 'http://hub-testnet.rpc.hop.exchange'
    const hubProvider = new providers.StaticJsonRpcProvider(hubRpcUrl)

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
        '42069': signer.connect(hubProvider),
      },
    })

    const shouldBatchUpdateClaimChain = false // debug
    if (shouldBatchUpdateClaimChain) {
      const pathId = '0xb3a7b3f7f8451629de6395167aa5d6d2525d592d733a5d4389c4feafa2ec0cab'
      const finalTransferId = '0x55d71bbb1e0f5f297dabb748558edc0eb79c6e9fa41346f34121fc31cbcb1203'

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
    const to = await signer.getAddress()
    const nextHops: HopStruct[] = []

    const blankAttestedClaimId = sdk.utils.generateZeroBytes32()

    const shouldSend = true // debug
    let sendTx: any
    if (shouldSend) {
      sendTx = await sdk.getRailsGateway(fromChainId).send({
        pathId,
        amount: sendAmount,
        attestedClaimId: blankAttestedClaimId,
        maxTotalSent,
        to,
        nextHops,
        fee
      })

      console.log('send tx:', sendTx.hash)
      await sendTx.wait()
    }

    const transferSentEvent = (await sdk.getRailsGateway(fromChainId).getTransferSentEventFromTransactionHash({
      // transactionHash: '0xf64016ec54fb1d608b35da727354da199dc4c12ebde44de34b98ee3a8c577b66', // debug
      transactionHash: sendTx.hash,
    }))!

    console.log('TransferSent event:', transferSentEvent)

    const messageId = await sdk.messenger.getMessageIdFromTransactionHash({
      chainId: fromChainId,
      // transactionHash: '0xf64016ec54fb1d608b35da727354da199dc4c12ebde44de34b98ee3a8c577b66', // debug
      transactionHash: sendTx.hash
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

    const nextHopsHash = await sdk.getRailsGateway(fromChainId).getNextHopsHash({ nextHops: transferSentEvent.decoded.nextHops })

    console.log('nextHopsHash:', nextHopsHash)

    const transferDataHash = await sdk.getRailsGateway(fromChainId).getTransferDataHash(transferSentEvent.decoded)

    console.log('transferDataHash:', transferDataHash)

    const shouldUpdateClaimChain = true // debug // TODO: dynamically check
    if (shouldUpdateClaimChain) {
      const headTransferId = await sdk.getRailsGateway(toChainId).getHeadClaim({ pathId: transferSentEvent.decoded.pathId })
      console.log('headTransferId:', headTransferId)
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
        totalSent: transferSentEvent.decoded.totalSent,
        totalClaims: transferSentEvent.decoded.totalClaims,
        attestedClaimId: transferSentEvent.decoded.attestedClaimId,
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
        nextHops: transferSentEvent.decoded.nextHops
      })

      console.log('bond tx:', bondTx.hash)
      await bondTx.wait()
    }

    const isClaimed = await sdk.getRailsGateway(toChainId).helpers.getIsTransferClaimed({
      transferId: transferSentEvent.decoded.transferId,
    })

    console.log('isClaimed:', isClaimed)

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

    const bucketIndex = await sdk.getRailsGateway(toChainId).getBucketIndex({ pathId, claimId: transferSentEvent.decoded.transferId })

    console.log('bucketIndex:', bucketIndex)

    const shouldWithdraw = true // debug
    if (shouldWithdraw) {
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
