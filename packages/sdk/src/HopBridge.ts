import './moduleAlias'
import { providers, Signer, Contract, BigNumber } from 'ethers'
import { Chain, Token, Transfer } from 'src/models'
import { addresses, chains, metadata } from 'src/config'
import { MaxUint256 } from 'src/constants'
import erc20Artifact from './abi/ERC20.json'
import l1BridgeArtifact from './abi/L1_Bridge.json'
import l2BridgeArtifact from './abi/L2_Bridge.json'
import uniswapRouterArtifact from './abi/UniswapV2Router02.json'
import uniswapExchangeArtifact from './abi/UniswapV2Pair.json'
import uniswapWrapperArtifact from './abi/L2_UniswapWrapper.json'
import _version from './version'

type Provider = providers.Provider

type SendL1ToL2Input = {
  destinationChainId: number | string
  sourceChain: Chain
  relayerFee?: number | string
  amount: number | string
  amountOutMin?: number | string
}

type SendL2ToL1Input = {
  destinationChainId: number | string
  sourceChain: Chain
  amount: number | string
  destinationAmountOutMin?: number | string
  bonderFee?: number | string
}

type SendL2ToL2Input = {
  destinationChainId: number | string
  sourceChain: Chain
  amount: number | string
  destinationAmountOutMin?: number | string
  bonderFee?: number | string
}

/**
 * Class reprensenting Hop bridge.
 * @namespace HopBridge
 */
class HopBridge {
  /** Token model */
  public token: Token

  /** Ethers Signer */
  public signer: Signer

  /** Source Chain model */
  public sourceChain: Chain

  /** Destination Chain model */
  public destinationChain: Chain

  /** Default deadline for transfers */
  public defaultDeadlineMinutes = 30

  /**
   * @desc Instantiates Hop Bridge.
   * Returns a new Hop Bridge instance.
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @param {Object|String} token - Token symbol or model
   * @param {Object} sourceChain - Source chain model
   * @param {Object} destinationChain - Destination chain model
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const hop = new Hop(signer)
   *```
   * @example
   *```js
   *import { Hop, Token, Chain } from '@hop-protocol/sdk'
   *import { Wallet } from 'ethers'
   *
   *const signer = new Wallet(privateKey)
   *const bridge = new HopBridge(signer, Token.USDC, Chain.Optimism, Chain.xDai)
   *```
   */
  constructor (
    signer: Signer,
    token: string | Token,
    sourceChain?: Chain,
    destinationChain?: Chain
  ) {
    if (!token) {
      throw new Error('token symbol is required')
    }

    if (typeof token === 'string') {
      const { name, symbol, decimals } = metadata.tokens[token]
      token = new Token(0, '', decimals, name, symbol)
    }

    this.signer = signer
    this.token = token
    if (sourceChain) {
      this.sourceChain = sourceChain
    }
    if (destinationChain) {
      this.destinationChain = destinationChain
    }
  }

  /**
   * @desc Returns hop bridge instance with signer connected. Used for adding or changing signer.
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @example
   *```js
   *import { Hop, Token } from '@hop-protocol/sdk'
   *import { Wallet } from 'ethers'
   *
   *const signer = new Wallet(privateKey)
   *let hop = new Hop()
   * // ...
   *const bridge = hop.bridge(Token.USDC).connect(signer)
   *```
   */
  connect (signer: Signer) {
    return new HopBridge(
      signer,
      this.token,
      this.sourceChain,
      this.destinationChain
    )
  }

