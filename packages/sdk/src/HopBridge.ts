import { ethers, Signer, Contract, BigNumber, BigNumberish } from 'ethers'
import { Chain } from './models'
import {
  l1BridgeAbi,
  l2BridgeAbi,
  saddleLpTokenAbi,
  saddleSwapAbi,
  l2AmmWrapperAbi
} from '@hop-protocol/abi'
import TokenClass from './Token'
import { TChain, TToken, TAmount, TProvider } from './types'
import Base from './Base'
import AMM from './AMM'
import _version from './version'
import { TokenIndex, BondTransferGasCost } from './constants'
import CoinGecko from './CoinGecko'

type SendL1ToL1Input = {
  destinationChain: Chain
  sourceChain: Chain
  amount: number | string
}

type SendL1ToL2Input = {
  destinationChainId: number | string
  sourceChain: Chain
  relayer?: string
  relayerFee?: TAmount
  amount: TAmount
  amountOutMin?: TAmount
  deadline?: number
  recipient?: string
  approval?: boolean
}

type SendL2ToL1Input = {
  destinationChainId: number | string
  sourceChain: Chain
  amount: TAmount
  amountOutMin: TAmount
  destinationAmountOutMin?: TAmount
  deadline?: number
  destinationDeadline?: number
  bonderFee?: TAmount
  recipient?: string
  approval?: boolean
}

type SendL2ToL2Input = {
  destinationChainId: number | string
  sourceChain: Chain
  amount: number | string
  amountOutMin: TAmount
  destinationAmountOutMin?: TAmount
  bonderFee?: TAmount
  deadline?: number
  destinationDeadline?: number
  recipient?: string
  approval?: boolean
}

type SendOptions = {
  deadline: number
  relayer: string
  relayerFee: TAmount
  recipient: string
  amountOutMin: TAmount
  bonderFee: TAmount
  destinationAmountOutMin: TAmount
  destinationDeadline: number
}

/**
 * Class reprensenting Hop bridge.
 * @namespace HopBridge
 */
class HopBridge extends Base {
  /** Token class */
  public token: TokenClass

  /** Hop Token class */
  public hopToken: TokenClass

  /** LP Token class */
  public lpToken: TokenClass

  /** Source Chain model */
  public sourceChain: Chain

  /** Destination Chain model */
  public destinationChain: Chain

  /** Default deadline for transfers */
  public defaultDeadlineMinutes = 30

  /**
   * @desc Instantiates Hop Bridge.
   * Returns a new Hop Bridge instance.
   * @param {String} network - L1 network name (e.g. 'mainnet', 'kovan', 'goerli')
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @param {Object} token - Token symbol or model
   * @param {Object} sourceChain - Source chain model
   * @param {Object} destinationChain - Destination chain model
   * @returns {Object} HopBridge SDK instance.
   * @example
   *```js
   *import { HopBridge, Chain, Token } from '@hop-protocol/sdk'
   *import { Wallet } from 'ethers'
   *
   *const signer = new Wallet(privateKey)
   *const bridge = new HopBridge('kovan', signer, Token.USDC, Chain.Optimism, Chain.xDai)
   *```
   */
  constructor (
    network: string,
    signer: TProvider,
    token: TToken,
    sourceChain?: TChain,
    destinationChain?: TChain
  ) {
    super(network, signer)
    if (!token) {
      throw new Error('token symbol is required')
    }
    token = this.toTokenModel(token)
    if (signer) {
      this.signer = signer
    }
    if (sourceChain) {
      this.sourceChain = this.toChainModel(sourceChain)
    }
    if (destinationChain) {
      this.destinationChain = this.toChainModel(destinationChain)
    }

    // TODO: improve this
    this.token = new TokenClass(
      this.network,
      token.chainId,
      token.address,
      token.decimals,
      token.symbol,
      token.name,
      signer
    )

    this.hopToken = new TokenClass(
      this.network,
      token.chainId,
      token.address,
      token.decimals,
      token.symbol,
      token.name,
      signer,
      'hop'
    )

    this.lpToken = new TokenClass(
      this.network,
      token.chainId,
      token.address,
      token.decimals,
      token.symbol,
      token.name,
      signer,
      'lp'
    )
  }

