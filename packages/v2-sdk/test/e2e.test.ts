import { Hop, HopStructInput, TransferState } from '#index.js'
import { providers, Wallet, utils, BigNumber } from 'ethers'
import dotenv from 'dotenv'
import { getComputedTransferDataHash } from '#utils/index.js'
import { addresses } from '#addresses/sepolia.js'

dotenv.config()

const { parseUnits, formatUnits } = utils

export const privateKey = process.env.PRIVATE_KEY ?? ''
export const bonderPrivateKey = process.env.BONDER_PRIVATE_KEY ?? ''

const ethereumRpcUrl = process.env.ETHEREUM_RPC_PROVIDER ?? 'https://rpc2.sepolia.org'
const ethereumProvider = new providers.StaticJsonRpcProvider(ethereumRpcUrl)

const baseRpcUrl = process.env.BASE_RPC_PROVIDER ?? 'https://sepolia.base.org'
const baseProvider = new providers.StaticJsonRpcProvider(baseRpcUrl)

const optimismRpcUrl = process.env.OPTIMISM_RPC_PROVIDER ?? 'https://sepolia.optimism.io'
const optimismProvider = new providers.StaticJsonRpcProvider(optimismRpcUrl)

const hubRpcUrl = process.env.HUB_RPC_PROVIDER ?? 'http://hub-testnet.rpc.hop.exchange'
const hubProvider = new providers.StaticJsonRpcProvider(hubRpcUrl)

const chainProviders = {
  '11155111': ethereumProvider,
  '84532': baseProvider,
  '11155420': optimismProvider,
  '42069': hubProvider
}

