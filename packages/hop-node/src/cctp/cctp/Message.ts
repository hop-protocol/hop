import { BigNumber, providers, utils } from 'ethers'
import {
  CCTP_DOMAIN_MAP,
  getAttestationUrl,
  getMessageTransmitterContract,
  getTokenMessengerContract
} from './utils'
import { Network } from 'src/constants'
import { RequiredEventFilter } from '../indexer/OnchainEventIndexer'
import { Signer } from 'ethers'
import { config as globalConfig } from 'src/config'

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
export type DepositForBurnEventDecoded = {
  amount: BigNumber
  mintRecipient: string
  destinationDomain: BigNumber
  destinationTokenMessenger: string
  destinationCaller: string

}

// TODO: Not global
const MESSAGE_VERSION_CACHE: Record<number, number> = {}

/**
 * CCTP Message utility class. This class exposes all required chain interactions with CCTP
 * contracts while being chain agnostic and stateless.
 */

export class Message {
  // TODO: Do this better and get from SDK
  static DEPOSIT_FOR_BURN_EVENT_SIG = '0x2fa9ca894982930190727e75500a97d8dc500233a5065e0f3126c48fbe0343c0'
  static MESSAGE_RECEIVED_EVENT_SIG = '0x58200b4c34ae05ee816d710053fff3fb75af4395915d3d2a771b24aa10e3cc5d'
  
  // TODO: Get from SDK
  static getDepositForBurnEventFilter(chainId: number): RequiredEventFilter {
    const contract = getTokenMessengerContract(chainId)
    return contract.filters.DepositForBurn() as RequiredEventFilter
  }

  // TODO: Get from SDK
  static getMessageReceivedEventFilter(chainId: number): RequiredEventFilter {
    const contract = getMessageTransmitterContract(chainId)
    return contract.filters.MessageReceived() as RequiredEventFilter
  }

  static getMessageHashFromMessage (message: string): string {
    return utils.keccak256(message)
  }

  static async getMessageBodyVersion (chainId: number): Promise<number> {
    // The value is immutable onchain. An updated value would result in a new address which we would
    // need to change anyway
    if (MESSAGE_VERSION_CACHE[chainId]) {
      return MESSAGE_VERSION_CACHE[chainId]
    }

    const contract = getTokenMessengerContract(chainId)
    const version = await contract.version()

    MESSAGE_VERSION_CACHE[chainId] = version
    return version
  }

  static getMessageFromDepositEvent (messageBodyVersion: number, token: string, recipient: string, amount: BigNumber): string {
    return utils.defaultAbiCoder.encode(
      [
        'uint32',
        'bytes32',
        'bytes32',
        'uint256',
        'bytes32'
      ],
      [
        messageBodyVersion,
        utils.formatBytes32String(token),
        recipient,
        amount,
        utils.formatBytes32String('0x')
      ]
    )
  }

  static decodeDepositForBurnEvent (data: string): DepositForBurnEventDecoded {
    const res = utils.defaultAbiCoder.decode([
      'uint256',
      'bytes32',
      'uint32',
      'bytes32',
      'bytes32'
    ], data)

    return {
      amount: BigNumber.from(res[0]),
      mintRecipient: utils.parseBytes32String(res[1]),
      destinationDomain: BigNumber.from(res[2]),
      destinationTokenMessenger: res[3],
      destinationCaller: res[4]
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
    return MessageTransmitterContract.connect(signer).receiveMessage(message, attestation)
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
      throw new Error('Attestation not complete')
    }

    return json.attestation
  }
}