  /**
   * @desc Returns hop bridge instance with signer connected. Used for adding or changing signer.
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @returns {Object} New HopBridge SDK instance with connected signer.
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
  public connect (signer: Signer) {
    return new HopBridge(
      this.network,
      signer,
      this.token,
      this.sourceChain,
      this.destinationChain
    )
  }

  /**
   * @desc Approve and send tokens to another chain. This will make an approval
   * transaction if not enough allowance.
   * @param {String} tokenAmount - Token amount to send denominated in smallest unit.
   * @param {Object} sourceChain - Source chain model.
   * @param {Object} destinationChain - Destination chain model.
   * @returns {Object} Ethers Transaction object.
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
  public async approveAndSend (
    tokenAmount: TAmount,
    sourceChain?: TChain,
    destinationChain?: TChain,
    options?: Partial<SendOptions>
  ) {
    return this.sendHandler(
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
   * @returns {Object} Ethers Transaction object.
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
  public async send (
    tokenAmount: TAmount,
    sourceChain?: TChain,
    destinationChain?: TChain,
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

    return this.sendHandler(
      tokenAmount.toString(),
      sourceChain,
      destinationChain,
      false,
      options
    )
  }

  public async getSendData (
    amountIn: BigNumberish,
    sourceChain?: TChain,
    destinationChain?: TChain
  ) {
    amountIn = BigNumber.from(amountIn)
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    const hTokenAmount = await this.calcToHTokenAmount(amountIn, sourceChain)

    const amountOutWithoutFeePromise = this.calcFromHTokenAmount(
      hTokenAmount,
      destinationChain
    )

    const amountInNoSlippage = BigNumber.from(1000)
    const amountOutNoSlippagePromise = this.getAmountOut(
      amountInNoSlippage,
      sourceChain,
      destinationChain
    )

    const bonderFeePromise = this.getBonderFee(
      amountIn,
      sourceChain,
      destinationChain
    )

    const [
      amountOutWithoutFee,
      amountOutNoSlippage,
      bonderFee
    ] = await Promise.all([
      amountOutWithoutFeePromise,
      amountOutNoSlippagePromise,
      bonderFeePromise
    ])

    let afterBonderFee
    if (hTokenAmount.gt(bonderFee)) {
      afterBonderFee = hTokenAmount.sub(bonderFee)
    } else {
      afterBonderFee = BigNumber.from(0)
    }
    const amountOut = await this.calcFromHTokenAmount(
      afterBonderFee,
      destinationChain
    )

    const oneBN = ethers.utils.parseUnits('1', this.token.decimals)

    const rateBN = amountIn.eq(0)
      ? BigNumber.from(0)
      : amountOutWithoutFee.mul(oneBN).div(amountIn)

    const rate = Number(ethers.utils.formatUnits(rateBN, this.token.decimals))

    const marketRateBN = amountOutNoSlippage.mul(oneBN).div(amountInNoSlippage)
    const marketRate = Number(
      ethers.utils.formatUnits(marketRateBN, this.token.decimals)
    )

    const priceImpact = ((marketRate - rate) / marketRate) * 100

    return {
      amountOut,
      rate,
      priceImpact,
      bonderFee,
      requiredLiquidity: hTokenAmount
    }
  }

  public async getBonderFee (
    amountIn: BigNumberish,
    sourceChain?: TChain,
    destinationChain?: TChain
  ) {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    if (sourceChain?.isL1) {
      return BigNumber.from(0)
    } else if (destinationChain?.isL1) {
      const ethPrice = await CoinGecko.getPriceByTokenSymbol('WETH')
      const tokenPrice = await CoinGecko.getPriceByTokenSymbol(
        this.token.symbol
      )

      const rate = ethPrice / tokenPrice

      const gasPrice = await this.signer.getGasPrice()
      const txFeeEth = gasPrice.mul(BondTransferGasCost)

      const oneEth = ethers.utils.parseEther('1')
      const rateBN = ethers.utils.parseEther(rate.toString())
      const fee = txFeeEth.mul(rateBN).div(oneEth)

      return fee
    } else {
      return this.getMinBonderFee(
        amountIn.toString(),
        sourceChain,
        destinationChain
      )
    }
  }

  /**
   * @desc Estimate token amount out.
   * @param {String} tokenAmountIn - Token amount input.
   * @param {Object} sourceChain - Source chain model.
   * @param {Object} destinationChain - Destination chain model.
   * @returns {Object} Amount as BigNumber.
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
  public async getAmountOut (
    tokenAmountIn: TAmount,
    sourceChain?: TChain,
    destinationChain?: TChain
  ) {
    tokenAmountIn = BigNumber.from(tokenAmountIn.toString())
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    const hTokenAmount = await this.calcToHTokenAmount(
      tokenAmountIn,
      sourceChain
    )
    const amountOut = await this.calcFromHTokenAmount(
      hTokenAmount,
      destinationChain
    )

    return amountOut
  }

  /**
   * @desc Estimate the bonder liquidity needed at the destination.
   * @param {String} tokenAmountIn - Token amount input.
   * @param {Object} sourceChain - Source chain model.
   * @param {Object} destinationChain - Destination chain model.
   * @returns {Object} Amount as BigNumber.
   * @example
   *```js
   *import { Hop, Chain Token } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bridge = hop.connect(signer).bridge(Token.USDC)
   *const requiredLiquidity = await bridge.getRequiredLiquidity('1000000000000000000', Chain.Optimism, Chain.xDai)
   *console.log(requiredLiquidity)
   *```
   */
  public async getRequiredLiquidity (
    tokenAmountIn: TAmount,
    sourceChain?: TChain
  ): Promise<BigNumber> {
    tokenAmountIn = BigNumber.from(tokenAmountIn.toString())
    sourceChain = this.toChainModel(sourceChain)

    const hTokenAmount = await this.calcToHTokenAmount(
      tokenAmountIn,
      sourceChain
    )

    return hTokenAmount
  }

