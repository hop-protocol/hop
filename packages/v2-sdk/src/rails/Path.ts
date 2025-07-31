import { type BigNumberish, type CallOverrides, BigNumber, providers, constants } from 'ethers'
import {
  RailsGateway as RailsGatewayContractWithoutChain,
  RailsPath as RailsPathContract
} from '#contracts/index.js'
import type { ClaimStruct, HopStruct, RailsPath } from './types.js'
import { getPathId } from './utils.js'
import type { Chain } from './types.js'
import { getRailsGateway, getRailsPath, formatPathInfo } from './contracts/index.js'

// TODO: Get rid of this and attach chain directly to the gateway
type RailsGatewayContract = RailsGatewayContractWithoutChain & { chain: Chain }

export class Path {
  static readonly #pathCache: Map<string, Path> = new Map()
  readonly pathId: string
  readonly path: RailsPath
  readonly #gateway: RailsGatewayContract
  readonly #counterpartGateway: RailsGatewayContract

  private constructor(path: RailsPath, chain: Chain, counterpartChain: Chain) {
    if (chain.chainId === counterpartChain.chainId) {
      throw new Error('Chain and counterpartChain cannot be the same')
    }

    this.pathId = getPathId(path)
    this.path = path
    const gateway = { ...getRailsGateway(chain.chainId, chain.signerOrProvider), chain }
    const counterpartGateway = { ...getRailsGateway(counterpartChain.chainId, counterpartChain.signerOrProvider), chain: counterpartChain }

    // TODO: Correctly attach chain to the gateway and remove this cast
    this.#gateway = gateway as RailsGatewayContract
    this.#counterpartGateway = counterpartGateway as RailsGatewayContract
  }

  static getPath(pathOrPathId: RailsPath | string): Path | undefined {
    const pathId = typeof pathOrPathId === 'string'
      ? pathOrPathId
      : getPathId(pathOrPathId)

    return Path.#pathCache.get(pathId)
  }

  static createPath(path: RailsPath, chain: Chain, counterpartChain: Chain): Path {
    return Path.#createPath(path, chain, counterpartChain)
  }

  static async createPathById(pathId: string, chain: Chain, counterpartChain: Chain): Promise<Path> {
    const pathContract = getRailsPath(pathId, chain.signerOrProvider)
    const pathInfo = await pathContract.getPathInfo()
    const path = formatPathInfo(pathInfo)
    return Path.#createPath(path, chain, counterpartChain)
  }

  static #createPath(path: RailsPath, chain: Chain, counterpartChain: Chain): Path {
    const pathId = getPathId(path)
    if (Path.#pathCache.has(pathId)) {
      throw new Error(`Path with id ${pathId} already exists`)
    }

