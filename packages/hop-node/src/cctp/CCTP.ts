import { providers, utils } from 'ethers'

const { keccak256 } = utils

enum AttestationStatus {
  PendingConfirmation = 'pending_confirmation',
  Complete = 'complete'
}

interface AttestationResponseSuccess {
  status: AttestationStatus
  attestation: string
}

interface AttestationResponseError {
  error: string
}

type AttestationResponse = AttestationResponseSuccess | AttestationResponseError

export default abstract class CCTP {
  readonly #baseAttestationUrl: string

  readonly #provider: providers.JsonRpcProvider

  constructor (chainId: number) {

    // TODO: How do we get providers?
    this.#provider = new providers.JsonRpcProvider('TODO')

    // TODO: isMainnet, not 1
    const attestationUrlSubdomain = chainId === 1 ? 'iris-api' : 'iris-api-sandbox'
    this.#baseAttestationUrl = `https://${attestationUrlSubdomain}.circle.com/v1/attestations`
  }

  protected async getAttestationForMessage (message: string): Promise<string | undefined> {
    const attestationResponse: AttestationResponse = await this.#getAttestationResponse(message)

    if ('error' in attestationResponse) {
      // TODO: Hanldle case where attestationResponse.error is not defined. Could be:
      // * too early
      // * message doesn't exist (reorg?)

      // Probably throw custom err?
      return
    }

    if (attestationResponse.status !== AttestationStatus.Complete) {
      // TODO: Hanle case...
      return
    }

    return attestationResponse.attestation
  }

  protected async isMessageRelayedInTx (message: string, tx: providers.TransactionReceipt): Promise<boolean> {
    // Ideally we check onchain state, but that requires custom message parsing or additional
    // cache values, so we just check the entire message from the logs instead
    const { logs } = tx
    for (const log of logs) {
      const messageReceivedEventSignature = keccak256('MessageReceived(address,uint32,uint64,bytes32,bytes)')
      if (log.topics[0] !== messageReceivedEventSignature) continue
    
      const messageStartLocation = 192
      const logMessage = '0x' + log.data.slice(messageStartLocation, message.length)
      if (logMessage !== message) continue

      return true
    }
    return false
  }

  async #getAttestationResponse (message: string): Promise<AttestationResponse> {
    const messageHash = keccak256(message)
    const url = `${this.#baseAttestationUrl}/${messageHash}`
    const response = await fetch(url)
    return response.json()
  }
}