  /**
   * @desc Send tokens to another chain.
   * @param {String} tokenAmount - Token amount to send denominated in smallest unit.
   * @param {Object} sourceChain - Source chain model.
   * @param {Object} destinationChain - Destination chain model.
   * @example
   *```js
   *import { Hop, Token } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bridge = hop.connect(signer).bridge(Token.USDC)
   *\// send 1 USDC token from Optimism -> xDai
   *const tx = await bridge.send('1000000000000000000', Chain.Optimism, Chain.xDai)
   *console.log(tx.hash)
   *```
   */
  async send (
    tokenAmount: string | BigNumber,
    sourceChain?: Chain,
    destinationChain?: Chain
  ) {
    tokenAmount = tokenAmount.toString()
    if (!sourceChain) {
      sourceChain = this.sourceChain
    }
    if (!destinationChain) {
      destinationChain = this.destinationChain
    }
    if (!sourceChain) {
      throw new Error('source chain is required')
    }
    if (!destinationChain) {
      throw new Error('destination chain is required')
    }

    // L1 -> L1 or L2
    if (sourceChain.isL1) {
      // L1 -> L1
      if (destinationChain.isL1) {
        throw new Error('not implemented')
      }
      // L1 -> L2
      return this._sendL1ToL2({
        destinationChainId: destinationChain.chainId,
        sourceChain,
        relayerFee: 0,
        amount: tokenAmount,
        amountOutMin: 0
      })
    }
    // else:
    // L2 -> L1 or L2

    // L2 -> L1
    if (destinationChain.isL1) {
      const bonderFee = await this.getBonderFee(
        tokenAmount,
        sourceChain,
        destinationChain
      )
      return this._sendL2ToL1({
        destinationChainId: destinationChain.chainId,
        sourceChain,
        amount: tokenAmount,
        bonderFee
      })
    }

    // L2 -> L2
    const bonderFee = await this.getBonderFee(
      tokenAmount,
      sourceChain,
      destinationChain
    )
    return this._sendL2ToL2({
      destinationChainId: destinationChain.chainId,
      sourceChain,
      amount: tokenAmount,
      bonderFee
    })
  }

  private async _sendL1ToL2 (input: SendL1ToL2Input) {
    const {
      destinationChainId,
      sourceChain,
      relayerFee,
      amount,
      amountOutMin
    } = input
    const tokenSymbol = this.token.symbol
    const deadline = this.defaultDeadlineSeconds
    const recipient = await this.getSignerAddress()
    const l1Bridge = this.getL1Bridge(this.signer.connect(sourceChain.provider))
    return l1Bridge.sendToL2(
      destinationChainId,
      recipient,
      amount || 0,
      amountOutMin || 0,
      deadline,
      relayerFee || 0
    )
  }

  private async _sendL2ToL1 (input: SendL2ToL1Input) {
    const {
      destinationChainId,
      sourceChain,
      amount,
      destinationAmountOutMin,
      bonderFee
    } = input
    const tokenSymbol = this.token.symbol
    const deadline = this.defaultDeadlineSeconds
    const destinationDeadline = '0' // must be 0
    const amountOutIn = '0' // must be 0
    const recipient = await this.getSignerAddress()
    const uniswapWrapper = this.getUniswapWrapper(
      sourceChain,
      this.signer.connect(sourceChain.provider)
    )

    if (BigNumber.from(bonderFee).gt(amount)) {
      throw new Error('amount must be greater than bonder fee')
    }

    //const tokenContract = this.getErc20(sourceChain)
    //let tx = await tokenContract.approve(uniswapWrapper.address, MaxUint256)
    //await tx.wait()

    return uniswapWrapper.swapAndSend(
      destinationChainId,
      recipient,
      amount,
      bonderFee.toString(),
      amountOutIn,
      deadline,
      destinationAmountOutMin || 0,
      destinationDeadline,
      {
        //gasLimit: 1000000
      }
    )
  }

  private async _sendL2ToL2 (input: SendL2ToL2Input) {
    const {
      destinationChainId,
      sourceChain,
      amount,
      destinationAmountOutMin,
      bonderFee
    } = input
    const tokenSymbol = this.token.symbol
    const deadline = this.defaultDeadlineSeconds
    const destinationDeadline = deadline
    const amountOutIn = '0'
    const recipient = await this.getSignerAddress()
    if (BigNumber.from(bonderFee).gt(amount)) {
      throw new Error('Amount must be greater than bonder fee')
    }

    const uniswapWrapper = await this.getUniswapWrapper(
      sourceChain,
      this.signer.connect(sourceChain.provider)
    )
    return uniswapWrapper.swapAndSend(
      destinationChainId,
      recipient,
      amount,
      bonderFee,
      amountOutIn,
      deadline,
      destinationAmountOutMin || 0,
      destinationDeadline
    )
  }

  async getBonderFee (
    amountIn: string,
    sourceChain: Chain,
    destinationChain: Chain
  ) {
    const amountOut = await this._calcAmountOut(
      amountIn,
      true,
      sourceChain,
      destinationChain
    )
    const tokenSymbol = this.token.symbol
    const l2Bridge = this.getL2Bridge(
      sourceChain,
      this.signer.connect(sourceChain.provider)
    )
    const minBonderBps = await l2Bridge?.minBonderBps()
    const minBonderFeeAbsolute = await l2Bridge?.minBonderFeeAbsolute()
    const minBonderFeeRelative = amountOut.mul(minBonderBps).div(10000)
    const minBonderFee = minBonderFeeRelative.gt(minBonderFeeAbsolute)
      ? minBonderFeeRelative
      : minBonderFeeAbsolute
    return minBonderFee
  }

