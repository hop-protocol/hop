import './moduleAlias'
import { providers, Signer, Contract, BigNumber } from 'ethers'
import { Chain, Token, Transfer } from 'src/models'
import { addresses, chains, metadata } from 'src/config'
import l1BridgeArtifact from './abi/L1_Bridge.json'
import l2BridgeArtifact from './abi/L2_Bridge.json'
import uniswapRouterArtifact from './abi/UniswapV2Router02.json'
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

class HopBridge {
  public token: Token
  public signer: Signer
  public sourceChain: Chain
  public destinationChain: Chain
  public defaultDeadlineMinutes = 30

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

  connect (signer: Signer) {
    return new HopBridge(
      signer,
      this.token,
      this.sourceChain,
      this.destinationChain
    )
  }

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
    const bridgeAddress = addresses.tokens[tokenSymbol]['kovan'].l1Bridge
    const l1Bridge = this.getL1Bridge(
      bridgeAddress,
      this.signer.connect(sourceChain.provider)
    )
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
    const uniswapWrapperAddress =
      addresses.tokens[tokenSymbol][sourceChain.slug].uniswapWrapper
    const uniswapWrapper = this.getUniswapWrapper(
      uniswapWrapperAddress,
      this.signer.connect(sourceChain.provider)
    )

    if (BigNumber.from(bonderFee).gt(amount)) {
      throw new Error('amount must be greater than bonder fee')
    }

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

    const uniswapWrapperAddress =
      addresses.tokens[tokenSymbol][sourceChain.slug].uniswapWrapper
    const uniswapWrapper = await this.getUniswapWrapper(
      uniswapWrapperAddress,
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
    const bridgeAddress =
      addresses.tokens[tokenSymbol][sourceChain.slug].l2Bridge
    const l2Bridge = this.getL2Bridge(
      bridgeAddress,
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
    let uniswapRouterAddress
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
      uniswapRouterAddress =
        addresses.tokens[tokenSymbol][destinationChain.slug].uniswapRouter
    } else {
      if (!sourceChain) {
        return BigNumber.from('0')
      }
      let l2CanonicalTokenAddress =
        addresses.tokens[tokenSymbol][sourceChain.slug].l2CanonicalToken
      let l2HopBridgeTokenAddress =
        addresses.tokens[tokenSymbol][sourceChain.slug].l2HopBridgeToken
      path = [l2CanonicalTokenAddress, l2HopBridgeTokenAddress]
      uniswapRouterAddress =
        addresses.tokens[tokenSymbol][sourceChain.slug].uniswapRouter
    }
    uniswapRouter = this.getUniswapRouter(
      uniswapRouterAddress,
      this.signer.connect(sourceChain.provider)
    )
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

  getL1Bridge (bridgeAddress: string, signer: Signer) {
    return new Contract(bridgeAddress, l1BridgeArtifact.abi, signer)
  }

  getL2Bridge (bridgeAddress: string, signer: Signer) {
    return new Contract(bridgeAddress, l2BridgeArtifact.abi, signer)
  }

  getUniswapRouter (uniswapRouterAddress: string, signer: Signer) {
    return new Contract(
      uniswapRouterAddress,
      uniswapRouterArtifact.abi,
      this.signer
    )
  }

  getUniswapWrapper (uniswapWrapperAddress: string, signer: Signer) {
    return new Contract(
      uniswapWrapperAddress,
      uniswapWrapperArtifact.abi,
      signer
    )
  }

  getSignerAddress () {
    return this.signer?.getAddress()
  }

  get defaultDeadlineSeconds () {
    return (Date.now() / 1000 + this.defaultDeadlineMinutes * 60) | 0
  }
}
/**
 * Class reprensenting Hop
 * @namespace Hop
 */
class Hop {
  public signer: Signer
  /**
   * @desc Instantiates Hop SDK.
   * Returns a new Hop SDK instance.
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const hop = new Hop(signer)
   *```
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *import { Wallet } from 'ethers'
   *
   *const signer = new Wallet(privateKey)
   *const hop = new Hop(signer)
   *```
   */
  constructor (signer?: Signer) {
    if (signer) {
      this.signer = signer
    }
  }

  bridge (tokenSymbol: string, sourceChain?: Chain, destinationChain?: Chain) {
    return new HopBridge(
      this.signer,
      tokenSymbol,
      sourceChain,
      destinationChain
    )
  }

  connect (signer: Signer) {
    this.signer = signer
    return new Hop(signer)
  }

  getSignerAddress () {
    return this.signer?.getAddress()
  }

  get version () {
    return _version
  }
}

export default Hop
