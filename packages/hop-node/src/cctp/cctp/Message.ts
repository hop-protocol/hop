import chainIdToSlug from 'src/utils/chainIdToSlug'
import { BigNumber, providers, utils } from 'ethers'
import {
  CCTP_DOMAIN_MAP,
  getAttestationUrl,
  getHopCCTPContract,
  getMessageTransmitterContract
} from './utils'
import { Chain, MinPolygonGasPrice, Network } from 'src/constants'
import { RequiredEventFilter } from '../indexer/OnchainEventIndexer'
import { Signer } from 'ethers'
import { config as globalConfig } from 'src/config'
import { getRpcProvider } from 'src/utils/getRpcProvider'

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

// TODO: Get from SDK
export type HopCCTPTransferSentDecoded = {
  amount: BigNumber
  bonderFee: BigNumber
}

/**
 * CCTP Message utility class. This class exposes all required chain interactions with CCTP
 * contracts while being chain agnostic and stateless.
 */

// TODO: Sigs are redundant with the filters

export class Message {
  // TODO: Do this better and get from SDK
  static HOP_CCTP_TRANSFER_SENT_SIG = '0x10bf4019e09db5876a05d237bfcc676cd84eee2c23f820284906dd7cfa70d2c4'
  static MESSAGE_SENT_EVENT_SIG = '0x8c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036'
  static MESSAGE_RECEIVED_EVENT_SIG = '0x58200b4c34ae05ee816d710053fff3fb75af4395915d3d2a771b24aa10e3cc5d'

  // TODO: Get from SDK
  static getCCTPTransferSentEventFilter(chainId: number): RequiredEventFilter {
    const contract = getHopCCTPContract(chainId)
    return contract.filters.CCTPTransferSent() as RequiredEventFilter
  }
  
  // TODO: Get from SDK
  static getMessageSentEventFilter(chainId: number): RequiredEventFilter {
    const contract = getMessageTransmitterContract(chainId)
    return contract.filters.MessageSent() as RequiredEventFilter
  }

  // TODO: Get from SDK
  static getMessageReceivedEventFilter(chainId: number): RequiredEventFilter {
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

  static decodeHopCCTPTransferSentFromEvent (data: string):  HopCCTPTransferSentDecoded {
    const res = utils.defaultAbiCoder.decode([
      'uint256',
      'uint256'
    ], data)

    return {
      amount: BigNumber.from(res[0]),
      bonderFee: BigNumber.from(res[1])
    }
  }

  // TODO: Get from SDK
  static convertDomainToChainId (domainId: BigNumber): BigNumber {
    const domainMap = CCTP_DOMAIN_MAP[globalConfig.network as Network]
    if (!domainMap) {
      throw new Error('Domain map not found')
    }

    return BigNumber.from(domainMap[Number(domainId)])
  }

  static async relayMessage (signer: Signer, message: string, attestation: string): Promise<providers.TransactionReceipt> {
    const chainId = await signer.getChainId()
    // Remove this in favor of the contract instance from the SDK when available
    const MessageTransmitterContract = getMessageTransmitterContract(chainId)
    // TODO: Config overrides
    const txOverrides = await Message.getTxOverrides(chainId)
    return MessageTransmitterContract.connect(signer).receiveMessage(message, attestation, txOverrides)
  }

  /**
   * Example API responses:
   * {"error":"Message hash not found"}
   * {"attestation":"PENDING","status":"pending_confirmations"}
   * {"attestation":"0x123...","status":"complete"}
   */
  static async fetchAttestation (messageHash: string): Promise<string> {
    const url = getAttestationUrl(messageHash)
    const res = await fetch(url)
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
  }

  // TODO: rm for config
  static async getTxOverrides (chainId: number): Promise<any>{
    const chainSlug = chainIdToSlug(chainId)
    const provider = getRpcProvider(chainSlug)
    const txOptions: any = {}

    // Not all Polygon nodes follow recommended 30 Gwei gasPrice
    // https://forum.matic.network/t/recommended-min-gas-price-setting/2531
    if (chainSlug === Chain.Polygon) {
      txOptions.gasPrice = await provider.getGasPrice()

      const minGasPrice = BigNumber.from(MinPolygonGasPrice).mul(2)
      const gasPriceBn = BigNumber.from(txOptions.gasPrice)
      if (gasPriceBn.lt(minGasPrice)) {
        txOptions.gasPrice = minGasPrice
      }
    }

    return txOptions
  }
}
