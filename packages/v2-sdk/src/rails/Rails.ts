import { type BigNumberish, type providers, type CallOverrides, BigNumber, constants } from 'ethers'
import type { HopStruct } from './contracts/index.js'
import {
  type Addressish,
  type Pathish,
  type Chainish,
  getChain,
  getPath
} from '#models/index.js'
import {
  type RailsGateway,
  type RailsPath,
  getRailsGateway
} from './contracts/index.js'
import type { RPCClient } from './types.js'

export class Rails {
  readonly #gateways: Map<string, RailsGateway> = new Map()

  // TODO: Validate chainIds match RPC client chainIds. This is an async operation
  // so it might be better to do this in the constructor.
  constructor(chains: Chainish[], rpcClients: RPCClient[]) {
    if (chains.length !== rpcClients.length) {
      throw new Error('Chains and RPC clients must have the same length')
    }

    for (let i = 0; i < chains.length; i++) {
      const chain = getChain(chains[i])
      const rpcClient = rpcClients[i]

      if (this.#gateways.has(chain.chainId)) {
        throw new Error(`Gateway for chain ${chain.chainId} already exists`)
      }
      this.#gateways.set(chain.chainId, getRailsGateway(chain.chainId, rpcClient))
    }
  }

  /**
   * Instantiation
   */

  #getGateway(chain: Chainish): RailsGateway {
    const chainId = getChain(chain).chainId
    const gateway = this.#gateways.get(chainId)
    if (!gateway) {
      throw new Error(`Gateway for chain ${chainId} not found`)
    }
    return gateway
  }

  /**
   * Methods
   */

  async send(
    path: Pathish,
    fromChain: Chainish,
    toChain: Chainish,
    to: Addressish,
    amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    this.#validateInput(path, fromChain, toChain)
    const hops = await this.#getDefaultHops(path, toChain)
    return this.#getGateway(fromChain).send(to, amount, hops, overrides)
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

    attestedClaimId ??= await this.getValidHeadClaimId(path, fromChain)
    const sourceGateway = this.#getGateway(fromChain)
    const pathContract = await this.#getRailsPathContract(path, fromChain)
    const sourcePool = await pathContract.getSourcePool(attestedClaimId)
    const sourcePoolTotalFraudulent = await pathContract.totalFraudulent()
    return this.#getGateway(toChain).getAmountOut(path, amount, claimId, sourcePool, sourcePoolTotalFraudulent)
  }

  async getValidHeadClaimId(path: Pathish, chain: Chainish): Promise<string> {
    const pathContract = await this.#getRailsPathContract(path, chain)
    const claimId = await pathContract.getHeadClaimId()

    const isValid = await this.isValidClaim(path, chain, claimId)
    if (!isValid) {
      throw new Error(`Claim ${claimId} is not valid on chain ${getChain(chain).chainId}`)
    }
    return claimId
  }

  async isValidClaim(path: Pathish, chain: Chainish, claimId: string): Promise<boolean> {
    const toPathContract = await this.#getRailsPathContract(path, chain)
    const isValidClaim = await toPathContract.isValidClaim(claimId)
    if (!isValidClaim) {
      return false
    }

    const fromChain = getPath(path).getCounterpartChain(chain)
    const fromPathContract = await this.#getRailsPathContract(path, fromChain)
    const isValidTransfer = fromPathContract.isValidTransfer(claimId)
    if (!isValidTransfer) {
      return false
    }
    return true
  }

  async isClaimPosted(path: Pathish, toChain: Chainish, claimId: string): Promise<boolean> {
    const railsPath = await this.#getRailsPathContract(path, toChain)
    const claim = await railsPath.getClaim(claimId)
    return claim.createdAt.gt(0)
  }

  async isClaimBonded(path: Pathish, toChain: Chainish, claimId: string): Promise<boolean> {
    const railsPath = await this.#getRailsPathContract(path, toChain)
    const claim = await railsPath.getClaim(claimId)
    return claim.bondedBy !== constants.AddressZero
  }

  async #getRailsPathContract(path: Pathish, chain: Chainish): Promise<RailsPath>{
    return this.#getGateway(chain).getPath(path)
  }

  #validateInput(path: Pathish, fromChain: Chainish, toChain: Chainish): void {
    if (
      getChain(fromChain).eq(toChain) ||
      getChain(toChain).eq(fromChain) ||
      !getPath(path).hasChains(fromChain, toChain)
    ) {
      throw new Error(`Path does not contain chains ${getChain(fromChain).chainId} and ${getChain(toChain).chainId}`)
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
}

