import { type BigNumberish, type providers, type CallOverrides, BigNumber, constants} from 'ethers'
import type { HopStruct, RailsPath } from './types.js'
import type { Chain, Address, Token } from './types.js'
import { Path } from './Path.js'

export class Rails {
  readonly #chain: Chain
  readonly #counterpartChain: Chain

  constructor(chain: Chain, counterpartChain: Chain) {
    if (chain.chainId === counterpartChain.chainId) {
      throw new Error('Chain and counterpartChain cannot be the same')
    }

    this.#chain = chain
    this.#counterpartChain = counterpartChain
  }

  async #getPath(pathOrPathId: RailsPath | string): Promise<Path> {
    const maybePath = Path.getPath(pathOrPathId)
    if (maybePath) {
      return maybePath
    }

    if (typeof pathOrPathId === 'string') {
      return Path.createPathById(pathOrPathId, this.#chain, this.#counterpartChain)
    }
    return Path.createPath(pathOrPathId, this.#chain, this.#counterpartChain)
  }

  async send(
    to: Address,
    token: Token,
    amount: BigNumberish,
    toChain: Chain,
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    this.#validateInput(toChain)

    const fromChain = this.#getCounterpartChain(toChain)
    const railsPath = this.#getDefaultRailsPath(fromChain, toChain, token)
    const path = await this.#getPath(railsPath)
    const hops = this.#getDefaultHops(path, toChain)
    return path.send(fromChain, to, amount, hops)
  }

  async getAmountOut(
    to: Address,
    token: Token,
    amount: BigNumberish,
    toChain: Chain
  ): Promise<BigNumber> {
    this.#validateInput(toChain)

    const fromChain = this.#getCounterpartChain(toChain)
    const railsPath = this.#getDefaultRailsPath(fromChain, toChain, token)
    const path = await this.#getPath(railsPath)
    const attestedClaimId = await path.getValidAttestedClaimId(fromChain)
    const sourcePool = await path.getSourcePool(fromChain, attestedClaimId)
    const sourcePoolTotalFraudulent = await path.totalFraudulent(fromChain, attestedClaimId)
    return path.getAmountOut(amount, attestedClaimId, sourcePool, sourcePoolTotalFraudulent)
  }

  #validateInput(chain: Chain): void {
    if (
      chain.chainId !== this.#chain.chainId &&
      chain.chainId !== this.#counterpartChain.chainId
    ) {
      throw new Error(`Chain ${chain.chainId} is not part of the path`)
    }
  }

  #getCounterpartChain(chain: Chain): Chain {
    if (chain.chainId === this.#chain.chainId) {
      return this.#counterpartChain
    } else if (chain.chainId === this.#counterpartChain.chainId) {
      return this.#chain
    }
    throw new Error(`Chain ${chain.chainId} is not part of the path`)
  }

  #getDefaultRailsPath(fromChainId: Chain, toChainId: Chain, token: Token): RailsPath {
    return {
      chainId: fromChainId.chainId, // Assuming Chain has a chainId property
      token: token.address, // Assuming Token has an address property
      counterpartChainId: toChainId.chainId,
      counterpartToken: token.address,
      initialReserve: BigNumber.from(0) // Placeholder value
    }
  }

  #getDefaultHops(path: Path, toChain: Chain): HopStruct[] {
    const attestedClaimId = path.getValidAttestedClaimId(toChain)
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

