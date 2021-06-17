import ConvertOption, { DetailRow } from './ConvertOption'
import { formatUnits } from 'ethers/lib/utils'
import Network from 'src/models/Network'
import { Hop, HopBridge, Token } from '@hop-protocol/sdk'
import { Signer, BigNumber, BigNumberish } from 'ethers'
import { commafy } from 'src/utils'

class AmmConvertOption extends ConvertOption {
  readonly name: string
  readonly slug: string
  readonly path: string

  constructor () {
    super()

    this.name = 'AMM'
    this.slug = 'amm'
    this.path = '/amm'
  }

  async getTargetAddress (
    sdk: Hop,
    l1TokenSymbol: string | undefined,
    sourceNetwork: Network | undefined,
    destNetwork: Network | undefined
  ): Promise<string> {
    if (!l1TokenSymbol) {
      throw new Error('Token is required to get target address')
    }

    if (!sourceNetwork) {
      throw new Error('sourceNetwork is required to get target address')
    }

    const bridge = sdk.bridge(l1TokenSymbol)
    const amm = bridge.getAmm(sourceNetwork.slug)
    const swap = await amm.getSaddleSwap()
    return swap.address
  }

  async calcAmountOut (
    sdk: Hop,
    sourceNetwork: Network,
    destNetwork: Network,
    isForwardDirection: boolean,
    l1TokenSymbol: string,
    value: BigNumberish
  ) {
    const bridge = await sdk
      .bridge(l1TokenSymbol)

    const amm = bridge.getAmm(sourceNetwork.slug)
    let amountOut
    if (isForwardDirection) {
      amountOut = await amm.calculateToHToken(value)
    } else {
      amountOut = await amm.calculateFromHToken(value)
    }

    return amountOut
  }

  async convert (
    sdk: Hop,
    signer: Signer,
    sourceNetwork: Network,
    destNetwork: Network,
    isForwardDirection: boolean,
    l1TokenSymbol: string,
    value: string
  ) {
    const bridge = await sdk
      .bridge(l1TokenSymbol)
      .connect(signer as Signer)

    const amountOutMin = 0
    const deadline = (Date.now() / 1000 + 300) | 0

    return bridge.execSaddleSwap(
      sourceNetwork.slug,
      isForwardDirection,
      value,
      amountOutMin,
      deadline
    )
  }

  async sourceToken (isForwardDirection: boolean, network?: Network, bridge?: HopBridge): Promise<Token | undefined> {
    if (!bridge || !network) return

    if (isForwardDirection) {
      return bridge.getCanonicalToken(network.slug)
    } else {
      return bridge.getL2HopToken(network.slug)
    }
  }

  async destToken (isForwardDirection: boolean, network?: Network, bridge?: HopBridge): Promise<Token | undefined> {
    if (!bridge || !network) return

    if (isForwardDirection) {
      return bridge.getL2HopToken(network.slug)
    } else {
      return bridge.getCanonicalToken(network.slug)
    }
  }

  async getDetails (
    sdk: Hop,
    amountIn: BigNumberish | undefined,
    sourceNetwork: Network | undefined,
    destNetwork: Network | undefined,
    isForwardDirection: boolean,
    l1TokenSymbol: string
  ): Promise<DetailRow[]> {
    let rateDisplay = '-'
    let slippageToleranceDisplay = '-'
    let priceImpactDisplay = '-'
    let amountOutMinDisplay = '-'
    let feeDisplay = '-'

    // ToDo: Enable configurable slippage tolerance
    const slippageTolerance = 1

    if (
      amountIn &&
      sourceNetwork &&
      destNetwork &&
      slippageTolerance
    ) {
      amountIn = BigNumber.from(amountIn)
      const bridge = await sdk
        .bridge(l1TokenSymbol)

      const {
        rate,
        priceImpact,
        amountOutMin,
        lpFeeAmount
      } = await bridge.getAmmData(
        sourceNetwork.slug,
        amountIn,
        isForwardDirection,
        slippageTolerance
      )

      rateDisplay = rate === 0 ? '-' : commafy(rate, 4)
      slippageToleranceDisplay = `${slippageTolerance}%`
      priceImpactDisplay = priceImpact < 0.01
        ? '<0.01%'
        : `${commafy(priceImpact)}%`

      const sourceToken = isForwardDirection
        ? bridge.getCanonicalToken(destNetwork.slug)
        : bridge.getL2HopToken(destNetwork.slug)
      const destToken = isForwardDirection
        ? bridge.getL2HopToken(destNetwork.slug)
        : bridge.getCanonicalToken(destNetwork.slug)
      amountOutMinDisplay = toTokenDisplay(amountOutMin, destToken)
      feeDisplay = toTokenDisplay(lpFeeAmount, sourceToken)
    }

    return [
      {
        title: 'Rate',
        tooltip: 'The rate for the token taking trade size into consideration.',
        value: rateDisplay
      },
      {
        title: 'Slippage Tolerance',
        tooltip: 'Your transaction will revert if the price changes unfavorably by more than this percentage.',
        value: slippageToleranceDisplay
      },
      {
        title: 'Price Impact',
        tooltip: 'The difference between the market price and estimated price due to trade size.',
        value: priceImpactDisplay
      },
      {
        title: 'Minimum received',
        tooltip: 'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
        value: amountOutMinDisplay
      },
      {
        title: 'Fee',
        tooltip: 'This fee goes towards the Bonder who bonds the transfer on the destination chain.',
        value: feeDisplay
      }
    ]
  }
}

const toTokenDisplay = (num: BigNumber, token: Token) => {
  const formatted = commafy(
    formatUnits(num, token.decimals),
    4
  )

  return `${formatted} ${token.symbol}`
}

export default AmmConvertOption
