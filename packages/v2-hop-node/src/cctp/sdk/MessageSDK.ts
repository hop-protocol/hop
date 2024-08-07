import type { Signer, providers} from 'ethers'
import { BigNumber, utils } from 'ethers'
import {
  CCTP_DOMAIN_TO_CHAIN_ID_MAP,
  CCTP_CHAIN_ID_TO_DOMAIN_MAP,
  USDC_ADDRESSES,
  TOKEN_MESSENGER_ADDRESSES,
  getAttestationUrl,
  getHopCCTPContract,
  getHopCCTPInterface,
  getCCTPMessageTransmitterContractInterface,
  getMessageTransmitterContract,
  getAttestationTimeFromChainIdMs,
} from './utils.js'
import type { DecodedLogWithContext, RequiredEventFilter } from '#types/index.js'
import { NetworkSlug, ChainSlug, getChain } from '@hop-protocol/sdk'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { SignerConfig } from '#config/index.js'
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
  cctpNonce: number
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
  nonce: number
  sender: string
  messageBody: string
}

export type DecodedEventLogs = HopCCTPTransferSentDecodedWithMessage | HopCCTPTransferReceivedDecoded

export const DEFAULT_START_BLOCK_NUMBER: Record<string, Partial<Record<ChainSlug, number>>> = {
  [NetworkSlug.Mainnet]: {
    [ChainSlug.Ethereum]: 20136183, // 19786200, //19447854,
    [ChainSlug.Optimism]: 121663470, // 119550000, //117499078,
    [ChainSlug.Arbitrum]: 223994580, // 207240000, //190986712,
    [ChainSlug.Base]: 16068187, // 13956000, //11903793,
    [ChainSlug.Polygon]: 58407447, // 56513000, //54729294
  },
  [NetworkSlug.Sepolia]: {
    [ChainSlug.Ethereum]: 5498073,
    [ChainSlug.Optimism]: 9397181,
    [ChainSlug.Arbitrum]: 23788247,
    [ChainSlug.Base]: 7414306
  }
}

/**
 * CCTP Message utility class. This class exposes all required chain interactions with CCTP
 * contracts while being chain agnostic and stateless.
 */

export class MessageSDK {
  static getCCTPTransferSentEventFilter(chainId: string): RequiredEventFilter {
    const contract = getHopCCTPContract(chainId)
    return contract.filters.CCTPTransferSent!() as RequiredEventFilter
  }

  static getMessageSentEventFilter(chainId: string): RequiredEventFilter {
    const contract = getMessageTransmitterContract(chainId)
    return contract.filters.MessageSent!() as RequiredEventFilter
  }

  static getMessageReceivedEventFilter(chainId: string): RequiredEventFilter {
    const contract = getMessageTransmitterContract(chainId)
    return contract.filters.MessageReceived!() as RequiredEventFilter
  }

  static getMessageHashFromMessage (message: string): string {
    return utils.keccak256(message)
  }