  async _calcAmountOut (
    amount: string,
    isAmountIn: boolean,
    sourceChain: Chain,
    destinationChain: Chain
  ): Promise<BigNumber> {
    const tokenSymbol = this.token.symbol
    let path
    let uniswapRouter
    if (sourceChain.isL1) {
      if (!destinationChain) {
        return BigNumber.from('0')
      }
      let l2CanonicalTokenAddress =
        addresses.tokens[tokenSymbol][destinationChain.slug].l2CanonicalToken
      let l2HopBridgeTokenAddress =
        addresses.tokens[tokenSymbol][destinationChain.slug].l2HopBridgeToken
      path = [l2HopBridgeTokenAddress, l2CanonicalTokenAddress]
      uniswapRouter = this.getUniswapRouter(
        destinationChain,
        this.signer.connect(sourceChain.provider)
      )
    } else {
      if (!sourceChain) {
        return BigNumber.from('0')
      }
      let l2CanonicalTokenAddress =
        addresses.tokens[tokenSymbol][sourceChain.slug].l2CanonicalToken
      let l2HopBridgeTokenAddress =
        addresses.tokens[tokenSymbol][sourceChain.slug].l2HopBridgeToken
      path = [l2CanonicalTokenAddress, l2HopBridgeTokenAddress]
      uniswapRouter = this.getUniswapRouter(
        sourceChain,
        this.signer.connect(sourceChain.provider)
      )
    }
    if (!path) {
      return BigNumber.from('0')
    }
    if (isAmountIn) {
      const amountsOut = await uniswapRouter?.getAmountsOut(amount, path)
      return amountsOut[1]
    } else {
      const amountsIn = await uniswapRouter?.getAmountsIn(amount, path)
      return amountsIn[0]
    }
  }

  getL1Bridge (signer: Signer = this.signer) {
    const tokenSymbol = this.token.symbol
    const bridgeAddress = addresses.tokens[tokenSymbol]['kovan'].l1Bridge
    return new Contract(
      bridgeAddress,
      l1BridgeArtifact.abi,
      signer.connect(Chain.Kovan.provider)
    )
  }

  getL2Bridge (chain: Chain, signer: Signer = this.signer) {
    const tokenSymbol = this.token.symbol
    const bridgeAddress = addresses.tokens[tokenSymbol][chain.slug].l2Bridge
    return new Contract(
      bridgeAddress,
      l2BridgeArtifact.abi,
      signer.connect(chain.provider)
    )
  }

  getUniswapRouter (chain: Chain, signer: Signer = this.signer) {
    const tokenSymbol = this.token.symbol
    const uniswapRouterAddress =
      addresses.tokens[tokenSymbol][chain.slug].l2UniswapRouter
    return new Contract(
      uniswapRouterAddress,
      uniswapRouterArtifact.abi,
      signer.connect(chain.provider)
    )
  }

  getUniswapExchange (chain: Chain, signer: Signer = this.signer) {
    const tokenSymbol = this.token.symbol
    const uniswapExchangeAddress =
      addresses.tokens[tokenSymbol][chain.slug].l2UniswapExchange
    return new Contract(
      uniswapExchangeAddress,
      uniswapExchangeArtifact.abi,
      signer.connect(chain.provider)
    )
  }

  getUniswapWrapper (chain: Chain, signer: Signer = this.signer) {
    const tokenSymbol = this.token.symbol
    const uniswapWrapperAddress =
      addresses.tokens[tokenSymbol][chain.slug].l2UniswapWrapper
    return new Contract(
      uniswapWrapperAddress,
      uniswapWrapperArtifact.abi,
      signer.connect(chain.provider)
    )
  }

  getErc20 (chain: Chain) {
    const tokenSymbol = this.token.symbol
    let tokenAddress: string
    if (chain.isL1) {
      tokenAddress = addresses.tokens[tokenSymbol][chain.slug].l1CanonicalToken
    } else {
      tokenAddress = addresses.tokens[tokenSymbol][chain.slug].l2CanonicalToken
    }

    return new Contract(
      tokenAddress,
      erc20Artifact.abi,
      this.signer.connect(chain.provider)
    )
  }

  getSignerAddress () {
    return this.signer?.getAddress()
  }

  get defaultDeadlineSeconds () {
    return (Date.now() / 1000 + this.defaultDeadlineMinutes * 60) | 0
  }
}

export default HopBridge
