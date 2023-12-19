import assert from 'assert'
import l1xDaiAmbAbi from '@hop-protocol/core/abi/static/L1_xDaiAMB.json'
import l2xDaiAmbAbi from '@hop-protocol/core/abi/static/L2_xDaiAMB.json'
import { AbstractMessageService, IMessageService } from 'src/chains/Services/AbstractMessageService'
import { CanonicalMessengerRootConfirmationGasLimit } from 'src/constants'
import { Contract, providers } from 'ethers'
import { GnosisCanonicalAddresses } from '@hop-protocol/core/addresses'
import { L1_xDaiAMB } from '@hop-protocol/core/contracts/static/L1_xDaiAMB'
import { L2_xDaiAMB } from '@hop-protocol/core/contracts/static/L2_xDaiAMB'
import { getCanonicalAddressesForChain } from 'src/config'
import { solidityKeccak256 } from 'ethers/lib/utils'
import { toHex } from 'web3-utils'

type Message = string
type MessageStatus = string

// references:
// https://github.com/poanetwork/tokenbridge/blob/bbc68f9fa2c8d4fff5d2c464eb99cea5216b7a0f/oracle/src/events/processAMBCollectedSignatures/index.js#L149
// https://github.com/poanetwork/tokenbridge/blob/bbc68f9fa2c8d4fff5d2c464eb99cea5216b7a0f/oracle/src/utils/message.js
export class GnosisMessageService extends AbstractMessageService<Message, MessageStatus> implements IMessageService {
  readonly #l1Amb: L1_xDaiAMB
  readonly #l2Amb: L2_xDaiAMB

  constructor (chainSlug: string) {
    super(chainSlug)

    // Get chain contracts
    const canonicalAddresses: GnosisCanonicalAddresses = getCanonicalAddressesForChain(this.chainSlug)
    const l1AmbAddress = canonicalAddresses?.l1AmbAddress
    const l2AmbAddress = canonicalAddresses?.l2AmbAddress
    if (!l1AmbAddress || !l2AmbAddress) {
      throw new Error(`canonical addresses not found for ${this.chainSlug}`)
    }

    this.#l1Amb = new Contract(l1AmbAddress, l1xDaiAmbAbi, this.l1Wallet) as L1_xDaiAMB
    this.#l2Amb = new Contract(l2AmbAddress, l2xDaiAmbAbi, this.l2Wallet) as L2_xDaiAMB
  }

  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    return this.validateMessageAndSendTransaction(l2TxHash)
  }

  async #getValidSigEvent (l2TxHash: string) {
    const tx = await this.l2Wallet.provider!.getTransactionReceipt(l2TxHash)
    const sigEvents = await this.#l2Amb.queryFilter(
      this.#l2Amb.filters.UserRequestForSignature(),
      tx.blockNumber,
      tx.blockNumber
    )

    for (const sigEvent of sigEvents) {
      const sigTxHash = sigEvent.transactionHash
      if (sigTxHash.toLowerCase() !== l2TxHash.toLowerCase()) {
        continue
      }
      const { encodedData } = sigEvent.args
      // TODO: better way of slicing by method id
      const data = encodedData.includes('ef6ebe5e00000')
        ? encodedData.replace(/.*(ef6ebe5e00000.*)/, '$1')
        : ''
      if (data) {
        return sigEvent
      }
    }
  }

  #getMessageHash (message: string): string {
    return solidityKeccak256(['bytes'], [message])
  }

  #strip0x (value: string): string {
    return value.replace(/^0x/i, '')
  }

  #signatureToVRS (rawSignature: any) {
    const signature = this.#strip0x(rawSignature)
    assert.strictEqual(signature.length, 2 + 32 * 2 + 32 * 2)
    const v = signature.substr(64 * 2)
    const r = signature.substr(0, 32 * 2)
    const s = signature.substr(32 * 2, 32 * 2)
    return { v, r, s }
  }

  #packSignatures (array: any[]) {
    const length = this.#strip0x(toHex(array.length))
    const msgLength = length.length === 1 ? `0${length}` : length
    let v = ''
    let r = ''
    let s = ''
    array.forEach(e => {
      v = v.concat(e.v)
      r = r.concat(e.r)
      s = s.concat(e.s)
    })
    return `0x${msgLength}${v}${r}${s}`
  }

  protected async sendRelayTransaction (message: MessageStatus): Promise<providers.TransactionResponse> {
    const messageHash: string = this.#getMessageHash(message)
    const requiredSigs = (await this.#l2Amb.requiredSignatures()).toNumber()
    const sigs: any[] = []
    for (let i = 0; i < requiredSigs; i++) {
      const sig = await this.#l2Amb.signature(messageHash, i)
      const [v, r, s]: any[] = [[], [], []]
      const vrs = this.#signatureToVRS(sig)
      v.push(vrs.v)
      r.push(vrs.r)
      s.push(vrs.s)
      sigs.push(vrs)
    }
    const packedSigs = this.#packSignatures(sigs)

    const overrides: any = {
      gasLimit: CanonicalMessengerRootConfirmationGasLimit
    }
    return this.#l1Amb.executeSignatures(message, packedSigs, overrides)
  }

  protected async getMessage (txHash: string): Promise<Message> {
    const sigEvent = await this.#getValidSigEvent(txHash)
    if (!sigEvent?.args) {
      throw new Error(`args for sigEvent not found for ${txHash}`)
    }

    this.logger.info('found sigEvent event args')
    const message: string = sigEvent.args.encodedData
    if (!message) {
      throw new Error(`message not found for ${txHash}`)
    }

    return message
  }

  protected async getMessageStatus (message: Message): Promise<MessageStatus> {
    // Gnosis status is validated by just the message, so we return that
    return message
  }

  protected async isMessageInFlight (messageStatus: MessageStatus): Promise<boolean> {
    return this.#isMessageInFlight(messageStatus)
  }

  protected async isMessageRelayable (messageStatus: MessageStatus): Promise<boolean> {
    const isInFlight = await this.#isMessageInFlight(messageStatus)
    const isRelayed = await this.#isMessageRelayed(messageStatus)
    return !isInFlight && !isRelayed
  }

  protected async isMessageRelayed (messageStatus: MessageStatus): Promise<boolean> {
    return this.#isMessageRelayed(messageStatus)
  }

  async #isMessageInFlight (messageStatus: MessageStatus): Promise<boolean> {
    const msgHash = this.#getMessageHash(messageStatus)
    const messageId = await this.#l2Amb.numMessagesSigned(msgHash)
    const isCheckpointed = await this.#l2Amb.isAlreadyProcessed(messageId)
    return !isCheckpointed
  }

  async #isMessageRelayed (messageStatus: MessageStatus): Promise<boolean> {
    const messageId =
      '0x' +
      Buffer.from(this.#strip0x(messageStatus), 'hex')
        .slice(0, 32)
        .toString('hex')
    return this.#l1Amb.relayedMessages(messageId)
  }
}
