import { Hop, HopStruct, TransferState } from '#index.js'
import { providers, Wallet, utils } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

const { parseUnits } = utils

export const privateKey = process.env.PRIVATE_KEY ?? ''

describe('Sdk - Hop - e2e', () => {
  const sepoliaChainProviders = Hop.getDefaultChainRpcProviders('sepolia')

  it('should do a send', async () => {
    const ethereumRpcUrl = process.env.ETHEREUM_RPC_PROVIDER ?? 'https://rpc2.sepolia.org'
    const ethereumProvider = new providers.StaticJsonRpcProvider(ethereumRpcUrl)

    const baseRpcUrl = process.env.BASE_RPC_PROVIDER ?? 'https://sepolia.base.org'
    const baseProvider = new providers.StaticJsonRpcProvider(baseRpcUrl)

    const signer = new Wallet(privateKey, ethereumProvider)
    const sdk = new Hop({
      chainProviders: sepoliaChainProviders,
      signer
    })

    // ----------------
    const fromChainId = '11155111'
    const fromToken = '0x73bd27b5DB0815979bBCEb1Da519DECeF9F74Baf'
    const toChainId = '84532'
    const toToken = '0x73bd27b5DB0815979bBCEb1Da519DECeF9F74Baf'
    const sendAmount = parseUnits('0.1', 18)
    // ----------------

    const to = await signer.getAddress()

    const needsApproval = await sdk.getNeedsApprovalForSendTokens({
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      amount: sendAmount
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

    const shouldSend = true // debug
    // let sendTxHash = '0xee4b8eed47c2474f97ad45a91a1e1bcf1c10233885bd24d02eb94b0f08ba6106' // debug
    let sendTxHash = '' // debug
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

describe.only('Sdk - RailsGateway - e2e', () => {
  const sepoliaChainProviders = Hop.getDefaultChainRpcProviders('sepolia')

  it('should do an end to end test', async () => {
    const ethereumRpcUrl = process.env.ETHEREUM_RPC_PROVIDER ?? 'https://rpc2.sepolia.org'
    const ethereumProvider = new providers.StaticJsonRpcProvider(ethereumRpcUrl)

    const baseRpcUrl = process.env.BASE_RPC_PROVIDER ?? 'https://sepolia.base.org'
    const baseProvider = new providers.StaticJsonRpcProvider(baseRpcUrl)

    let signer = new Wallet(privateKey, ethereumProvider)
    let sdk = new Hop({
      chainProviders: sepoliaChainProviders,
      signer
    })

    // ----------------
    const fromChainId = '11155111'
    const fromToken = '0x73bd27b5DB0815979bBCEb1Da519DECeF9F74Baf'
    const toChainId = '84532'
    const toToken = '0x73bd27b5DB0815979bBCEb1Da519DECeF9F74Baf'
    const sendAmount = parseUnits('0.1', 18)
    // ----------------

    const pathId = await sdk.getRailsGateway(fromChainId).getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: toChainId,
      token1: toToken
    })

    console.log('pathId:', pathId)

    const isLive = await sdk.getRailsGateway(fromChainId).getIsPathIdLive({
      pathId
    })

    console.log('isPathIdLive:', isLive)

    const needsApproval = await sdk.getRailsGateway(fromChainId).getNeedsApprovalForSend({
      pathId,
      amount: sendAmount
    })

    console.log('needsApproval:', needsApproval)

    if (needsApproval) {
      const approveTx = await sdk.getRailsGateway(fromChainId).approveSend({
        pathId,
        amount: sendAmount
      })

      console.log('approval tx:', approveTx.hash)
      await approveTx.wait()
    }

    const attestedClaimId  = await sdk.getRailsGateway(fromChainId).getLatestClaim({
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

    const shouldSend = false // debug
    if (shouldSend) {
      const sendTx = await sdk.getRailsGateway(fromChainId).send({
        pathId,
        amount: sendAmount,
        attestedClaimId,
        maxTotalSent,
        to,
        nextHops,
        fee
      })

      console.log('send tx:', sendTx.hash)
      await sendTx.wait()
    }

    const transferSentEvent = (await sdk.getRailsGateway(fromChainId).getTransferSentEventFromTransactionHash({
      transactionHash: '0x0478a7c71aabda736cf7238fec9ae6e2c8aa6626f0d87b28aeaa5150d521392d' // sendTx.hash // debug
    }))!

    console.log('TransferSent event:', transferSentEvent)

    const messageId = await sdk.messenger.getMessageIdFromTransactionHash({
      chainId: fromChainId,
      transactionHash: '0x0478a7c71aabda736cf7238fec9ae6e2c8aa6626f0d87b28aeaa5150d521392d' // sendTx.hash // debug
    })

    const messageSentEvent = (await sdk.messenger.getMessageSentEventFromMessageId({
      chainId: fromChainId,
      messageId
    }))!

    console.log('MessageSent event:', messageSentEvent)

    // TODO: signer config for different chains to not do this
    signer = new Wallet(privateKey, baseProvider)
    sdk = new Hop({
      chainProviders: sepoliaChainProviders,
      signer
    })

    const shouldExecute = false // debug
    if (shouldExecute) {
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

    const nextHopsHash = sdk.getRailsGateway(fromChainId).getNextHopsHash({ nextHops: transferSentEvent.decoded.nextHops })

    console.log('nextHopsHash:', nextHopsHash)

    const shouldPostClaim = false // debug
    if (shouldPostClaim) {
      const postClaimTx = await sdk.getRailsGateway(toChainId).postClaim({
        pathId: transferSentEvent.decoded.pathId,
        transferId: transferSentEvent.decoded.transferId,
        to: transferSentEvent.decoded.to,
        amount: transferSentEvent.decoded.amount,
        totalSent: transferSentEvent.decoded.totalSent,
        attestedClaimId: transferSentEvent.decoded.attestedClaimId,
        attestedTotalClaims: transferSentEvent.decoded.attestedTotalClaims,
        nextHopsHash
      })

      console.log('postClaim tx:', postClaimTx.hash)
      await postClaimTx.wait()
    }

    const needsBondApproval = await sdk.getRailsGateway(toChainId).getNeedsApprovalForBond({
      pathId: transferSentEvent.decoded.pathId,
      amount: transferSentEvent.decoded.amount
    })

    console.log('needsBondApproval:', needsBondApproval)

    if (needsBondApproval) {
      const approveTx = await sdk.getRailsGateway(fromChainId).approveBond({
        pathId: transferSentEvent.decoded.pathId,
        amount: transferSentEvent.decoded.amount
      })

      console.log('approval tx:', approveTx.hash)
      await approveTx.wait()
    }

    const isBonded = await sdk.getRailsGateway(toChainId).getIsTransferBonded({
      transferId: transferSentEvent.decoded.transferId,
    })

    console.log('isBonded:', isBonded)

    const shouldBond = false // debug
    if (shouldBond) {
      const bondTx = await sdk.getRailsGateway(toChainId).bond({
        pathId: transferSentEvent.decoded.pathId,
        amount: transferSentEvent.decoded.amount,
        transferId: transferSentEvent.decoded.transferId,
        nextHops: transferSentEvent.decoded.nextHops
      })

      console.log('bond tx:', bondTx.hash)
      await bondTx.wait()
    }

    const isClaimed = await sdk.getRailsGateway(toChainId).getIsTransferClaimed({
      transferId: transferSentEvent.decoded.transferId,
    })

    console.log('isClaimed:', isClaimed)

    const shouldConfirm = false // debug
    if (shouldConfirm) {
      const confirmTx = await sdk.getRailsGateway(toChainId).confirmClaim({
        pathId: transferSentEvent.decoded.pathId,
        transferId: transferSentEvent.decoded.transferId
      })

      console.log('confirm tx:', confirmTx.hash)
      await confirmTx.wait()
    }

    const bondedEvent = (await sdk.getRailsGateway(toChainId).getTransferBondedEventFromTransactionHash({
      transactionHash: '0x99672ac84de539eefc9b4ed8a546e8c430d68b21ad1a315f2d72fd52e5d706b5' // bondTx.hash // debug
    }))!

    console.log('BondedEvent  event:', bondedEvent)

    const bondTx = await signer.provider.getTransaction('0x99672ac84de539eefc9b4ed8a546e8c430d68b21ad1a315f2d72fd52e5d706b5') // bondTx.hash) // debug
    const bondBlock = await signer.provider.getBlock(bondTx.blockNumber!)

    const timeWindow = bondBlock.timestamp

    console.log('timeWindow:', timeWindow)

    const shouldWithdraw = false // debug
    if (shouldWithdraw) {
      const withdrawTx = await sdk.getRailsGateway(toChainId).withdrawClaim({
        pathId: transferSentEvent.decoded.pathId,
        amount: transferSentEvent.decoded.amount,
        timeWindow
      })

      console.log('withdraw tx:', withdrawTx.hash)
      await withdrawTx.wait()
    }

    console.log('done')

    expect(true).toBeDefined()
  }, 10 * 60 * 1000)
})