  /**
   * @desc Returns the suggested bonder fee.
   * @param {Object} amountIn - Token amount input.
   * @param {Object} sourceChain - Source chain model.
   * @param {Object} destinationChain - Destination chain model.
   * @returns {Object} Bonder fee as BigNumber.
   */
  public async getMinBonderFee (
    amountIn: TAmount,
    sourceChain: TChain,
    destinationChain: TChain
  ) {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    if (sourceChain.isL1) {
      return BigNumber.from('0')
    }

    const hTokenAmount = await this.calcToHTokenAmount(
      amountIn.toString(),
      sourceChain
    )
    const l2Bridge = await this.getL2Bridge(sourceChain, this.signer)
    const minBonderBps = await l2Bridge?.minBonderBps()
    const minBonderFeeAbsolute = await l2Bridge?.minBonderFeeAbsolute()
    const minBonderFeeRelative = hTokenAmount.mul(minBonderBps).div(10000)
    const minBonderFee = minBonderFeeRelative.gt(minBonderFeeAbsolute)
      ? minBonderFeeRelative
      : minBonderFeeAbsolute
    return minBonderFee
  }

  /**
   * @desc Returns available liquidity for Hop bridge at specified chain.
   * @param {Object} destinationChain - Destination chain model.
   * @returns {Object} Available liquidity as BigNumber.
   */
  public async getAvailableLiquidity (
    destinationChain: TChain
  ): Promise<BigNumber> {
    const chain = this.toChainModel(destinationChain)
    let bridge: ethers.Contract

    if (chain.isL1) {
      bridge = await this.getL1Bridge()
    } else {
      bridge = await this.getL2Bridge(chain)
    }

    // ToDo: Move bonder address to config
    let bonder = '0xE609c515A162D54548aFe31F4Ec3D951a99cF617'
    if (this.network === 'mainnet') {
      bonder = '0x2A6303e6b99d451Df3566068EBb110708335658f'
    }
    const credit: BigNumber = await bridge.getCredit(bonder)
    const debit: BigNumber = await bridge.getDebitAndAdditionalDebit(bonder)

    if (credit.lt(debit)) {
      return BigNumber.from('0')
    } else {
      return credit.sub(debit)
    }
  }

