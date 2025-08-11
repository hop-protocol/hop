import { Relayer } from '#relayer/Relayer.js'
import { wallets } from '#wallets/index.js'
import { getTxOverrides } from '#utils/getTxOverrides.js'
import {
  isValidBondTxInputData,
  isValidPostClaimTxInputData,
  isValidRemoveClaimTxInputData,
  isValidReaddClaimTxInputData
} from './utils.js'
import type {
  BondInput,
  PostClaimInput,
  RemoveClaimInput,
  ReaddClaimInput,
  RailsRelayItem
} from './types.js'
import type { Signer, providers } from 'ethers'
import type { ClientName } from '../constants.js'
import { type Path, Rails } from '@hop-protocol/v2-sdk'
import { RailsBonderMethodName } from './types.js'

export class RailsRelayer extends Relayer<RailsBonderMethodName, RailsRelayItem> {
  readonly #rails: Rails

  constructor (name: ClientName, railsPaths: Path[]) {
    super(name)

    const chains = new Set<string>()
    const rpcs = new Set<Signer>()
    for (const railsPath of railsPaths) {
      const chainId = railsPath.chain0.chainId
      chains.add(chainId)
      rpcs.add(wallets.get(chainId))

      const counterpartChainId = railsPath.chain1.chainId
      chains.add(counterpartChainId)
      rpcs.add(wallets.get(counterpartChainId))
    }

    this.#rails = new Rails(Array.from(chains), Array.from(rpcs))
  }

  protected override formatRelayItem(relayTxMethodName: RailsBonderMethodName, relayItem: any): RailsRelayItem {
    switch (relayTxMethodName) {
      case RailsBonderMethodName.Bond:
        return this.#formatBondInput(relayItem)
      case RailsBonderMethodName.PostClaim:
        return this.#formatPostClaimInput(relayItem)
      case RailsBonderMethodName.RemoveClaim:
        return this.#formatRemoveClaimInput(relayItem)
      case RailsBonderMethodName.ReaddClaim:
        return this.#formatReaddClaimInput(relayItem)
      default:
        throw new Error('Invalid relay item')
    }
  }

  protected override async shouldAttemptRelay (
    relayItem: RailsRelayItem,
    relayTxMethodName: RailsBonderMethodName,
    relayChainId: string
  ): Promise<boolean> {
    switch (relayTxMethodName) {
      case RailsBonderMethodName.Bond:
        return this.#canRelayBond(relayItem as BondInput, relayChainId)
      case RailsBonderMethodName.PostClaim:
        return this.#canRelayPostClaim(relayItem as PostClaimInput, relayChainId)
      // TODO
      // case RailsBonderMethodName.RemoveClaim:
      //   return this.#canRelayRemoveClaim(relayItem as RemoveClaimInput, relayChainId)
      // case RailsBonderMethodName.ReaddClaim:
      //   return this.#canRelayReaddClaim(relayItem as ReaddClaimInput, relayChainId)
      default:
        throw new Error('Invalid relay item')
    }
  }

  protected override isImplementationError (err: unknown): boolean {
    return (
      this.#isContractError(err) ||
      this.#isBCRError(err)
    )
  }

  /**
   * External
   */

  override async sendRelay (
    relayItem: RailsRelayItem,
    relayTxMethodName: RailsBonderMethodName,
    relayChainId: string
  ): Promise<providers.TransactionResponse> {
    switch (relayTxMethodName) {
      case RailsBonderMethodName.Bond:
        return this.#sendBond(relayItem as BondInput, relayChainId)
      case RailsBonderMethodName.PostClaim:
        return this.#sendPostClaim(relayItem as PostClaimInput, relayChainId)
        // TODO
      // case RailsBonderMethodName.RemoveClaim:
      //   return this.#sendRemoveClaim(relayItem as RemoveClaimInput, relayChainId)
      // case RailsBonderMethodName.ReaddClaim:
      //   return this.#sendReaddClaim(relayItem as ReaddClaimInput, relayChainId)
      default:
        throw new Error('Invalid relay item')
    }
  }

