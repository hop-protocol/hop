import { type BigNumberish, type providers, type CallOverrides, BigNumber, constants } from 'ethers'
import type { HopStruct } from './contracts/index.js'
import {
  type Addressish,
  type Pathish,
  type Chainish,
  getAddress,
  getChain,
  getGateway,
  getPath
} from '#models/index.js'
import {
  type RailsGateway,
  type RailsGatewayFilters,
  type RailsPath,
  getRailsGateway
} from './contracts/index.js'
import { getRPC } from './utils.js'
import type { RPCish } from './types.js'

export class Rails {
  readonly #gateways: Map<string, RailsGateway> = new Map()

  // TODO: Validate chainIds match RPC client chainIds. This is an async operation
  // so it might be better to do this in the constructor.
  constructor(chains: Chainish[], rpcs: RPCish[]) {
    if (chains.length !== rpcs.length) {
      throw new Error('Chains and RPC clients must have the same length')
    }
    // // TODO: It should be possible to do this with just one (i.e. for isClaimBonded())
    // if (chains.length < 2) {
    //   throw new Error('Rails instance requires at least two chains')
    // }

    for (let i = 0; i < chains.length; i++) {
      const chainId = getChain(chains[i]).chainId
      const rpc = getRPC(rpcs[i])

      if (this.#gateways.has(chainId)) {
        throw new Error(`Gateway for chain ${chainId} already exists`)
      }
      this.#gateways.set(chainId, getRailsGateway(chainId, rpc))
    }
  }

  /**
   * Instantiation
   */