  /**
   * @desc Sends transaction to execute swap on Saddle contract.
   * @param {Object} sourceChain - Source chain model.
   * @param {Boolean} toHop - Converts to Hop token only if set to true.
   * @param {Object} amount - Amount of token to swap.
   * @param {Object} minAmountOut - Minimum amount of tokens to receive in order
   * for transaction to be successful.
   * @param {Number} deadline - Transaction deadline in seconds.
   * @returns {Object} Ethers transaction object.
   */
  public async execSaddleSwap (
    sourceChain: TChain,
    toHop: boolean,
    amount: TAmount,
    minAmountOut: TAmount,
    deadline: number
  ) {
    sourceChain = this.toChainModel(sourceChain)
    let saddleSwap: Contract
    let tokenIndexFrom: number
    let tokenIndexTo: number

    let l2CanonicalTokenAddress = this.getL2CanonicalTokenAddress(
      this.token,
      sourceChain
    )
    if (!l2CanonicalTokenAddress) {
      throw new Error(`source chain "${sourceChain.slug}" is unsupported`)
    }
    let l2HopBridgeTokenAddress = this.getL2HopBridgeTokenAddress(
      this.token,
      sourceChain
    )
    if (!l2HopBridgeTokenAddress) {
      throw new Error(`source chain "${sourceChain.slug}" is unsupported`)
    }
    saddleSwap = await this.getSaddleSwap(sourceChain, this.signer)
    let canonicalTokenIndex = Number(
      (await saddleSwap.getTokenIndex(l2CanonicalTokenAddress)).toString()
    )
    let hopTokenIndex = Number(
      (await saddleSwap.getTokenIndex(l2HopBridgeTokenAddress)).toString()
    )
    if (toHop) {
      tokenIndexFrom = hopTokenIndex
      tokenIndexTo = canonicalTokenIndex
    } else {
      tokenIndexFrom = canonicalTokenIndex
      tokenIndexTo = hopTokenIndex
    }

    return saddleSwap.swap(
      tokenIndexFrom,
      tokenIndexTo,
      amount,
      minAmountOut,
      deadline
    )
  }

  /**
   * @desc Returns Hop L1 Bridge Ethers contract instance.
   * @param {Object} signer - Ethers signer
   * @returns {Object} Ethers contract instance.
   */
  public async getL1Bridge (signer: TProvider = this.signer) {
    const bridgeAddress = this.getL1BridgeAddress(this.token, Chain.Ethereum)
    if (!bridgeAddress) {
      throw new Error(`token "${this.token.symbol}" is unsupported`)
    }
    const provider = await this.getSignerOrProvider(Chain.Ethereum, signer)
    return new Contract(bridgeAddress, l1BridgeAbi, provider)
  }

  /**
   * @desc Returns Hop L2 Bridge Ethers contract instance.
   * @param {Object} chain - Chain model.
   * @param {Object} signer - Ethers signer
   * @returns {Object} Ethers contract instance.
   */
  public async getL2Bridge (chain: TChain, signer: TProvider = this.signer) {
    chain = this.toChainModel(chain)
    const bridgeAddress = this.getL2BridgeAddress(this.token, chain)
    if (!bridgeAddress) {
      throw new Error(
        `token "${this.token.symbol}" on chain "${chain.slug}" is unsupported`
      )
    }
    const provider = await this.getSignerOrProvider(chain, signer)
    return new Contract(bridgeAddress, l2BridgeAbi, provider)
  }

  /**
   * @desc Returns Hop Bridge AMM wrapper Ethers contract instance.
   * @param {Object} chain - Chain model.
   * @param {Object} signer - Ethers signer
   * @returns {Object} Ethers contract instance.
   */
  public async getAmmWrapper (chain: TChain, signer: TProvider = this.signer) {
    chain = this.toChainModel(chain)
    const ammWrapperAddress = this.getL2AmmWrapperAddress(this.token, chain)
    if (!ammWrapperAddress) {
      throw new Error(
        `token "${this.token.symbol}" on chain "${chain.slug}" is unsupported`
      )
    }
    const provider = await this.getSignerOrProvider(chain, signer)
    return new Contract(ammWrapperAddress, l2AmmWrapperAbi, provider)
  }

  /**
   * @desc Returns Hop Bridge Saddle Swap Ethers contract instance.
   * @param {Object} chain - Chain model.
   * @param {Object} signer - Ethers signer
   * @returns {Object} Ethers contract instance.
   */
  public async getSaddleSwap (chain: TChain, signer: TProvider = this.signer) {
    chain = this.toChainModel(chain)
    const saddleSwapAddress = this.getL2SaddleSwapAddress(this.token, chain)
    if (!saddleSwapAddress) {
      throw new Error(
        `token "${this.token.symbol}" on chain "${chain.slug}" is unsupported`
      )
    }
    const provider = await this.getSignerOrProvider(chain, signer)
    return new Contract(saddleSwapAddress, saddleSwapAbi, provider)
  }

  /**
   * @desc Returns Hop Bridge Saddle reserve amounts.
   * @param {Object} chain - Chain model.
   * @param {Object} signer - Ethers signer
   * @returns {Array} Array containing reserve amounts for canonical token
   * and hTokens.
   */
  public async getSaddleSwapReserves (
    chain: TChain,
    signer: TProvider = this.signer
  ) {
    const saddleSwap = await this.getSaddleSwap(chain, signer)
    return Promise.all([
      saddleSwap.getTokenBalance(0),
      saddleSwap.getTokenBalance(1)
    ])
  }

