import { NetworkSlug } from '@hop-protocol/core/networks'
import { utils } from 'ethers'

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

  constructor (network: string) {
    const attestationUrlSubdomain = network === NetworkSlug.Mainnet ? 'iris-api' : 'iris-api-sandbox'
    this.#baseAttestationUrl = `https://${attestationUrlSubdomain}.circle.com/v1/attestations`
  }

  protected async getAttestationForMessage (message: string): Promise<string | undefined> {
    const attestationResponse: AttestationResponse = await this.#getAttestationResponse(message)

    if ('error' in attestationResponse) {
      await this.#handleAttestationError()
      // TODO: throw?
      return
    }

    if (attestationResponse.status !== AttestationStatus.Complete) {
      // TODO: Handle case...
      return
    }

    return attestationResponse.attestation
  }

  async #getAttestationResponse (message: string): Promise<AttestationResponse> {
    const messageHash = utils.keccak256(message)
    const url = `${this.#baseAttestationUrl}/${messageHash}`
    const response = await fetch(url)
    return response.json()
  }

  async #handleAttestationError (): Promise<void> {
    // * too early
    // * message doesn't exist (reorg?)
  }
}
