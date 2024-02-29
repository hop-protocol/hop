import wait from 'wait'
import { CrossChainMessenger, MessageStatus, hashLowLevelMessage } from '@eth-optimism/sdk'
import { Signer, providers } from 'ethers'

export class OptimismRelayer {
  network: string
  l1Provider: any
  l2Provider: any
  csm: CrossChainMessenger

  constructor (network: string = 'goerli', l1Provider: providers.Provider | Signer, l2Provider: providers.Provider) {
    this.network = network
    this.l1Provider = l1Provider
    this.l2Provider = l2Provider

    this.csm = new CrossChainMessenger({
      bedrock: true,
      l1ChainId: 5,
      l2ChainId: 420,
      l1SignerOrProvider: l1Provider,
      l2SignerOrProvider: l2Provider
    })
  }

  async getExitPopulatedTx (l2TxHash: string) {
    throw new Error('not implemented')
  }

  async getIsL2TxHashExited (l2TxHash: string) {
    const messageStatus = await this.csm.getMessageStatus(l2TxHash)
    if (messageStatus === MessageStatus.RELAYED) {
      return true
    }

    return false
  }

  async exitTx (l2TxHash: string) {
    let messageStatus = await this.csm.getMessageStatus(l2TxHash)
    if (messageStatus === MessageStatus.STATE_ROOT_NOT_PUBLISHED) {
      console.log('waiting for state root to be published')
      // wait a max of 240 seconds for state root to be published on L1
      await wait(240 * 1000)
    }

    messageStatus = await this.csm.getMessageStatus(l2TxHash)
    if (messageStatus === MessageStatus.READY_TO_PROVE) {
      console.log('message ready to prove')
      const resolved = await this.csm.toCrossChainMessage(l2TxHash)
      console.log('sending proveMessage tx')
      const tx = await this.csm.proveMessage(resolved)
      console.log('proveMessage tx:', tx?.hash)
      await tx.wait()
      console.log('waiting challenge period')
      const challengePeriod = await this.csm.getChallengePeriodSeconds()
      await wait(challengePeriod * 1000)
    }

    messageStatus = await this.csm.getMessageStatus(l2TxHash)
    if (messageStatus === MessageStatus.IN_CHALLENGE_PERIOD) {
      console.log('message is in challenge period')
      // challenge period is a few seconds on goerli, 7 days in production
      const challengePeriod = await this.csm.getChallengePeriodSeconds()
      const latestBlock = await this.csm.l1Provider.getBlock('latest')
      const resolved = await this.csm.toCrossChainMessage(l2TxHash)
      const withdrawal = await this.csm.toLowLevelMessage(resolved)
      const provenWithdrawal =
        await this.csm.contracts.l1.OptimismPortal.provenWithdrawals(
          hashLowLevelMessage(withdrawal)
        )
      const timestamp = Number(provenWithdrawal.timestamp.toString())
      const bufferSeconds = 10
      const secondsLeft = (timestamp + challengePeriod + bufferSeconds) - Number(latestBlock.timestamp.toString())
      console.log('seconds left:', secondsLeft)
      await wait(secondsLeft * 1000)
    }

    messageStatus = await this.csm.getMessageStatus(l2TxHash)
    if (messageStatus === MessageStatus.READY_FOR_RELAY) {
      console.log('ready for relay')
      console.log('sending finalizeMessage tx')
      const tx = await this.csm.finalizeMessage(l2TxHash)
      console.log('finalizeMessage tx:', tx.hash)
      return tx
    }

    if (messageStatus === MessageStatus.RELAYED) {
      console.log('message already relayed')
      return
    }

    console.log(MessageStatus)
    console.log(`not ready for relay. statusCode: ${messageStatus}`)
  }

  formatError (err: Error) {
    const isNotCheckpointedYet = err.message.includes('unable to find state root batch for tx')
    const isProofNotFound = err.message.includes('messagePairs not found')
    const isInsideFraudProofWindow = err.message.includes('exit within challenge window')
    const notReadyForExit = isNotCheckpointedYet || isProofNotFound || isInsideFraudProofWindow
    if (notReadyForExit) {
      throw new Error('too early to exit')
    }
    const isAlreadyRelayed = err.message.includes('message has already been received')
    if (isAlreadyRelayed) {
      throw new Error('message has already been relayed')
    }
    // isEventLow() does not handle the case where `batchEvents` is null
    // https://github.com/ethereum-optimism/optimism/blob/26b39199bef0bea62a2ff070cd66fd92918a556f/packages/message-relayer/src/relay-tx.ts#L179
    const cannotReadProperty = err.message.includes('Cannot read property')
    if (cannotReadProperty) {
      throw new Error('event not found in optimism sdk')
    }
    throw err
  }
}
