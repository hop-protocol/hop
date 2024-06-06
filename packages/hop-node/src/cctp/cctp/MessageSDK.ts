import type { Signer, providers} from 'ethers'
import { BigNumber, utils } from 'ethers'
import {
  CCTP_DOMAIN_MAP,
  getAttestationUrl,
  getHopCCTPContract,
  getHopCCTPInterface,
  getCCTPMessageTransmitterContractInterface,
  getMessageTransmitterContract,
} from './utils.js'
import type { LogWithChainId, RequiredEventFilter, RequiredFilter } from '../types.js'
import { type NetworkSlug, ChainSlug, getChain } from '@hop-protocol/sdk'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { config as globalConfig } from '#config/index.js'
import { Mutex } from 'async-mutex'
import { wait } from '#utils/wait.js'
import { MIN_POLYGON_GAS_PRICE } from '#constants/index.js'

// Temp to handle API rate limit
const mutex = new Mutex()

enum AttestationStatus {
  PendingConfirmation = 'pending_confirmation',
  Complete = 'complete'
}

interface IAttestationResponseError {
  error: string
}

interface IAttestationResponseSuccess {
  status: AttestationStatus
  attestation: string
}

type IAttestationResponse = IAttestationResponseError | IAttestationResponseSuccess

export type HopCCTPTransferSentDecoded = {
  cctpNonce: BigNumber
  chainId: string
  recipient: string
  amount: BigNumber
  bonderFee: BigNumber
}

export type HopCCTPTransferSentDecodedWithMessage = HopCCTPTransferSentDecoded & {
  message: string
}

export type HopCCTPTransferReceivedDecoded = {
  caller: string
  sourceDomain: string
  nonce: BigNumber
  sender: string
  messageBody: string
}


/**
 * CCTP Message utility class. This class exposes all required chain interactions with CCTP
 * contracts while being chain agnostic and stateless.
 */

// TODO: Sigs are redundant with the filters

export class MessageSDK {
  // TODO: Do this better and get from SDK
  static HOP_CCTP_TRANSFER_SENT_SIG = '0x10bf4019e09db5876a05d237bfcc676cd84eee2c23f820284906dd7cfa70d2c4'
  static MESSAGE_SENT_EVENT_SIG = '0x8c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036'
  static MESSAGE_RECEIVED_EVENT_SIG = '0x58200b4c34ae05ee816d710053fff3fb75af4395915d3d2a771b24aa10e3cc5d'

  // TODO: Get from SDK
  static getCCTPTransferSentEventFilter(chainId: string): RequiredEventFilter {
    const contract = getHopCCTPContract(chainId)
    return contract.filters.CCTPTransferSent() as RequiredEventFilter
  }

  static getMessageSentEventFilter(chainId: string): RequiredEventFilter {
    const contract = getMessageTransmitterContract(chainId)
    return contract.filters.MessageSent() as RequiredEventFilter
  }

  static getMessageReceivedEventFilter(chainId: string): RequiredEventFilter {
    const contract = getMessageTransmitterContract(chainId)
    return contract.filters.MessageReceived() as RequiredEventFilter
  }

  // TODO: better name, not just "event"
  static decodeMessageFromEvent (encodedMessage: string): string {
    const decoded = utils.defaultAbiCoder.decode(['bytes'], encodedMessage)
    return decoded[0]
  }

  static getMessageHashFromMessage (message: string): string {
    return utils.keccak256(message)
  }

  static convertDomainToChainId (domainId: BigNumber): BigNumber {
    const domainMap = CCTP_DOMAIN_MAP[globalConfig.network as NetworkSlug]
    if (!domainMap) {
      throw new Error('Domain map not found')
    }

    return BigNumber.from(domainMap[Number(domainId)])
  }

  static async relayMessage (signer: Signer, message: string, attestation: string): Promise<providers.TransactionReceipt> {
    const chainId: string = (await signer.getChainId()).toString()
    const MessageTransmitterContract = getMessageTransmitterContract(chainId)
    // TODO: Config overrides
    const txOverrides = await MessageSDK.getTxOverrides(chainId)
    return MessageTransmitterContract.connect(signer).receiveMessage(message, attestation, txOverrides)
  }

  /**
   * Example API responses:
   * {"error":"Message hash not found"}
   * {"attestation":"PENDING","status":"pending_confirmations"}
   * {"attestation":"0x123...","status":"complete"}
   */
  static async fetchAttestation (message: string): Promise<string> {
    return await mutex.runExclusive(async () => {
    const messageHash = MessageSDK.getMessageHashFromMessage(message)
      const url = getAttestationUrl(messageHash)
      const res = await fetch(url)
      if (res.status === 429) {
        // Temp to handle API rate limit
        await wait(2_000)
      }
      const json: IAttestationResponse = await res.json()

      if (!json) {
        throw new Error('Message hash not found')
      }

      if ('error' in json) {
        throw new Error(json.error)
      }

      if (json.status !== 'complete') {
        throw new Error(`Attestation not complete: ${JSON.stringify(json)} (messageHash: ${messageHash})`)
      }

      return json.attestation
    })
  }