  static async relayMessage (signer: Signer, message: string, attestation: string): Promise<providers.TransactionReceipt> {
    const chainId: string = (await signer.getChainId()).toString()
    const MessageTransmitterContract = getMessageTransmitterContract(chainId)
    // TODO: SDK: Config overrides
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
    return mutex.runExclusive(async () => {
    const messageHash = MessageSDK.getMessageHashFromMessage(message)
      const url = getAttestationUrl(messageHash)
      const res = await fetch(url)
      if (res.status === 429) {
        // Temp to handle API rate limit
        await wait(1_000)
      }
      const json: IAttestationResponse | undefined = await res.json()

      if (!json) {
        // This means something was wrong with the message hash encoding
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

  // TODO: SDK: rm for config
  static async getTxOverrides (chainId: string): Promise<any>{
    const provider = getRpcProvider(chainId)
    const txOptions: any = {}

    // Not all Polygon nodes follow recommended 30 Gwei gasPrice
    // https://forum.matic.network/t/recommended-min-gas-price-setting/2531
    const chainSlug = getChain(chainId).slug
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

  static addDecodedTypesAndContextToEvent (log: providers.Log, chainId: string): DecodedLogWithContext {
    let eventName: string = ''
    let decoded: DecodedEventLogs
    if (log.topics[0] === MessageSDK.getCCTPTransferSentEventFilter(chainId).topics[0]) {
      eventName = 'CCTPTransferSent'
      decoded = MessageSDK.parseHopCCTPTransferSentLog(log, chainId)
    } else if (log.topics[0] === MessageSDK.getMessageReceivedEventFilter(chainId).topics[0]) {
      eventName = 'CCTPMessageReceived'
      decoded = MessageSDK.parseHopCCTPTransferReceivedLog(log)
    } else {
      throw new Error('Unknown typed log')
    }

    return {
      ...log,
      context: {
        eventName,
        chainId
      },
      decoded
    }
  }

  // Returns the CCTP message as well as the Hop-specific data
  // eslint-disable-next-line max-lines-per-function
  static parseHopCCTPTransferSentLog (log: providers.Log, chainId: string): HopCCTPTransferSentDecodedWithMessage {
    const iface = getHopCCTPInterface()
    const parsed = iface.parseLog(log)
    const { cctpNonce, chainId: cctpChainId, recipient, amount, bonderFee } = parsed.args

    // Get the message body
    const messageBodyVersion = 0
    const burnToken = utils.hexZeroPad(USDC_ADDRESSES[SignerConfig.network as NetworkSlug]![chainId]!, 32)
    const mintRecipient = utils.hexZeroPad(recipient, 32)
    const messageAmount = amount.sub(bonderFee)
    const messageBodySender = utils.hexZeroPad(getHopCCTPContract(chainId).address, 32)

    const messageBodyTypes = ['uint32', 'bytes32', 'bytes32', 'uint256', 'bytes32']
    const messageBody = utils.solidityPack(messageBodyTypes,
      [
        messageBodyVersion,
        burnToken,
        mintRecipient,
        messageAmount.toString(),
        messageBodySender,
      ]
    )

    // Use the messageBody to get the message
    const messageVersion = 0
    const sourceDomain = MessageSDK.getDomainFromChainId(chainId)

    const messageSender = utils.hexZeroPad(TOKEN_MESSENGER_ADDRESSES[SignerConfig.network as NetworkSlug]![chainId]!, 32)
    const messageRecipient = utils.hexZeroPad(TOKEN_MESSENGER_ADDRESSES[SignerConfig.network as NetworkSlug]![cctpChainId]!, 32)
    const destDomain = MessageSDK.getDomainFromChainId(cctpChainId)
    const destinationCaller = utils.hexZeroPad('0x0000000000000000000000000000000000000000', 32)

    const messageTypes = ['uint32', 'uint32', 'uint32', 'uint64', 'bytes32', 'bytes32', 'bytes32', 'bytes']
    const message = utils.solidityPack(messageTypes,
      [
        messageVersion,
        sourceDomain,
        destDomain,
        cctpNonce,
        messageSender,
        messageRecipient,
        destinationCaller,
        messageBody
      ]
    )

    return {
      cctpNonce: Number(cctpNonce),
      chainId: cctpChainId.toString(),
      recipient,
      amount,
      bonderFee,
      message
    }
  }

  // Returns the CCTP message as well as the Hop-specific data
  static parseHopCCTPTransferReceivedLog (log: providers.Log): HopCCTPTransferReceivedDecoded {
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
      nonce: Number(nonce),
      sender,
      messageBody
    }
  }

  static getChainIdFromDomain (domain: string): string {
    return (CCTP_DOMAIN_TO_CHAIN_ID_MAP[SignerConfig.network as NetworkSlug]![Number(domain)]!).toString()
  }

  static getDomainFromChainId (chainId: string): string {
    return (CCTP_CHAIN_ID_TO_DOMAIN_MAP[SignerConfig.network as NetworkSlug]![Number(chainId)]!).toString()
  }

  static getEnabledDomains (): number[] {
    return Object.keys(CCTP_DOMAIN_TO_CHAIN_ID_MAP[SignerConfig.network as NetworkSlug]!).map(Number)
  }

  static getStartBlockNumber (chainId: string): number {
    const chainSlug = getChain(chainId).slug
    return (DEFAULT_START_BLOCK_NUMBER as any)[SignerConfig.network as NetworkSlug][chainSlug]
  }

  static async isNonceUsed (chainId: string, hashedNonce: string): Promise<boolean> {
    const provider = getRpcProvider(chainId)
    const MessageTransmitterContract = getMessageTransmitterContract(chainId)
    return MessageTransmitterContract.connect(provider).usedNonce(hashedNonce)
  }

  static attestationAvailableTimestampMs (chainId: string): number {
    return getAttestationTimeFromChainIdMs(chainId)
  }
}