  /**
   * Internal - Validation
   */

  async #canRelayPostClaim (relayItem: PostClaimInput, relayChainId: string): Promise<boolean> {
    const { pathId, toChainId, claimId } = relayItem
    const isPosted = await this.#rails.isClaimPosted(pathId, toChainId, claimId)
    const isBonded = await this.#rails.isClaimBonded(claimId, toChainId, claimId)
    return !isPosted && !isBonded
  }

  async #canRelayBond (relayItem: BondInput, relayChainId: string): Promise<boolean> {
    const { pathId, toChainId, claimId } = relayItem
    const isPosted = await this.#rails.isClaimPosted(pathId, toChainId, claimId)
    const isBonded = await this.#rails.isClaimBonded(claimId, toChainId, claimId)
    // TODO: If this is true, should we throw?
    return isPosted && !isBonded
  }

  /**
   * Internal - Execution
   */

  async #sendBond (relayItem: BondInput, relayChainId: string): Promise<providers.TransactionResponse> {
    const { pathId, toChainId, claimId, bonderFee, nextHops } = relayItem
    return this.#rails.bond(
      pathId,
      toChainId,
      claimId,
      bonderFee,
      nextHops,
      await getTxOverrides(relayChainId)
    )
  }

  async #sendPostClaim (relayItem: PostClaimInput, relayChainId: string): Promise<providers.TransactionResponse> {
    const { pathId, toChainId, claimId, to, amount, maxBonderFee, attestedClaimId, sourcePool, sourceTotalFraudulent, nextHopsHash } = relayItem
    return this.#rails.postClaim(
      pathId,
      toChainId,
      claimId,
      to,
      amount,
      maxBonderFee,
      attestedClaimId,
      sourcePool,
      sourceTotalFraudulent,
      nextHopsHash,
      await getTxOverrides(relayChainId)
    )
  }

  /**
   * Internal - Format
   */

  #formatBondInput (relayItem: any): BondInput{
    const isValid = isValidBondTxInputData(relayItem)
    if (!isValid) {
      throw new Error('Invalid bond input')
    }

    return {
      pathId: relayItem.pathId,
      claimId: relayItem.claimId,
      bonderFee: relayItem.bonderFee,
      nextHops: relayItem.nextHops
    }
  }

  #formatPostClaimInput (relayItem: any): PostClaimInput {
    const isValid = isValidPostClaimTxInputData(relayItem)
    if (!isValid) {
      throw new Error('Invalid push claim input')
    }
    return {
      pathId: relayItem.pathId,
      claimId: relayItem.claimId,
      to: relayItem.to,
      amount: relayItem.amount,
      maxBonderFee: relayItem.maxBonderFee,
      attestedClaimId: relayItem.attestedClaimId,
      sourcePool: relayItem.sourcePool,
      sourceTotalFraudulent: relayItem.sourceTotalFraudulent,
      nextHopsHash: relayItem.nextHopsHash,
    }
  }

  #formatRemoveClaimInput (relayItem: any): RemoveClaimInput {
    const isValid = isValidRemoveClaimTxInputData(relayItem)
    if (!isValid) {
      throw new Error('Invalid remove claim input')
    }
    return {
      pathId: relayItem.pathId,
      claimId: relayItem.claimId
    }
  }

  #formatReaddClaimInput (relayItem: any): ReaddClaimInput {
    const isValid = isValidReaddClaimTxInputData(relayItem)
    if (!isValid) {
      throw new Error('Invalid readd claim input')
    }
    return {
      pathId: relayItem.pathId,
      claimId: relayItem.claimId,
      transferDataHash: relayItem.transferDataHash
    }
  }

  /**
   * Errors
   */

  #isContractError (err: unknown): boolean {
    if (isContractError(err)) {
      return true
    }
    return true
  }

  #isBCRError (err: unknown): boolean {
    // if (err instanceof BonderChoiceRule.BCRError) {
    //   return true
    // }
    // return false
    return true
  }
}