  /**
   * @desc Returns Hop Bridge Saddle Swap LP Token Ethers contract instance.
   * @param {Object} chain - Chain model.
   * @param {Object} signer - Ethers signer
   * @returns {Object} Ethers contract instance.
   */
  public async getSaddleLpToken (
    chain: TChain,
    signer: TProvider = this.signer
  ) {
    chain = this.toChainModel(chain)
    const saddleLpTokenAddress = this.getL2SaddleLpTokenAddress(
      this.token,
      chain
    )
    if (!saddleLpTokenAddress) {
      throw new Error(
        `token "${this.token.symbol}" on chain "${chain.slug}" is unsupported`
      )
    }
    const provider = await this.getSignerOrProvider(chain, signer)
    return new Contract(saddleLpTokenAddress, saddleLpTokenAbi, provider)
  }

  /**
   * @desc Sends transaction to add liquidity to AMM.
   * @param {Object} amount0Desired - Amount of token #0 in smallest unit
   * @param {Object} amount1Desired - Amount of token #1 in smallest unit
   * @param {Object} chain - Chain model of desired chain to add liquidity to.
   * @param {Object} options - Method options.
   * @returns {Object} Ethers transaction object.
   */
  public async addLiquidity (
    amount0Desired: TAmount,
    amount1Desired: TAmount,
    chain?: TChain,
    options: any = {} // TODO
  ) {
    if (!chain) {
      chain = this.sourceChain
    }
    chain = this.toChainModel(chain)
    const amm = new AMM(this.network, this.token, chain, this.signer)
    return amm.addLiquidity(
      amount0Desired,
      amount1Desired,
      options.minToMint,
      options.deadline
    )
  }

  /**
   * @desc Sends transaction to remove liquidity from AMM.
   * @param {Object} liqudityTokenAmount - Amount of LP tokens to burn.
   * @param {Object} chain - Chain model of desired chain to add liquidity to.
   * @param {Object} options - Method options.
   * @returns {Object} Ethers transaction object.
   */
  public async removeLiquidity (
    liqudityTokenAmount: TAmount,
    chain?: TChain,
    options: any = {} // TODO
  ) {
    if (!chain) {
      chain = this.sourceChain
    }
    chain = this.toChainModel(chain)
    const amm = new AMM(this.network, this.token, chain, this.signer)
    return amm.removeLiquidity(
      liqudityTokenAmount,
      options.amount0Min,
      options.amount1Min,
      options.deadline
    )
  }

  /**
   * @desc Returns the connected signer address.
   * @returns {String} Ethers signer address
   */
  public getSignerAddress () {
    if (!this.signer) {
      throw new Error('signer not connected')
    }
    return (this.signer as Signer)?.getAddress()
  }

  /**
   * @readonly
   * @desc The default deadline to use in seconds.
   * @returns {Number} Deadline in seconds
   */
  public get defaultDeadlineSeconds () {
    return (Date.now() / 1000 + this.defaultDeadlineMinutes * 60) | 0
  }

  private async getTokenIndexes (path: string[], chain: TChain) {
    const saddleSwap = await this.getSaddleSwap(chain)
    let tokenIndexFrom = Number(
      (await saddleSwap.getTokenIndex(path[0])).toString()
    )
    let tokenIndexTo = Number(
      (await saddleSwap.getTokenIndex(path[1])).toString()
    )

    return [tokenIndexFrom, tokenIndexTo]
  }

