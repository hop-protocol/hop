import { type BigNumberish, type providers, type CallOverrides, BigNumber, constants} from 'ethers'
import type { HopStruct } from './types.js'
import { type Chain, type Address, Token } from './types.js'
import {
  type IRailsGateway,
  type IRailsPath,
  getRailsGateway,
  getRailsPath
} from './contracts/index.js'
import { Path } from './types.js'

export class Rails {
  readonly #gateways: Map<Chain, IRailsGateway> = new Map()

  constructor(chains: Chain[]) {
    for (const chain of chains) {
      if (this.#gateways.has(chain)) {
        throw new Error(`Gateway for chain ${chain.chainId} already exists`)
      }
      this.#gateways.set(chain, getRailsGateway(chain.chainId, chain.signerOrProvider))
    }
  }

  /**
   * Instantiation
   */

  static getRailsGateway(chain: Chain): IRailsGateway {
    return getRailsGateway(chain.chainId, chain.signerOrProvider)
  }

  static getRailsPath(chain: Chain, addressOrToken: Address | Token): IRailsPath {
    const address = addressOrToken instanceof Token
      ? addressOrToken.address
      : addressOrToken

    return getRailsPath(address, chain.signerOrProvider)
  }

  #getGateway(chain: Chain): IRailsGateway {
    const gateway = this.#gateways.get(chain)
    if (!gateway) {
      throw new Error(`Gateway for chain ${chain.chainId} not found`)
    }
    return gateway
  }

  /**
   * Methods
   */

  async send(
    path: Path,
    fromChain: Chain,
    toChain: Chain,
    to: Address,
    amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    this.#validateInput(path, fromChain, toChain)
    const hops = this.#getDefaultHops(path, toChain)
    return this.#getGateway(fromChain).send(to, amount, hops, overrides)
  }

  async getAmountOut(
    path: Path,
    fromChain: Chain,
    toChain: Chain,
    amount: BigNumberish,
    claimId: string,
    attestedClaimId?: string
  ): Promise<BigNumber> {
    this.#validateInput(path, fromChain, toChain)

    attestedClaimId ??= await this.getValidHeadClaim(path, fromChain)
    const sourceGateway = this.#getGateway(fromChain)
    const sourcePool = await sourceGateway.getSourcePool(attestedClaimId)
    const sourcePoolTotalFraudulent = await sourceGateway.totalFraudulent()
    return this.#getGateway(toChain).getAmountOut(path.pathId, amount, claimId, sourcePool, sourcePoolTotalFraudulent)
  }

  async getValidHeadClaim(path: Path, chain: Chain): Promise<string> {
    const pathContract = await this.#getRailsPathContract(path, chain)
    const claimId = pathContract.getHeadClaim()

    const isValid = await this.isValidClaim(path, chain, claimId)
    if (!isValid) {
      throw new Error(`Claim ${claimId} is not valid on chain ${chain.chainId}`)
    }
    return claimId
  }

  async isValidClaim(path: Path, chain: Chain, claimId: string): Promise<boolean> {
    const toPathContract = await this.#getRailsPathContract(path, chain)
    const isValidClaim = await toPathContract.isValidClaim(claimId)
    if (!isValidClaim) {
      return false
    }

    const fromChain = path.getOppositeChain(chain)
    const fromPathContract = await this.#getRailsPathContract(path, fromChain)
    const isValidTransfer = fromPathContract.isValidTransfer(claimId)
    if (!isValidTransfer) {
      return false
    }
    return true
  }

  async isClaimPosted(path: Path, toChain: Chain, claimId: string): Promise<boolean> {
    const railsPath = await this.#getRailsPathContract(path, toChain)
    const claim = await railsPath.getClaim(claimId)
    return claim.createdAt.gt(0)
  }

  async isClaimBonded(path: Path, toChain: Chain, claimId: string): Promise<boolean> {
    const railsPath = await this.#getRailsPathContract(path, toChain)
    const claim = await railsPath.getClaim(claimId)
    return claim.bondedBy !== constants.AddressZero
  }

  async #getRailsPathContract(path: Path, chain: Chain): Promise<IRailsPath>{
    const railsPathAddress = await this.#getGateway(chain).getPath(path)
    return getRailsPath(railsPathAddress, chain.signerOrProvider )
  }

  #validateInput(path: Path, fromChain: Chain, toChain: Chain): void {
    if (
      fromChain.eq(toChain) ||
      toChain.eq(fromChain) ||
      !path.hasChains(fromChain, toChain)
    ) {
      throw new Error(`Path does not contain chains ${fromChain.chainId} and ${toChain.chainId}`)
    }
  }

  #getDefaultHops(path: Path, toChain: Chain): HopStruct[] {
    const attestedClaimId = this.getValidHeadClaim(path, toChain)
    return [
      {
        pathId: path.pathId,
        maxBonderFee: BigNumber.from(0), // Placeholder value
        maxTotalSent: BigNumber.from(0), // Placeholder value
        attestedClaimId,
        updater: constants.AddressZero // Placeholder value
      }
    ]
  }
}