describe.skip('Sdk - Hop - e2e', () => {
  it('should do a send', async () => {
    const ethereumRpcUrl = process.env.ETHEREUM_RPC_PROVIDER ?? 'https://rpc2.sepolia.org'
    const ethereumProvider = new providers.StaticJsonRpcProvider(ethereumRpcUrl)

    const baseRpcUrl = process.env.BASE_RPC_PROVIDER ?? 'https://sepolia.base.org'
    const baseProvider = new providers.StaticJsonRpcProvider(baseRpcUrl)

    // ----------------
    const fromChainId = '11155111'
    const fromToken = addresses[fromChainId]!.tokens!.MOCK!
    const toChainId = '84532'
    const toToken = addresses[toChainId]!.tokens!.MOCK!
    const sendAmount = parseUnits('0.1', 18)
    // ----------------

    console.log('fromToken:', fromToken)
    console.log('toToken:', toToken)

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

    // const blankAttestedClaimId = sdk.utils.generateZeroBytes32()
    const initialReserve = await sdk.getRailsGateway(fromChainId).helpers.getInitialReserveByTokenAddress({ tokenAddress: fromToken })
    const pathId = await sdk.getRailsGateway(fromChainId).getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: toChainId,
      token1: toToken,
      initialReserve
    })
    const attestedClaimId  = await sdk.getRailsGateway(fromChainId).getHeadClaimId({
      pathId
    })

    let sendTxHash = '' // debug
    const shouldSend = !sendTxHash // debug
    if (shouldSend) {
      const sendTx = await sdk.sendTokens({
        fromChainId,
        toChainId,
        fromToken,
        toToken,
        amount: sendAmount,
        minAmountOut,
        attestedClaimId,
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
    // ----------------
    const fromChainId = '11155111'
    const fromToken = addresses[fromChainId]!.tokens!.MOCK!
    const toChainId = '84532'
    const toToken = addresses[toChainId]!.tokens!.MOCK!
    const sendAmount = parseUnits('0.1', 18)
    // ----------------

    const shouldPushClaim = false // debug
    const shouldBond = false // debug
    const shouldExecute = false // debug
    const shouldConfirm = false // debug
    const shouldWithdraw = true // debug

    let sendTxHash = '0x579bf9d653b2bc5237db2f024afd80c70a2ca4a5ff901b33acf4520a4a59eb4c'
    let bondTxHash = '0x6ea977c4c32ad99f59b4cce2f5c2cd53fcb9785c77de5949eb29ec64474443dc'

    const senderSigner = new Wallet(privateKey)
    const bonderSigner = new Wallet(bonderPrivateKey)
    const sdk = new Hop({
      network: 'sepolia',
      signersOrProviders: {
        [fromChainId]: senderSigner.connect(chainProviders[fromChainId]),
        [toChainId]: bonderSigner.connect(chainProviders[toChainId])
      },
    })

    console.log('fromToken:', fromToken)
    const initialReserve = await sdk.getRailsGateway(fromChainId).helpers.getInitialReserveByTokenAddress({ tokenAddress: fromToken })
    console.log('initialReserve:', initialReserve.toString())
    const pathId = await sdk.getRailsGateway(fromChainId).getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: toChainId,
      token1: toToken,
      initialReserve
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

    const attestedClaimId  = await sdk.getRailsGateway(fromChainId).getHeadClaimId({
      pathId
    })

    const isClaimIdValid = await sdk.getRailsGateway(toChainId).getIsClaimIdValid({
      pathId,
      claimId: attestedClaimId
    })

    console.log('isClaimIdValid:', isClaimIdValid)

    const maxTotalSent = await sdk.getRailsGateway(fromChainId).getTotalSent({ pathId })
    const fee = await sdk.getRailsGateway(fromChainId).getSendFee({ pathId })
    const to = await senderSigner.getAddress()
    const maxBonderFee = await sdk.getMaxBonderFee({ amountIn: sendAmount })
    const blankAttestedClaimId = sdk.utils.generateZeroBytes32()

    const hops: HopStructInput[] = [{
      pathId,
      attestedClaimId,
      maxTotalSent,
      maxBonderFee
    }]

    const shouldSend = !sendTxHash // debug
    let sendTx: any
    if (shouldSend) {
      sendTx = await sdk.getRailsGateway(fromChainId).send({
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

    console.log({
      to: transferSentEvent.decoded.to,
      amountOut: transferSentEvent.decoded.amount,
      sourcePool: transferSentEvent.decoded.sourcePool,
      hops: transferSentEvent.decoded.hops,
    })

    const transferDataHash = await sdk.getRailsGateway(fromChainId).getTransferDataHash({
      to: transferSentEvent.decoded.to,
      amountOut: transferSentEvent.decoded.amount,
      sourcePool: transferSentEvent.decoded.sourcePool,
      hops: transferSentEvent.decoded.hops,
    })

    console.log('transferDataHash:', transferDataHash)

    // const events = await sdk.getRailsGateway(fromChainId).getTransferSentEventsFromPathId({
    //   pathId
    // })

    // console.log('events', events)

    const stakingRegistry = sdk.getRailsGateway(toChainId).getStakingRegistry()
    const bonderAddress = await bonderSigner.getAddress()
    const stakedBalance = await stakingRegistry.getStakedBalance({ staker: bonderAddress })
    console.log('stakedBalance:', formatUnits(stakedBalance, 18))

    const hopTokenAddress = await sdk.getRailsGateway(toChainId).getHopTokenAddress()
    console.log('hopTokenAddress:', hopTokenAddress)

    const minHopStake = await stakingRegistry.minHopStake()
    console.log('minHopStake:', formatUnits(minHopStake, 18))
    const shouldStake = stakedBalance.lt(minHopStake)
    if (shouldStake) {
      const needsStakeApproval = await stakingRegistry.helpers.getNeedsApprovalForStake({
        amount: minHopStake,
        account: bonderAddress
      })

      console.log('needsStakeApproval:', needsStakeApproval)

      if (needsStakeApproval) {
        const stakeApproveTx = await stakingRegistry.helpers.approveStake({
          amount: minHopStake
        })

        console.log('stake approval tx:', stakeApproveTx.hash)
        await stakeApproveTx.wait()
      }


      const hopBalance = await stakingRegistry.helpers.getHopBalance({ staker: bonderAddress })
      console.log('hopBalance:', formatUnits(hopBalance, 18))
      if (hopBalance.lt(minHopStake)) {
        const mintTx = await stakingRegistry.helpers.mint({ amount: minHopStake, to: bonderAddress })
        console.log('mintTx:', mintTx.hash)
        await mintTx.wait()
      }

      const stakeTx = await stakingRegistry.stakeHop({ amount: minHopStake, staker: bonderAddress })
      console.log('stakeTx:', stakeTx.hash)
      await stakeTx.wait()
    }

    const headTransferId = await sdk.getRailsGateway(toChainId).getHeadClaimId({ pathId: transferSentEvent.decoded.pathId })
    console.log('headTransferId:', headTransferId)

    const counterchainHeadTransferId = await sdk.getRailsGateway(fromChainId).getHeadClaimId({ pathId: transferSentEvent.decoded.pathId })
    console.log('counterchain headTransferId:', counterchainHeadTransferId)

    if (shouldPushClaim) {
      console.log('calling pushClaim')

      const nextHopsHash = await sdk.getRailsGateway(fromChainId).getNextHopsHash({ nextHops: transferSentEvent.decoded.hops.slice(1) })
      console.log('nextHopsHash:', nextHopsHash)

      const headTransferId = await sdk.getRailsGateway(fromChainId).getHeadClaimId({ pathId: transferSentEvent.decoded.pathId })
      console.log('headTransferId:', headTransferId)

      const isValidTransfer = await sdk.getRailsGateway(toChainId).isValidTransfer({
        pathId,
        claimId: headTransferId
      })
      console.log('isValidTransfer:', isValidTransfer)

      // Check if claim already exists
      const isClaimValid = await sdk.getRailsGateway(toChainId).getIsClaimIdValid({
        pathId: transferSentEvent.decoded.pathId,
        claimId: transferSentEvent.decoded.transferId
      })
      console.log('isClaimValid:', isClaimValid)

      // Verify source pool
      const sourcePool = await sdk.getRailsGateway(fromChainId).getSourcePool({
        pathId: transferSentEvent.decoded.pathId,
        attestedClaimId: transferSentEvent.decoded.hops[0].attestedClaimId
      })
      console.log('sourcePool matches:', sourcePool.eq(transferSentEvent.decoded.sourcePool))

      const args = {
        pathId: transferSentEvent.decoded.pathId,
        claimId: transferSentEvent.decoded.transferId,
        to: transferSentEvent.decoded.to,
        amount: transferSentEvent.decoded.amount,
        maxBonderFee: transferSentEvent.decoded.hops[0].maxBonderFee,
        attestedClaimId: transferSentEvent.decoded.hops[0].attestedClaimId,
        sourcePool: transferSentEvent.decoded.sourcePool,
        nextHopsHash
      }
      console.log(args)
      const pushClaimTx = await sdk.getRailsGateway(toChainId).pushClaim(args)

      console.log('pushClaim tx:', pushClaimTx.hash)
      await pushClaimTx.wait()
    }

    const needsBondApproval = await sdk.getRailsGateway(toChainId).helpers.getNeedsApprovalForBond({
      pathId: transferSentEvent.decoded.pathId,
      amount: transferSentEvent.decoded.amount
    })

    console.log('needsBondApproval:', needsBondApproval)

    if (needsBondApproval) {
      const approveTx = await sdk.getRailsGateway(toChainId).helpers.approveBond({
        pathId: transferSentEvent.decoded.pathId,
        amount: transferSentEvent.decoded.amount
      })

      console.log('approval tx:', approveTx.hash)
      await approveTx.wait()
    }

    const isBonded = await sdk.getRailsGateway(toChainId).helpers.getIsTransferBonded({
      transferId: transferSentEvent.decoded.transferId,
    })

    console.log('isBonded:', isBonded)

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

    if (!bondTxHash) {
      bondTxHash = bondTx.hash
    }
    const lastBond = await sdk.getRailsGateway(toChainId).getTransferBondedEventFromTransactionHash({
      transactionHash: bondTxHash
    })

    const bucketIndex = await sdk.getRailsGateway(toChainId).getBucketIndex({ pathId, claimId: lastBond!.decoded.claimId })

    console.log('bucketIndex:', bucketIndex)

    const messageId = await sdk.getMessenger(fromChainId).getMessageIdFromTransactionHash({
      transactionHash: sendTxHash
    })

    const messageSentEvent = (await sdk.getMessenger(fromChainId).getMessageSentEventFromMessageId({
      messageId
    }))!

    console.log('MessageSent event:', messageSentEvent)

    if (shouldExecute) {
      console.log('calling execute')
      const args = {
        messageId,
        fromChainId,
        toChainId: messageSentEvent.decoded.toChainId,
        fromAddress: messageSentEvent.decoded.from,
        toAddress: messageSentEvent.decoded.to,
        toCalldata: messageSentEvent.decoded.data
      }
      console.log(args)
      const executeTx = await sdk.getMessenger(toChainId).execute(args)

      console.log('execute tx:', executeTx.hash)
      await executeTx.wait()
    }

    if (shouldConfirm) {
      console.log('calling confirmClaim')
      const confirmTx = await sdk.getRailsGateway(toChainId).confirmClaim({
        pathId: transferSentEvent.decoded.pathId,
        claimId: transferSentEvent.decoded.transferId
      })

      console.log('confirm tx:', confirmTx.hash)
      await confirmTx.wait()
    }

    if (shouldWithdraw) {
      console.log('calling withdraw')
      const withdrawTx = await sdk.getRailsGateway(toChainId).withdrawBonds({
        pathId: transferSentEvent.decoded.pathId,
        claimId: transferSentEvent.decoded.transferId
      })

      console.log('withdraw tx:', withdrawTx.hash)
      await withdrawTx.wait()
    }

    console.log('done')

    expect(true).toBeDefined()
  }, 10 * 60 * 1000)
})

describe.skip('Sdk - RailsGateway - e2e - multi hop', () => {
  it('should do an end to end test', async () => {
    // ----------------
    const fromChainId = '11155420'
    const fromToken = '0xbc357f673879a3145172A95546948DBaFd9Fe1cE'
    const toChainId = '84532'
    const toToken = '0xbc357f673879a3145172A95546948DBaFd9Fe1cE'
    const sendAmount = parseUnits('0.1', 18)
    // ----------------

    const fromProvider = chainProviders[fromChainId]
    const toProvider = chainProviders[toChainId]
    const nextChainId = '42069'
    const nextProvider = chainProviders[nextChainId]
    const nextToken = addresses[nextChainId]!.tokens!.MOCK!

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

    const initialReserve = await sdk.getRailsGateway(fromChainId).helpers.getInitialReserveByTokenAddress({ tokenAddress: fromToken })
    const nextPathId = await sdk.getRailsGateway(fromChainId).getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: nextChainId,
      token1: nextToken,
      initialReserve
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

    const attestedClaimId  = await sdk.getRailsGateway(fromChainId).getHeadClaimId({
      pathId: nextPathId
    })

    const isClaimIdValid = await sdk.getRailsGateway(nextChainId).getIsClaimIdValid({
      pathId: nextPathId,
      claimId: attestedClaimId
    })

    console.log('isClaimIdValid:', isClaimIdValid)

    // const maxTotalSent = await sdk.getRailsGateway(fromChainId).getTotalSent({ pathId })
    // const fee = await sdk.getRailsGateway(fromChainId).getSendFee({ pathId })
    const to = await senderSigner.getAddress()
    // const nextHops: HopStructInput[] = []

    // const blankAttestedClaimId = sdk.utils.generateZeroBytes32() // should be blank for first transfer

    const shouldPushClaim = true
    const shouldExecute = true // debug
    const shouldConfirm = true // debug
    const shouldWithdraw = true // debug
    const shouldPushClaim2 = true // debug
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
      amountOut: transferSentEvent.decoded.amount,
      sourcePool: transferSentEvent.decoded.sourcePool,
      hops: transferSentEvent.decoded.hops,
    })

    console.log('transferDataHash:', transferDataHash)

    const headTransferId = await sdk.getRailsGateway(nextChainId).getHeadClaimId({ pathId: transferSentEvent.decoded.pathId })
    console.log('pathId:', transferSentEvent.decoded.pathId)
    console.log('headTransferId:', headTransferId)

    if (shouldPushClaim) {
      console.log('calling pushClaim')
      const pushClaimTx = await sdk.getRailsGateway(nextChainId).pushClaim({
        pathId: transferSentEvent.decoded.pathId,
        claimId: transferSentEvent.decoded.transferId,
        to: transferSentEvent.decoded.to,
        amount: transferSentEvent.decoded.amount,
        maxBonderFee: transferSentEvent.decoded.hops[0].maxBonderFee,
        attestedClaimId: transferSentEvent.decoded.hops[0].attestedClaimId,
        sourcePool: transferSentEvent.decoded.sourcePool,
        nextHopsHash
      })

      console.log('pushClaim tx:', pushClaimTx.hash)
      await pushClaimTx.wait()
    }

    const needsBondApproval = await sdk.getRailsGateway(nextChainId).helpers.getNeedsApprovalForBond({
      pathId: transferSentEvent.decoded.pathId,
      amount: transferSentEvent.decoded.amount
    })

    console.log('needsBondApproval:', needsBondApproval)

    if (needsBondApproval) {
      const approveTx = await sdk.getRailsGateway(nextChainId).helpers.approveBond({
        pathId: transferSentEvent.decoded.pathId,
        amount: transferSentEvent.decoded.amount
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

    const messageId = await sdk.getMessenger(fromChainId).getMessageIdFromTransactionHash({
      transactionHash: sendTxHash
    })

    const messageSentEvent = (await sdk.getMessenger(fromChainId).getMessageSentEventFromMessageId({
      messageId
    }))!

    if (shouldExecute) {
      console.log('calling execute')
      const executeTx = await sdk.getMessenger(toChainId).execute({
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
        claimId: transferSentEvent.decoded.transferId
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
      const withdrawTx = await sdk.getRailsGateway(nextChainId).withdraw({
        pathId: transferSentEvent.decoded.pathId,
        claimId: transferSentEvent.decoded.transferId // TODO
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

    const headTransferId2 = await sdk.getRailsGateway(toChainId).getHeadClaimId({ pathId: transferSentEvent2.decoded.pathId })
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

    if (shouldPushClaim2) {
      console.log('calling pushClaim2')
      const pushClaimTx = await sdk.getRailsGateway(toChainId).pushClaim({
        pathId: transferSentEvent2.decoded.pathId,
        claimId: transferSentEvent2.decoded.transferId,
        to: transferSentEvent2.decoded.to,
        amount: transferSentEvent2.decoded.amount,
        maxBonderFee: transferSentEvent2.decoded.hops[0].maxBonderFee,
        attestedClaimId: transferSentEvent2.decoded.hops[0].attestedClaimId,
        sourcePool: transferSentEvent2.decoded.sourcePool,
        nextHopsHash: nextHopsHash2
      })

      console.log('pushClaim tx2:', pushClaimTx.hash)
      await pushClaimTx.wait()
    }

    const needsBondApproval2 = await sdk.getRailsGateway(toChainId).helpers.getNeedsApprovalForBond({
      pathId: transferSentEvent2.decoded.pathId,
      amount: transferSentEvent2.decoded.amount
    })

    console.log('needsBondApproval2:', needsBondApproval2)

    if (needsBondApproval2) {
      const approveTx = await sdk.getRailsGateway(toChainId).helpers.approveBond({
        pathId: transferSentEvent2.decoded.pathId,
        amount: transferSentEvent2.decoded.amount
      })

      console.log('approval tx:', approveTx.hash)
      await approveTx.wait()
    }

    const bondTxHash2 = ''
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

    const messageId2 = await sdk.getMessenger(nextChainId).getMessageIdFromTransactionHash({
      transactionHash: bondTxHash2
    })

    const messageSentEvent2 = (await sdk.getMessenger(nextChainId).getMessageSentEventFromMessageId({
      messageId: messageId2
    }))!

    if (shouldExecute2) {
      console.log('calling execute2')
      const executeTx = await sdk.getMessenger(toChainId).execute({
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
        claimId: transferSentEvent2.decoded.transferId
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
      const withdrawTx = await sdk.getRailsGateway(toChainId).withdraw({
        pathId: transferSentEvent2.decoded.pathId,
        claimId: transferSentEvent2.decoded.transferId // TODO
      })

      console.log('withdraw tx:', withdrawTx.hash)
      await withdrawTx.wait()
    }

    // ----------------------------------------------------------------------------

    console.log('done')

    expect(true).toBeDefined()
  }, 10 * 60 * 1000)
})