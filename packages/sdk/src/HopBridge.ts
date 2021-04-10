import { providers, Signer, Contract, BigNumber } from 'ethers'
import { Chain, Token, Transfer } from './models'
import { addresses, chains, metadata } from './config'
import { MaxUint256 } from './constants'
import erc20Artifact from './abi/ERC20.json'
import l1BridgeArtifact from './abi/L1_Bridge.json'
import l2BridgeArtifact from './abi/L2_Bridge.json'
import uniswapRouterArtifact from './abi/UniswapV2Router02.json'
import uniswapExchangeArtifact from './abi/UniswapV2Pair.json'
import uniswapWrapperArtifact from './abi/L2_UniswapWrapper.json'
import _version from './version'

type Provider = providers.Provider

type SendL1ToL1Input = {
  destinationChain: Chain
  sourceChain: Chain
  amount: number | string
}

type SendL1ToL2Input = {
  destinationChainId: number | string
  sourceChain: Chain
  relayerFee?: number | string | BigNumber
  amount: number | string | BigNumber
  amountOutMin?: number | string | BigNumber
  deadline?: number
  recipient?: string
  approval?: boolean
}

type SendL2ToL1Input = {
  destinationChainId: number | string
  sourceChain: Chain
  amount: number | string | BigNumber
  amountOutMin: number | string | BigNumber
  destinationAmountOutMin?: number | string | BigNumber
  deadline?: number
  destinationDeadline?: number
  bonderFee?: number | string | BigNumber
  recipient?: string
  approval?: boolean
}

type SendL2ToL2Input = {
  destinationChainId: number | string
  sourceChain: Chain
  amount: number | string
  amountOutMin: number | string | BigNumber
  destinationAmountOutMin?: number | string | BigNumber
  bonderFee?: number | string | BigNumber
  deadline?: number
  destinationDeadline?: number
  recipient?: string
  approval?: boolean
}