  #getRailsGatewayContract(chain: Chainish): RailsGateway {
    const chainId = getChain(chain).chainId
    const gateway = this.#gateways.get(chainId)
    if (!gateway) {
      throw new Error(`Gateway for chain ${chainId} not found`)
    }
    return gateway
  }

  #getRailsPathContract(path: Pathish, chain: Chainish): RailsPath{
    const gateway = getGateway(getChain(chain).chainId)
    const pathAddress = gateway.getPathContractAddress(getPath(path).pathId)
    return this.#getRailsGatewayContract(chain).getPathContract(pathAddress)
  }

  /**
   * Methods
   */

  async send(
    path: Pathish,
    toChain: Chainish,
    to: Addressish,
    amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    const fromChain = getPath(path).getCounterpartChain(toChain)
    this.#validateInput(path, fromChain, toChain)
    this.#requireTwoChains()

    const hops = await this.#getDefaultHops(path, toChain)
    return this.#getRailsGatewayContract(fromChain).send(
      getAddress(to).toString(),
      BigNumber.from(amount),
      hops,
      overrides
    )
  }

  async bond(
    path: Pathish,
    toChain: Chainish,
    claimId: string,
    bonderFee: BigNumberish,
    nextHops: HopStruct[],
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    const fromChain = getPath(path).getCounterpartChain(toChain)
    this.#validateInput(path, fromChain, toChain)
    this.#requireTwoChains()

    return this.#getRailsGatewayContract(toChain).bond(
      getPath(path).pathId,
      claimId,
      BigNumber.from(bonderFee),
      nextHops,
      overrides
    )
  }

  async postClaim(
    path: Pathish,
    toChain: Chainish,
    claimId: string,
    to: Addressish,
    amount: BigNumberish,
    maxBonderFee: BigNumberish,
    attestedClaimId: string,
    sourcePool: BigNumberish,
    sourceTotalFraudulent: BigNumberish,
    nextHopsHash: string,
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    const fromChain = getPath(path).getCounterpartChain(toChain)
    this.#validateInput(path, fromChain, toChain)
    this.#requireTwoChains()

    return this.#getRailsGatewayContract(toChain).postClaim(
      getPath(path).pathId,
      claimId,
      getAddress(to).toString(),
      BigNumber.from(amount),
      BigNumber.from(maxBonderFee),
      getAddress(attestedClaimId).toString(),
      BigNumber.from(sourcePool),
      BigNumber.from(sourceTotalFraudulent),
      getAddress(nextHopsHash).toString(),
      overrides
    )
  }

  async getAmountOut(
    path: Pathish,
    fromChain: Chainish,
    toChain: Chainish,
    amount: BigNumberish,
    claimId: string,
    attestedClaimId?: string
  ): Promise<BigNumber> {
    this.#validateInput(path, fromChain, toChain)
    this.#requireTwoChains()

    attestedClaimId ??= await this.getValidHeadClaimId(path, fromChain)
    const pathContract = this.#getRailsPathContract(path, fromChain)
    const sourcePool = await pathContract.getSourcePool(attestedClaimId)
    const sourcePoolTotalFraudulent = await pathContract.totalFraudulent()
    return this.#getRailsGatewayContract(toChain).getAmountOut(
      getPath(path).pathId,
      BigNumber.from(amount),
      claimId,
      sourcePool,
      sourcePoolTotalFraudulent
    )
  }

  async getValidHeadClaimId(path: Pathish, chain: Chainish): Promise<string> {
    this.#validateInput(path, chain)
    this.#requireTwoChains()

    const pathContract = this.#getRailsPathContract(path, chain)
    const claimId = await pathContract.getHeadClaimId()

    const isValid = await this.isValidClaim(path, chain, claimId)
    if (!isValid) {
      throw new Error(`Claim ${claimId} is not valid on chain ${getChain(chain).chainId}`)
    }
    return claimId
  }

  async isValidClaim(path: Pathish, chain: Chainish, claimId: string): Promise<boolean> {
    this.#validateInput(path, chain)
    this.#requireTwoChains()

    const toPathContract = this.#getRailsPathContract(path, chain)
    const isValidClaim = await toPathContract.isValidClaim(claimId)
    if (!isValidClaim) {
      return false
    }

    const fromChain = getPath(path).getCounterpartChain(chain)
    const fromPathContract = this.#getRailsPathContract(path, fromChain)
    const isValidTransfer = await fromPathContract.isValidTransfer(claimId)
    if (!isValidTransfer) {
      return false
    }
    return true
  }

  async isClaimPosted(path: Pathish, toChain: Chainish, claimId: string): Promise<boolean> {
    this.#validateInput(path, toChain)
    const railsPath = this.#getRailsPathContract(path, toChain)
    const claim = await railsPath.getClaim(claimId)
    return claim.createdAt.gt(0)
  }

  async isClaimBonded(path: Pathish, toChain: Chainish, claimId: string): Promise<boolean> {
    this.#validateInput(path, toChain)
    const railsPath = this.#getRailsPathContract(path, toChain)
    const claim = await railsPath.getClaim(claimId)
    return claim.bondedBy !== constants.AddressZero
  }

  async getRailsPathAddress(path: Pathish, chain: Chainish): Promise<string> {
    this.#validateInput(path, chain)

    const gateway = this.#getRailsGatewayContract(chain)
    return gateway.getPath(getPath(path).pathId)
  }

  async isPathInitialized(path: Pathish): Promise<boolean> {
    this.#requireTwoChains()

    path = getPath(path)
    const chains = path.getChains()
    for (const chain of chains) {
      const gateway = this.#getRailsGatewayContract(chain)
      const isInitialized = await gateway.isPathInitialized(path.pathId)
      if (!isInitialized) {
        return false
      }
    }
    return true
  }

  #validateInput(path: Pathish, chain: Chainish): void
  #validateInput(path: Pathish, fromChain: Chainish, toChain: Chainish): void
  #validateInput(path: Pathish, chainOrFromChain: Chainish, toChain?: Chainish): void {
    path = getPath(path)
    if (!path.hasChain(chainOrFromChain)) {
      throw new Error(`Path does not contain chain ${getChain(chainOrFromChain).chainId}`)
    }

    // If there is only a single chain, no additional checks are needed
    if (!toChain) return

    if (
      getChain(chainOrFromChain).eq(toChain) ||
      getChain(toChain).eq(chainOrFromChain) ||
      !path.hasChains(chainOrFromChain, toChain)
    ) {
      throw new Error(`Path does not contain chains ${getChain(chainOrFromChain).chainId} and ${getChain(toChain).chainId}`)
    }
  }

  async #getDefaultHops(path: Pathish, toChain: Chainish): Promise<HopStruct[]> {
    const attestedClaimId = await this.getValidHeadClaimId(path, toChain)
    return [
      {
        pathId: getPath(path).pathId,
        maxBonderFee: BigNumber.from(0), // Placeholder value
        maxTotalSent: BigNumber.from(0), // Placeholder value
        attestedClaimId,
        updater: constants.AddressZero // Placeholder value
      }
    ]
  }

  // TODO: More native way to do this
  #requireTwoChains(): void {
    if (this.#gateways.size < 2) {
      throw new Error('Rails instance requires at least two chains')
    }
  }
}