  private async sendHandler (
    tokenAmount: string,
    sourceChain: TChain,
    destinationChain: TChain,
    approval: boolean = false,
    options?: Partial<SendOptions>
  ) {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    const balance = await this.token.balanceOf(sourceChain)
    if (balance.lt(BigNumber.from(tokenAmount))) {
      throw new Error('not enough token balance')
    }

    // L1 -> L1 or L2
    if (sourceChain.isL1) {
      // L1 -> L1
      if (destinationChain.isL1) {
        return this.sendL1ToL1({
          sourceChain,
          destinationChain,
          amount: tokenAmount
        })
      }
      // L1 -> L2
      return this.sendL1ToL2({
        destinationChainId: destinationChain.chainId,
        sourceChain,
        relayer: options?.relayer ?? ethers.constants.AddressZero,
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
      return this.sendL2ToL1({
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
    return this.sendL2ToL2({
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

  private async sendL1ToL1 (input: SendL1ToL1Input) {
    const { sourceChain, amount } = input
    const recipient = await this.getSignerAddress()
    return this.token.transfer(sourceChain, recipient, amount)
  }

  private async sendL1ToL2 (input: SendL1ToL2Input) {
    let {
      destinationChainId,
      sourceChain,
      relayer,
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
      const tx = await this.token.approve(sourceChain, l1Bridge.address, amount)
      await tx?.wait()
    } else {
      const allowance = await this.token.allowance(
        sourceChain,
        l1Bridge.address
      )
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
      relayer,
      relayerFee || 0,
      this.txOverrides(Chain.Ethereum)
    )
  }

  private async sendL2ToL1 (input: SendL2ToL1Input) {
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
    deadline = deadline || this.defaultDeadlineSeconds
    destinationDeadline = destinationDeadline || 0 // must be 0
    amountOutMin = amountOutMin || '0' // must be 0
    destinationAmountOutMin = destinationAmountOutMin || '0'
    recipient = recipient || (await this.getSignerAddress())
    this.checkConnectedChain(this.signer, sourceChain)
    const ammWrapper = await this.getAmmWrapper(sourceChain, this.signer)

    if (BigNumber.from(bonderFee).gt(amount)) {
      throw new Error('amount must be greater than bonder fee')
    }

    if (approval) {
      const tx = await this.token.approve(
        sourceChain,
        ammWrapper.address,
        amount
      )
      await tx?.wait()
    } else {
      const allowance = await this.token.allowance(
        sourceChain,
        ammWrapper.address
      )
      if (allowance.lt(BigNumber.from(amount))) {
        throw new Error('not enough allowance')
      }
    }

    return ammWrapper.swapAndSend(
      destinationChainId,
      recipient,
      amount,
      bonderFee,
      amountOutMin,
      deadline,
      destinationAmountOutMin,
      destinationDeadline,
      this.txOverrides(sourceChain)
    )
  }

  private async sendL2ToL2 (input: SendL2ToL2Input) {
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
    deadline = deadline || this.defaultDeadlineSeconds
    destinationDeadline = destinationDeadline || deadline
    amountOutMin = amountOutMin || 0
    recipient = recipient || (await this.getSignerAddress())
    if (BigNumber.from(bonderFee).gt(amount)) {
      throw new Error('Amount must be greater than bonder fee')
    }

    this.checkConnectedChain(this.signer, sourceChain)
    const ammWrapper = await this.getAmmWrapper(sourceChain, this.signer)

    if (approval) {
      const tx = await this.token.approve(
        sourceChain,
        ammWrapper.address,
        amount
      )
      await tx?.wait()
    } else {
      const allowance = await this.token.allowance(
        sourceChain,
        ammWrapper.address
      )
      if (allowance.lt(BigNumber.from(amount))) {
        throw new Error('not enough allowance')
      }
    }

    return ammWrapper.swapAndSend(
      destinationChainId,
      recipient,
      amount,
      bonderFee,
      amountOutMin,
      deadline,
      destinationAmountOutMin || 0,
      destinationDeadline,
      this.txOverrides(sourceChain)
    )
  }

  private async calcToHTokenAmount (
    amount: TAmount,
    chain: Chain
  ): Promise<BigNumber> {
    amount = BigNumber.from(amount.toString())
    if (chain.isL1) {
      return amount
    }

    const saddleSwap = await this.getSaddleSwap(chain, this.signer)
    if (amount.eq(0)) {
      return BigNumber.from(0)
    }

    const amountOut = await saddleSwap.calculateSwap(
      TokenIndex.CanonicalToken,
      TokenIndex.HopBridgeToken,
      amount
    )

    return amountOut
  }

  private async calcFromHTokenAmount (
    amount: TAmount,
    chain: Chain
  ): Promise<BigNumber> {
    amount = BigNumber.from(amount.toString())
    if (chain.isL1) {
      return BigNumber.from(amount)
    }

    const saddleSwap = await this.getSaddleSwap(chain, this.signer)
    if (amount.eq(0)) {
      return BigNumber.from(0)
    }
    const amountOut = await saddleSwap.calculateSwap(
      TokenIndex.HopBridgeToken,
      TokenIndex.CanonicalToken,
      amount
    )

    return amountOut
  }

  private async checkConnectedChain (signer: TProvider, chain: Chain) {
    const connectedChainId = await (signer as Signer)?.getChainId()
    if (connectedChainId !== chain.chainId) {
      throw new Error('invalid connected chain id')
    }
  }
}

export default HopBridge
