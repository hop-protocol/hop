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

const hubRpcUrl = process.env.HUB_RPC_PROVIDER ?? 'https://hub-testnet.rpc.hop.exchange'
const hubProvider = new providers.StaticJsonRpcProvider(hubRpcUrl)

const chainProviders = {
  '11155111': ethereumProvider,
  '84532': baseProvider,
  '11155420': optimismProvider,
  '42069': hubProvider
}

describe.skip('Sdk - Hop - e2e - send only', () => {
  it('should do a send', async () => {
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
      network: 'sepolia',
      signersOrProviders: {
        [fromChainId]: signer.connect(chainProviders[fromChainId]),
        [toChainId]: signer.connect(chainProviders[toChainId]),
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

    let sendTxHash = '0xe0a9e24e055d198dd7865d444f72e03efe6fc7b04f09eeceb77e71a032e9c7ae' // debug
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

describe.only('Sdk - RailsGateway - e2e - single hop', () => {
  it('should do an end to end test', async () => {
    // ----------------
    const token = 'MOCK'
    const fromChainId = '11155111'
    const fromToken = addresses[fromChainId]!.tokens![token]!
    const toChainId = '84532'
    const toToken = addresses[toChainId]!.tokens![token]!
    const sendAmount = parseUnits('0.1', 6)
    // ----------------

    const shouldPushClaim = false // debug
    const shouldBond = true // debug
    const shouldExecute = true // debug
    const shouldConfirm = false // debug
    const shouldWithdraw = true // debug

    let sendTxHash = '0x4528cf95fa7e067ec40f160ce8aa391e1c0847a0c52cccd777d1c51c936c333a'
    let bondTxHash = ''

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

      const isClaimValid = await sdk.getRailsGateway(toChainId).getIsClaimIdValid({
        pathId: transferSentEvent.decoded.pathId,
        claimId: transferSentEvent.decoded.transferId
      })
      console.log('isClaimValid:', isClaimValid)

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

    if (!bondTxHash && bondTx) {
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
    const fromChainId = '11155111'
    const toChainId = '84532'
    const hubChainId = '11155420' // 42069
    const fromToken = addresses[fromChainId]!.tokens!.MOCK!
    const toToken = addresses[toChainId]!.tokens!.MOCK!
    const sendAmount = parseUnits('0.1', 18)
    // ----------------

    const fromProvider = chainProviders[fromChainId]
    const toProvider = chainProviders[toChainId]
    const nextChainId = hubChainId
    const nextProvider = chainProviders[nextChainId]
    const nextToken = addresses[nextChainId]!.tokens!.MOCK!

    const senderSigner = new Wallet(privateKey)
    const bonderSigner = new Wallet(bonderPrivateKey)

    const signer = new Wallet(privateKey)
    const sdk = new Hop({
      network: 'sepolia',
      signersOrProviders: {
        [fromChainId]: senderSigner.connect(fromProvider),
        [nextChainId]: bonderSigner.connect(nextProvider),
        [toChainId]: bonderSigner.connect(toProvider)
      },
    })

    sdk.setHubChainId(hubChainId)

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

    console.log('attestedClaimId:', attestedClaimId)

    // const isClaimIdValid = await sdk.getRailsGateway(nextChainId).getIsClaimIdValid({
    //   pathId: nextPathId,
    //   claimId: attestedClaimId
    // })

    // console.log('isClaimIdValid:', isClaimIdValid)

    // const maxTotalSent = await sdk.getRailsGateway(fromChainId).getTotalSent({ pathId })
    // const fee = await sdk.getRailsGateway(fromChainId).getSendFee({ pathId })
    const to = await senderSigner.getAddress()
    // const nextHops: HopStructInput[] = []

    // const blankAttestedClaimId = sdk.utils.generateZeroBytes32() // should be blank for first transfer

    const shouldPushClaim = false
    const shouldExecute = false // debug
    const shouldConfirm = false // debug
    const shouldWithdraw = false // debug
    const shouldPushClaim2 = false // debug
    const shouldExecute2 = true // debug
    const shouldConfirm2 = false // debug
    const shouldWithdraw2 = true // debug

    let sendTxHash = '0x281a277e8ab9975f00fc5dc4c18fb5ece523f93b35fd8213a511d508a84a7818'
    let bondTxHash = '0xa4a51f7b64e233159735de3f55b8d13dda9fadd7a5155244fc15d3873f0c02a4'
    let bondTxHash2 = '0xd579c5852048a480d1e247b79348b9b263a0bbf015b4e3738c81ee35b1387ea4'

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

    const stakingRegistry = sdk.getRailsGateway(nextChainId).getStakingRegistry()
    const bonderAddress = await bonderSigner.getAddress()
    const stakedBalance = await stakingRegistry.getStakedBalance({ staker: bonderAddress })
    console.log('stakedBalance:', formatUnits(stakedBalance, 18))

    const hopTokenAddress = await sdk.getRailsGateway(nextChainId).getHopTokenAddress()
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

    console.log('messageSentEvent:', messageSentEvent)

    if (shouldExecute) {
      console.log('calling execute')
      const executeTx = await sdk.getMessenger(nextChainId).execute({
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
      const withdrawTx = await sdk.getRailsGateway(nextChainId).withdrawBonds({
        pathId: transferSentEvent.decoded.pathId,
        claimId: transferSentEvent.decoded.transferId
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
      bondTxHash2 = bondTx2.hash
    }

    const messageId2 = await sdk.getMessenger(nextChainId).getMessageIdFromTransactionHash({
      transactionHash: bondTxHash2
    })

    console.log('messageId2:', messageId2)

    const messageSentEvent2 = (await sdk.getMessenger(nextChainId).getMessageSentEventFromMessageId({
      messageId: messageId2
    }))!

    console.log('messageSentEvent2:', messageSentEvent2)

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
      const withdrawTx = await sdk.getRailsGateway(toChainId).withdrawBonds({
        pathId: transferSentEvent2.decoded.pathId,
        claimId: transferSentEvent2.decoded.transferId
      })

      console.log('withdraw tx:', withdrawTx.hash)
      await withdrawTx.wait()
    }

    // ----------------------------------------------------------------------------

    console.log('done')

    expect(true).toBeDefined()
  }, 10 * 60 * 1000)
})