type SendOptions = {
  deadline: number
  relayerFee: number | string | BigNumber
  recipient: string
  amountOutMin: number | string | BigNumber
  bonderFee: number | string | BigNumber
  destinationAmountOutMin: number | string | BigNumber
  destinationDeadline: number
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
   *import { Hop, Chain, Token } from '@hop-protocol/sdk'
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
      token = new Token(0, '', decimals, symbol, name)
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
   * @desc Returns token allowance.
   * @param {Object} chain - Chain model.
   * @param {String} spender - spender address.
   * @returns Transaction object.
   * @example
   *```js
   *import { Hop, Chain, Token } from '@hop-protocol/sdk'
   *
   *const bridge = hop.bridge(Token.USDC).connect(signer)
   *const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
   *const allowance = bridge.allowance(Chain.xDai, spender)
   *```
   */
  async allowance (chain: Chain, spender: string) {
    const tokenContract = await this.getErc20(chain)
    const address = await this.getSignerAddress()
    return tokenContract.allowance(address, spender)
  }

  /**
   * @desc Returns token balance of signer.
   * @param {Object} chain - Chain model.
   * @param {String} spender - spender address.
   * @returns Transaction object.
   * @example
   *```js
   *import { Hop, Chain, Token } from '@hop-protocol/sdk'
   *
   *const bridge = hop.bridge(Token.USDC).connect(signer)
   *const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
   *const allowance = bridge.allowance(Chain.xDai, spender)
   *```
   */
  async balanceOf (chain: Chain) {
    const tokenContract = await this.getErc20(chain)
    const address = await this.getSignerAddress()
    return tokenContract.balanceOf(address)
  }

  /**
   * @desc ERC20 token transfer
   * @param {Object} chain - Chain model.
   * @param {String} recipient - recipient address.
   * @param {String} amount - Token amount.
   * @returns Transaction object.
   * @example
   *```js
   *import { Hop, Chain, Token } from '@hop-protocol/sdk'
   *
   *const bridge = hop.bridge(Token.USDC).connect(signer)
   *const recipient = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
   *const amount = '1000000000000000000'
   *const allowance = bridge.erc20Transfer(Chain.Kovan, spender, amount)
   *```
   */
  async erc20Transfer (
    chain: Chain,
    recipient: string,
    amount: string | number | BigNumber
  ) {
    const tokenContract = await this.getErc20(chain)
    return tokenContract.transfer(recipient, amount)
  }

  /**
   * @desc Approve address to spend tokens if not enough allowance .
   * @param {Object} chain - Chain model.
   * @param {String} spender - spender address.
   * @param {String} amount - amount allowed to spend.
   * @returns Transaction object.
   * @example
   *```js
   *import { Hop, Chain, Token } from '@hop-protocol/sdk'
   *
   *const bridge = hop.bridge(Token.USDC).connect(signer)
   *const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
   *const amount = '1000000000000000000'
   *const allowance = bridge.approve(Chain.xDai, spender, amount)
   *```
   */
  async approve (
    chain: Chain,
    spender: string,
    amount: string | number | BigNumber = MaxUint256
  ) {
    const tokenContract = await this.getErc20(chain)
    const allowance = await this.allowance(chain, spender)
    if (allowance.lt(BigNumber.from(amount))) {
      return tokenContract.approve(spender, amount)
    }
  }

  /**
   * @desc Approve and send tokens to another chain. This will make an approval
   * transaction if not enough allowance.
   * @param {String} tokenAmount - Token amount to send denominated in smallest unit.
   * @param {Object} sourceChain - Source chain model.
   * @param {Object} destinationChain - Destination chain model.
   * @returns Transaction object.
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
  async approveAndSend (
    tokenAmount: string | BigNumber,
    sourceChain?: Chain,
    destinationChain?: Chain,
    options?: Partial<SendOptions>
  ) {
    return this._send(
      tokenAmount.toString(),
      sourceChain,
      destinationChain,
      true,
      options
    )
  }

  /**
   * @desc Send tokens to another chain.
   * @param {String} tokenAmount - Token amount to send denominated in smallest unit.
   * @param {Object} sourceChain - Source chain model.
   * @param {Object} destinationChain - Destination chain model.
   * @returns Transaction object.
   * @example
   *```js
   *import { Hop, Chain, Token } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bridge = hop.connect(signer).bridge(Token.USDC)
   *\// send 1 USDC token from Optimism -> xDai
   *const tx = await bridge.send('1000000000000000000', Chain.Optimism, Chain.xDai)
   *console.log(tx.hash)
   *```
   */
  async send (
    tokenAmount: number | string | BigNumber,
    sourceChain?: Chain,
    destinationChain?: Chain,
    options?: Partial<SendOptions>
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

    return this._send(
      tokenAmount.toString(),
      sourceChain,
      destinationChain,
      false,
      options
    )
  }

  private async _send (
    tokenAmount: string,
    sourceChain: Chain,
    destinationChain: Chain,
    approval: boolean = false,
    options?: Partial<SendOptions>
  ) {
    const balance = await this.balanceOf(sourceChain)
    if (balance.lt(BigNumber.from(tokenAmount))) {
      throw new Error('not enough token balance')
    }

    // L1 -> L1 or L2
    if (sourceChain.isL1) {
      // L1 -> L1
      if (destinationChain.isL1) {
        return this._sendL1ToL1({
          sourceChain,
          destinationChain,
          amount: tokenAmount
        })
      }
      // L1 -> L2
      return this._sendL1ToL2({
        destinationChainId: destinationChain.chainId,
        sourceChain,
        relayerFee: options?.relayerFee ?? 0,
        amount: tokenAmount,
        amountOutMin: options?.amountOutMin ?? 0,
        deadline: options?.deadline,
        recipient: options?.recipient,
        approval
      })
    }
    // else:
    // L2 -> L1 or L2

    // L2 -> L1
    if (destinationChain.isL1) {
      let bonderFee = options.bonderFee
      if (!bonderFee) {
        bonderFee = await this.getBonderFee(
          tokenAmount,
          sourceChain,
          destinationChain
        )
      }
      return this._sendL2ToL1({
        destinationChainId: destinationChain.chainId,
        sourceChain,
        amount: tokenAmount,
        bonderFee,
        recipient: options.recipient,
        amountOutMin: options.amountOutMin,
        deadline: options.deadline,
        destinationAmountOutMin: options.destinationAmountOutMin,
        destinationDeadline: options.destinationDeadline,
        approval
      })
    }

    // L2 -> L2
    let bonderFee = options.bonderFee
    if (!bonderFee) {
      bonderFee = await this.getBonderFee(
        tokenAmount,
        sourceChain,
        destinationChain
      )
    }
    return this._sendL2ToL2({
      destinationChainId: destinationChain.chainId,
      sourceChain,
      amount: tokenAmount,
      bonderFee,
      recipient: options.recipient,
      amountOutMin: options.amountOutMin,
      deadline: options.deadline,
      destinationAmountOutMin: options.destinationAmountOutMin,
      destinationDeadline: options.destinationDeadline,
      approval
    })
  }

  /**
   * @desc Estimate token amount out.
   * @param {String} tokenAmountIn - Token amount input.
   * @param {Object} sourceChain - Source chain model.
   * @param {Object} destinationChain - Destination chain model.
   * @returns BigNumber object.
   * @example
   *```js
   *import { Hop, Chain Token } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bridge = hop.connect(signer).bridge(Token.USDC)
   *const amountOut = await bridge.getAmountOut('1000000000000000000', Chain.Optimism, Chain.xDai)
   *console.log(amountOut)
   *```
   */
  async getAmountOut (
    tokenAmountIn: string | number | BigNumber,
    sourceChain?: Chain,
    destinationChain?: Chain
  ) {
    const amountOut = await this._calcAmountOut(
      tokenAmountIn.toString(),
      true,
      sourceChain,
      destinationChain
    )

    return amountOut
  }

  private async _sendL1ToL1 (input: SendL1ToL1Input) {
    const { sourceChain, destinationChain, amount } = input
    const recipient = await this.getSignerAddress()
    return this.erc20Transfer(sourceChain, recipient, amount)
  }

  private async _sendL1ToL2 (input: SendL1ToL2Input) {
    let {
      destinationChainId,
      sourceChain,
      relayerFee,
      amount,
      amountOutMin,
      deadline,
      recipient,
      approval
    } = input
    deadline = deadline || this.defaultDeadlineSeconds
    recipient = recipient || (await this.getSignerAddress())
    this.checkConnectedChain(this.signer, sourceChain)
    const l1Bridge = await this.getL1Bridge(this.signer)

    if (approval) {
      const tx = await this.approve(sourceChain, l1Bridge.address, amount)
      await tx?.wait()
    } else {
      const allowance = await this.allowance(sourceChain, l1Bridge.address)
      if (allowance.lt(BigNumber.from(amount))) {
        throw new Error('not enough allowance')
      }
    }

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
    let {
      destinationChainId,
      sourceChain,
      amount,
      destinationAmountOutMin,
      bonderFee,
      recipient,
      amountOutMin,
      deadline,
      destinationDeadline,
      approval
    } = input
    const tokenSymbol = this.token.symbol
    deadline = deadline || this.defaultDeadlineSeconds
    destinationDeadline = destinationDeadline || 0 // must be 0
    amountOutMin = amountOutMin || '0' // must be 0
    destinationAmountOutMin = destinationAmountOutMin || '0'
    recipient = recipient || (await this.getSignerAddress())
    this.checkConnectedChain(this.signer, sourceChain)
    const uniswapWrapper = await this.getUniswapWrapper(
      sourceChain,
      this.signer
    )

    if (BigNumber.from(bonderFee).gt(amount)) {
      throw new Error('amount must be greater than bonder fee')
    }

    if (approval) {
      const tx = await this.approve(sourceChain, uniswapWrapper.address, amount)
      await tx?.wait()
    } else {
      const allowance = await this.allowance(
        sourceChain,
        uniswapWrapper.address
      )
      if (allowance.lt(BigNumber.from(amount))) {
        throw new Error('not enough allowance')
      }
    }

    return uniswapWrapper.swapAndSend(
      destinationChainId,
      recipient,
      amount,
      bonderFee,
      amountOutMin,
      deadline,
      destinationAmountOutMin,
      destinationDeadline,
      {
        //gasLimit: 1000000
      }
    )
  }

  private async _sendL2ToL2 (input: SendL2ToL2Input) {
    let {
      destinationChainId,
      sourceChain,
      amount,
      destinationAmountOutMin,
      bonderFee,
      deadline,
      destinationDeadline,
      amountOutMin,
      recipient,
      approval
    } = input
    const tokenSymbol = this.token.symbol
    deadline = deadline || this.defaultDeadlineSeconds
    destinationDeadline = destinationDeadline || deadline
    amountOutMin = amountOutMin || 0
    recipient = recipient || (await this.getSignerAddress())
    if (BigNumber.from(bonderFee).gt(amount)) {
      throw new Error('Amount must be greater than bonder fee')
    }

    this.checkConnectedChain(this.signer, sourceChain)
    const uniswapWrapper = await this.getUniswapWrapper(
      sourceChain,
      this.signer
    )

    if (approval) {
      const tx = await this.approve(sourceChain, uniswapWrapper.address, amount)
      await tx?.wait()
    } else {
      const allowance = await this.allowance(
        sourceChain,
        uniswapWrapper.address
      )
      if (allowance.lt(BigNumber.from(amount))) {
        throw new Error('not enough allowance')
      }
    }

    return uniswapWrapper.swapAndSend(
      destinationChainId,
      recipient,
      amount,
      bonderFee,
      amountOutMin,
      deadline,
      destinationAmountOutMin || 0,
      destinationDeadline
    )
  }

  async getBonderFee (
    amountIn: number | string | BigNumber,
    sourceChain: Chain,
    destinationChain: Chain
  ) {
    const amountOut = await this._calcAmountOut(
      amountIn.toString(),
      true,
      sourceChain,
      destinationChain
    )
    const tokenSymbol = this.token.symbol
    const l2Bridge = await this.getL2Bridge(sourceChain, this.signer)
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
      uniswapRouter = await this.getUniswapRouter(destinationChain, this.signer)
    } else {
      if (!sourceChain) {
        return BigNumber.from('0')
      }
      let l2CanonicalTokenAddress =
        addresses.tokens[tokenSymbol][sourceChain.slug].l2CanonicalToken
      let l2HopBridgeTokenAddress =
        addresses.tokens[tokenSymbol][sourceChain.slug].l2HopBridgeToken
      path = [l2CanonicalTokenAddress, l2HopBridgeTokenAddress]
      uniswapRouter = await this.getUniswapRouter(sourceChain, this.signer)
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

  async getL1Bridge (signer: Signer = this.signer) {
    const tokenSymbol = this.token.symbol
    const bridgeAddress = addresses.tokens[tokenSymbol]['kovan'].l1Bridge
    const provider = await this.getSignerOrProvider(Chain.Kovan, signer)
    return new Contract(bridgeAddress, l1BridgeArtifact.abi, provider)
  }

  async getL2Bridge (chain: Chain, signer: Signer = this.signer) {
    const tokenSymbol = this.token.symbol
    const bridgeAddress = addresses.tokens[tokenSymbol][chain.slug].l2Bridge
    const provider = await this.getSignerOrProvider(chain, signer)
    return new Contract(bridgeAddress, l2BridgeArtifact.abi, provider)
  }

  async getUniswapRouter (chain: Chain, signer: Signer = this.signer) {
    const tokenSymbol = this.token.symbol
    const uniswapRouterAddress =
      addresses.tokens[tokenSymbol][chain.slug].l2UniswapRouter
    const provider = await this.getSignerOrProvider(chain, signer)
    return new Contract(
      uniswapRouterAddress,
      uniswapRouterArtifact.abi,
      chain.provider
    )
  }

  async getUniswapExchange (chain: Chain, signer: Signer = this.signer) {
    const tokenSymbol = this.token.symbol
    const uniswapExchangeAddress =
      addresses.tokens[tokenSymbol][chain.slug].l2UniswapExchange
    const provider = await this.getSignerOrProvider(chain, signer)
    return new Contract(
      uniswapExchangeAddress,
      uniswapExchangeArtifact.abi,
      provider
    )
  }

  async getUniswapWrapper (chain: Chain, signer: Signer = this.signer) {
    const tokenSymbol = this.token.symbol
    const uniswapWrapperAddress =
      addresses.tokens[tokenSymbol][chain.slug].l2UniswapWrapper
    const provider = await this.getSignerOrProvider(chain, signer)
    return new Contract(
      uniswapWrapperAddress,
      uniswapWrapperArtifact.abi,
      provider
    )
  }

  async getErc20 (chain: Chain) {
    const tokenSymbol = this.token.symbol
    let tokenAddress: string
    if (chain.isL1) {
      tokenAddress = addresses.tokens[tokenSymbol][chain.slug].l1CanonicalToken
    } else {
      tokenAddress = addresses.tokens[tokenSymbol][chain.slug].l2CanonicalToken
    }

    const provider = await this.getSignerOrProvider(chain)
    return new Contract(tokenAddress, erc20Artifact.abi, provider)
  }

  async getSignerOrProvider (chain: Chain, signer: Signer = this.signer) {
    if (!signer) {
      return chain.provider
    }
    const connectedChainId = await signer.getChainId()
    if (connectedChainId !== chain.chainId) {
      return chain.provider
    }
    return this.signer
  }

  async checkConnectedChain (signer: Signer, chain: Chain) {
    const connectedChainId = await signer.getChainId()
    if (connectedChainId !== chain.chainId) {
      throw new Error('invalid connected chain id')
    }
  }

  getSignerAddress () {
    if (!this.signer) {
      throw new Error('signer not connected')
    }
    return this.signer?.getAddress()
  }

  get defaultDeadlineSeconds () {
    return (Date.now() / 1000 + this.defaultDeadlineMinutes * 60) | 0
  }
}

export default HopBridge
