import { Signer, Contract } from 'ethers'
import { saddleSwapAbi } from '@hop-protocol/abi'
import { addresses } from './config'
import { Chain } from './models'
import { TChain, TToken, TAmount, TProvider } from './types'
import TokenClass from './Token'
import Base from './Base'

class AMM extends Base {
  public signer: TProvider
  public chain: Chain
  public token: TokenClass

  constructor (signer: TProvider, token: TToken, chain?: TChain) {
    super()
    if (!token) {
      throw new Error('token symbol is required')
    }
    token = this.toTokenModel(token)
    chain = this.toChainModel(chain)
    if (signer) {
      this.signer = signer
    }
    if (chain) {
      this.chain = chain
    }

    this.token = new TokenClass(
      token.chainId,
      token.address,
      token.decimals,
      token.symbol,
      token.name,
      signer
    )
  }

  connect (signer: TProvider) {
    return new AMM(signer, this.token, this.chain)
  }

  async addLiquidity (
    amount0Desired: TAmount,
    amount1Desired: TAmount,
    minToMint: TAmount = 0,
    deadline: number = this.defaultDeadlineSeconds
  ) {
    const amounts = [amount0Desired, amount1Desired]
    const saddleSwap = await this.getSaddleSwap(this.chain)
    return saddleSwap.addLiquidity(amounts, minToMint, deadline)
  }

  async removeLiquidity (
    liqudityTokenAmount: TAmount,
    amount0Min: TAmount = 0,
    amount1Min: TAmount = 0,
    deadline: number = this.defaultDeadlineSeconds
  ) {
    const saddleSwap = await this.getSaddleSwap(this.chain)
    const amounts = [amount0Min, amount1Min]
    return saddleSwap.removeLiquidity(liqudityTokenAmount, amounts, deadline)
  }

  async getCanonicalTokenAddress () {
    return addresses[this.token.symbol][this.chain.slug].l2CanonicalToken
  }

  async getHopTokenAddress () {
    return addresses[this.token.symbol][this.chain.slug].l2HopBridgeToken
  }

  async getSaddleSwap (chain: TChain) {
    chain = this.toChainModel(chain)
    const tokenSymbol = this.token.symbol
    const saddleSwapAddress = addresses[tokenSymbol][chain.slug].l2SaddleSwap
    const provider = await this.getSignerOrProvider(chain)
    return new Contract(saddleSwapAddress, saddleSwapAbi, provider)
  }

  async getSignerOrProvider (chain: TChain, signer: TProvider = this.signer) {
    chain = this.toChainModel(chain)
    if (!signer) {
      return chain.provider
    }
    if (signer instanceof Signer) {
      if (!signer.provider) {
        return signer.connect(chain.provider)
      }
      const connectedChainId = await signer.getChainId()
      if (connectedChainId !== chain.chainId) {
        return chain.provider
      }
    }
    return signer
  }

  getSignerAddress () {
    if (!this.signer) {
      throw new Error('signer not connected')
    }
    return (this.signer as Signer)?.getAddress()
  }

  get defaultDeadlineSeconds () {
    const defaultDeadlineMinutes = 30
    return (Date.now() / 1000 + defaultDeadlineMinutes * 60) | 0
  }
}

export default AMM
