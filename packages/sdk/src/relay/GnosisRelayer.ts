import { utils } from 'ethers'
import type { L1_xDaiAMB, L2_xDaiAMB } from '../index.js'
import { NetworkSlug } from '../index.js'
import { ChainSlug, L1_xDaiAMB__factory, L2_xDaiAMB__factory } from '../index.js'
import type { Overrides, providers, Signer } from 'ethers'

type Message = string
type MessageStatus = string

const DefaultL1RelayGasLimit = 1_000_000

export type GnosisCanonicalAddresses = {
  l1AmbAddress: string
  l2AmbAddress: string
}

type GnosisAddressesType = {
  canonicalAddresses: {
    [key in NetworkSlug]?: {
      [ChainSlug.Gnosis]: GnosisCanonicalAddresses
    }
  }
}

// TODO: Get these from config
const GnosisAddresses: GnosisAddressesType = {
  canonicalAddresses: {
    [NetworkSlug.Mainnet]: {
      [ChainSlug.Gnosis]: {
        l1AmbAddress: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
        l2AmbAddress: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59'
      }
    }
  }
}

// references:
// https://github.com/poanetwork/tokenbridge/blob/bbc68f9fa2c8d4fff5d2c464eb99cea5216b7a0f/oracle/src/events/processAMBCollectedSignatures/index.js#L149
// https://github.com/poanetwork/tokenbridge/blob/bbc68f9fa2c8d4fff5d2c464eb99cea5216b7a0f/oracle/src/utils/message.js
export class GnosisRelayer {
  l1Wallet: Signer | providers.Provider
  l2Wallet: providers.Provider

  readonly #l1Amb: L1_xDaiAMB
  readonly #l2Amb: L2_xDaiAMB

  constructor (networkSlug: string, l1Wallet: Signer | providers.Provider, l2Wallet: Signer | providers.Provider) {
    this.l1Wallet = l1Wallet
    this.l2Wallet = l2Wallet as providers.Provider

    // Get chain contracts
    const gnosisAddresses: GnosisCanonicalAddresses | undefined = GnosisAddresses.canonicalAddresses?.[networkSlug as NetworkSlug]?.[ChainSlug.Gnosis]
    if (!gnosisAddresses) {
      throw new Error(`canonical addresses not found for gnosis`)
    }

    const l1AmbAddress = gnosisAddresses.l1AmbAddress
    const l2AmbAddress = gnosisAddresses.l2AmbAddress
    this.#l1Amb = L1_xDaiAMB__factory.connect(l1AmbAddress, this.l1Wallet) as L1_xDaiAMB
    this.#l2Amb = L2_xDaiAMB__factory.connect(l2AmbAddress, this.l2Wallet) as L2_xDaiAMB
  }

  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    throw new Error('L1 to L2 message relay not supported. Messages are relayed with a system tx.')
  }

  async #getValidSigEvent (l2TxHash: string) {
    const tx = await this.l2Wallet!.getTransactionReceipt(l2TxHash)
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
    return utils.solidityKeccak256(['bytes'], [message])
  }

  #strip0x (value: string): string {
    return value.replace(/^0x/i, '')
  }

  #signatureToVRS (rawSignature: any) {
    const signature = this.#strip0x(rawSignature)
    const v = signature.substr(64 * 2)
    const r = signature.substr(0, 32 * 2)
    const s = signature.substr(32 * 2, 32 * 2)
    return { v, r, s }
  }

  #packSignatures (array: any[]) {
    const length = this.#strip0x(array.length.toString(16))
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

  protected async sendRelayTx (message: MessageStatus): Promise<providers.TransactionResponse> {
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

    const overrides: Overrides = {
      gasLimit: DefaultL1RelayGasLimit
    }
    return this.#l1Amb.executeSignatures(message, packedSigs, overrides)
  }

  protected async getMessage (txHash: string): Promise<Message> {
    const sigEvent = await this.#getValidSigEvent(txHash)
    if (!sigEvent?.args) {
      throw new Error(`args for sigEvent not found for ${txHash}`)
    }

    console.info('found sigEvent event args')
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