    const pathInstance = new Path(path, chain, counterpartChain)
    Path.#pathCache.set(pathId, pathInstance)
    return pathInstance
  }

  async send(
    fromChain: Chain,
    to: string,
    amount: BigNumberish,
    hops: HopStruct[] = [],
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    const gateway = this.#getGatewayForChain(fromChain)
    return gateway.send(to, amount, hops, overrides)
  }

  async postClaim(
    claimId: string,
    to: string,
    amount: BigNumberish,
    maxBonderFee: BigNumberish,
    attestedClaimId: string,
    sourcePool: BigNumberish,
    sourceTotalFraudulent: BigNumberish,
    nextHopsHash: string,
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    const { destinationChain } = await this.#inferClaimChains(claimId)

    const gateway = this.#getGatewayForChain(destinationChain)
    return gateway.postClaim(
      this.pathId,
      claimId,
      to,
      amount,
      maxBonderFee,
      attestedClaimId,
      sourcePool,
      sourceTotalFraudulent,
      nextHopsHash,
      overrides
    )
  }

  async bond(
    claimId: string,
    bonderFee: BigNumberish,
    nextHops: HopStruct[],
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    return this.#gateway.bond(this.pathId, claimId, bonderFee, nextHops, overrides)
  }

  async getAmountOut(
    amount: BigNumberish,
    attestedClaimId: string,
    sourcePool: BigNumberish,
    sourceTotalFraudulent: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber> {
    return this.#gateway.getAmountOut(this.pathId, amount, attestedClaimId, sourcePool, sourceTotalFraudulent, overrides)
  }

  async isClaimPosted(chain: Chain, claimId: string): Promise<boolean> {
    const claim = await this.#getClaim(chain, claimId)
    const createdAt = BigNumber.from(claim.createdAt)
    return BigNumber.from(createdAt).gt(0)
  }

  async isClaimBonded(chain: Chain, claimId: string): Promise<boolean> {
    const claim = await this.#getClaim(chain, claimId)
    return claim.bondedBy !== constants.AddressZero
  }

  async getClaim(chain: Chain, claimId: string): Promise<ClaimStruct> {
    return this.#getClaim(chain, claimId)
  }

  async getHeadClaimId(chain: Chain): Promise<string> {
    const path = await this.#getPathContract(chain)
    return path.getHeadClaimId()
  }

  async isValidClaim(sourceChain: Chain, claimId: string): Promise<boolean> {
    const destinationChain = this.#getCounterpartChain(this.path, sourceChain)
    const destinationPathContract = await this.#getPathContract(destinationChain)
    const headClaimId = await destinationPathContract.getHeadClaimId()

    if (headClaimId === constants.HashZero) {
      throw new Error(`No head claim found on chain ${destinationChain.chainId}`)
    }

    const sourceChainPathContract = await this.#getPathContract(sourceChain)
    return sourceChainPathContract.isValidClaim(claimId)
  }

  async getSourcePool(sourceChain: Chain, claimId: string): Promise<BigNumber> {
    const pathContract = await this.#getPathContract(sourceChain)
    return pathContract.getSourcePool(claimId)
  }

  async totalFraudulent(sourceChain: Chain, claimId: string): Promise<BigNumber> {
    const pathContract = await this.#getPathContract(sourceChain)
    return pathContract.totalFraudulent()
  }

  async getValidAttestedClaimId(sourceChain: Chain): Promise<string> {
    const destinationChain = this.#getCounterpartChain(this.path, sourceChain)
    const destinationPathContract = await this.#getPathContract(destinationChain)
    const headClaimId = await destinationPathContract.getHeadClaimId()  
    const isValid = await this.isValidClaim(sourceChain, headClaimId)
    return isValid ? headClaimId : constants.HashZero
  }

  /**
   * Utils
   */

  async #getPathContract(chain: Chain): Promise<RailsPathContract> {
    const gateway = this.#getGatewayForChain(chain)
    const path = await gateway.getPath(this.pathId)
    return getRailsPath(path, gateway.signer)
  }

  async #getClaim(chain: Chain, claimId: string): Promise<ClaimStruct> {
    const pathContract = await this.#getPathContract(chain)
    return pathContract.getClaim(claimId)
  }

  #getGatewayForChain(chain: Chain): RailsGatewayContract {
    if (chain.chainId === this.#gateway.chain.chainId) {
      return this.#gateway
    } else if (chain.chainId === this.#counterpartGateway.chain.chainId) {
      return this.#counterpartGateway
    }
    throw new Error(`Chain ${chain.chainId} is not part of the path`)
  }

  #getCounterpartChain(path: RailsPath, chain: Chain): Chain {
    if (path.chainId === chain.chainId) {
      return this.#counterpartGateway.chain
    } else if (path.counterpartChainId === chain.chainId) {
      return this.#gateway.chain
    }
    throw new Error(`Chain ${chain.chainId} is not part of the path ${path.chainId}`)
  }

  async #inferClaimChains (claimId: string): Promise<{ sourceChain: Chain, destinationChain: Chain }> {
    const pathContract = await this.#getPathContract(this.#gateway.chain)
    const transfer = await pathContract.functions.getTransfer(claimId)
    if (transfer) {
      return {
        sourceChain: this.#gateway.chain,
        destinationChain: this.#counterpartGateway.chain
      }
    }
    
    const counterpartPathContract = await this.#getPathContract(this.#counterpartGateway.chain)
    const counterpartTransfer = await counterpartPathContract.getTransfer(claimId)
    if (counterpartTransfer) {
      return {
        sourceChain: this.#counterpartGateway.chain,
        destinationChain: this.#gateway.chain
      }
    }

    throw new Error(`Claim with id ${claimId} not found on either chain`)
  }
}