  // TODO: rm for config
  static async getTxOverrides (chainId: string): Promise<any>{
    const chainSlug = getChain(chainId).slug
    const provider = getRpcProvider(chainSlug)
    const txOptions: any = {}

    // Not all Polygon nodes follow recommended 30 Gwei gasPrice
    // https://forum.matic.network/t/recommended-min-gas-price-setting/2531
    if (chainSlug === ChainSlug.Polygon) {
      txOptions.gasPrice = await provider.getGasPrice()

      const minGasPrice = BigNumber.from(MIN_POLYGON_GAS_PRICE).mul(2)
      const gasPriceBn = BigNumber.from(txOptions.gasPrice)
      if (gasPriceBn.lt(minGasPrice)) {
        txOptions.gasPrice = minGasPrice
      }
    }

    return txOptions
  }

  static isTypedLog (log: LogWithChainId): boolean {
    return (
      log.topics[0] === MessageSDK.HOP_CCTP_TRANSFER_SENT_SIG ||
      log.topics[0] === MessageSDK.MESSAGE_RECEIVED_EVENT_SIG
    )
  }

  static async getTypedLog (log: LogWithChainId): Promise<HopCCTPTransferSentDecodedWithMessage | HopCCTPTransferReceivedDecoded> {
    if (log.topics[0] === MessageSDK.HOP_CCTP_TRANSFER_SENT_SIG) {
      return MessageSDK.parseHopCCTPTransferSentLog(log)
    } else if (log.topics[0] === MessageSDK.MESSAGE_RECEIVED_EVENT_SIG) {
      return MessageSDK.parseHopCCTPTransferReceivedLog(log)
    }

    throw new Error('Unknown typed log')
  }
  // Returns the CCTP message as well as the Hop-specific data
  static async parseHopCCTPTransferSentLog (log: LogWithChainId): Promise<HopCCTPTransferSentDecodedWithMessage> {
    const iface = getHopCCTPInterface()
    const parsed = iface.parseLog(log)

    const {
      cctpNonce,
      chainId,
      recipient,
      amount,
      bonderFee
    } = parsed.args

    const messages = await MessageSDK.getCCTPMessagesByTxHash(log.chainId, log.transactionHash)
    const message = MessageSDK.getMatchingMessageFromMessages(messages, cctpNonce, recipient)

    return {
      cctpNonce,
      chainId,
      recipient,
      amount,
      bonderFee,
      message
    }
  }

  // Returns the CCTP message as well as the Hop-specific data
  static async parseHopCCTPTransferReceivedLog (log: LogWithChainId): Promise<HopCCTPTransferReceivedDecoded> {
    const iface = getCCTPMessageTransmitterContractInterface()
    const parsed = iface.parseLog(log)

    const {
      caller,
      sourceDomain,
      nonce,
      sender,
      messageBody
    } = parsed.args

    return {
      caller,
      sourceDomain,
      nonce,
      sender,
      messageBody
    }
  }

  // TODO: This shouldn't be public, but everything else is static...
  static async getCCTPMessagesByTxHash (chainId: string, txHash: string): Promise<string[]> {
    const chainSlug = getChain(chainId).slug
    const provider = getRpcProvider(chainSlug)
    const txReceipt = await provider.getTransactionReceipt(txHash)
    const blockNumber = txReceipt.blockNumber

    const eventFilter = MessageSDK.getMessageSentEventFilter(chainId)
    const filter: RequiredFilter = {
      ...eventFilter,
      fromBlock: blockNumber,
      toBlock: blockNumber
    }
    const logs = await provider.getLogs(filter)
    if (logs.length === 0) {
      throw new Error('No logs found')
    }

    const messages: string[] = []
    for (const log of logs) {
      if (log.transactionHash === txHash) {
        messages.push(MessageSDK.decodeMessageFromEvent(log.data))
      }
    }

    if (messages.length === 0) {
      throw new Error('No messages found')
    }

    return messages
  }

  // TODO: Not static
  // Find the correct message if there are multiple messages in a tx hash. This does not work if there
  // are multiple messages with the same recipient and a matching hex nonce in the string, which should be rare.
  static getMatchingMessageFromMessages (
    messages: string[],
    cctpNonce: BigNumber,
    recipient: string
  ): string {
    const recipientHex = recipient.substring(2).toLowerCase()
    const cctpNonceHex = cctpNonce.toHexString().substring(2).toLowerCase()

    for (const message of messages) {
      if (
        message.includes(cctpNonceHex) &&
        message.includes(recipientHex)
      ) {
        return message
      }
    }
    throw new Error('No matching message found')
  }
}
