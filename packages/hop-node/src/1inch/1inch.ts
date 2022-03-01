import Logger from 'src/logger'
import Token from 'src/watchers/classes/Token'
import chainSlugToId from 'src/utils/chainSlugToId'
import contracts from 'src/contracts'
import fetch from 'node-fetch'
import getCanonicalTokenSymbol from 'src/utils/getCanonicalTokenSymbol'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import serializeQueryParams from 'src/utils/serializeQueryParams'
import wallets from 'src/wallets'
import { BigNumber } from 'ethers'
import { Chain, nativeChainTokens } from 'src/constants'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'

const logger = new Logger({
  tag: '1inch'
})

type QuoteParams = {
  fromTokenAddress: string
  toTokenAddress: string
  amount: string
}

type AllowanceParams = {
  tokenAddress: string
  walletAddress: string
}

type ApproveParams = {
  tokenAddress: string
  amount: string
}

type SwapParams = {
  fromTokenAddress: string
  toTokenAddress: string
  fromAddress: string
  amount: string
  slippage: number
  destReceiver: string
}

class OneInch {
  baseUrl: string = 'https://api.1inch.exchange/v4.0'
  chainId: number

  constructor (chain: string) {
    const chainId = chainSlugToId(chain)
    if (!chainId) {
      throw new Error('chain is invalid')
    }

    this.chainId = chainId
  }

  constructUrl (path: string, params: any) {
    const serializedParams = serializeQueryParams(params, { omitFalsy: true })
    const url = `${this.baseUrl}/${this.chainId}${path}?${serializedParams}`
    return url
  }

  async getJson (url: string) {
    logger.debug('url:', url)
    const res = await fetch(url)
    const json = await res.json()
    if (!json) {
      throw new Error('no response')
    }
    if (json.error) {
      logger.error(json)
      throw new Error(json.description || json.error)
    }

    return json
  }

  async getQuote (params: QuoteParams) {
    const { fromTokenAddress, toTokenAddress, amount } = params
    if (!this.chainId) {
      throw new Error('chainId is required')
    }
    if (!fromTokenAddress) {
      throw new Error('fromTokenAddrss is required')
    }
    if (!toTokenAddress) {
      throw new Error('toTokenAddress is required')
    }
    if (!amount) {
      throw new Error('amount is required')
    }

    const url = this.constructUrl('/quote', {
      fromTokenAddress,
      toTokenAddress,
      amount
    })
    const result = await this.getJson(url)
    if (!result.toTokenAmount) {
      logger.error(result)
      throw new Error('expected tx data')
    }

    return result
  }

  async getAllowance (params: AllowanceParams) {
    const { tokenAddress, walletAddress } = params
    if (!this.chainId) {
      throw new Error('chainId is required')
    }
    if (!tokenAddress) {
      throw new Error('tokenAddress required')
    }
    if (!walletAddress) {
      throw new Error('walletAddress is required')
    }

    const url = this.constructUrl('/approve/allowance', {
      tokenAddress,
      walletAddress
    })
    const result = await this.getJson(url)

    if (result.allowance === undefined) {
      logger.error(result)
      throw new Error('expected tx data')
    }

    return result.allowance
  }

  async getApproveTx (params: ApproveParams) {
    const { tokenAddress, amount } = params
    if (!this.chainId) {
      throw new Error('chainId is required')
    }
    if (!tokenAddress) {
      throw new Error('tokenAddress required')
    }
    if (!amount) {
      throw new Error('amount is required')
    }

    const url = this.constructUrl('/approve/transaction', {
      amount,
      tokenAddress
    })
    const result = await this.getJson(url)

    if (!result.data) {
      logger.error(result)
      throw new Error('expected tx data')
    }

    const { data, to, value } = result

    return {
      data,
      to,
      value
    }
  }

  async getSwapTx (params: SwapParams) {
    const { fromTokenAddress, toTokenAddress, fromAddress, amount, slippage, destReceiver } = params
    if (!this.chainId) {
      throw new Error('chainId is required')
    }
    if (!fromTokenAddress) {
      throw new Error('fromTokenAddrss is required')
    }
    if (!toTokenAddress) {
      throw new Error('toTokenAddress is required')
    }
    if (!fromAddress) {
      throw new Error('fromAddress is required')
    }
    if (!amount) {
      throw new Error('amount is required')
    }
    if (!slippage) {
      throw new Error('slippage is required')
    }

    const url = this.constructUrl('/swap', {
      fromTokenAddress,
      toTokenAddress,
      amount,
      fromAddress,
      slippage,
      destReceiver
    })
    const result = await this.getJson(url)
    if (!result.tx) {
      logger.error(result)
      throw new Error('expected tx data')
    }

    const { data, to, value } = result.tx

    return {
      data,
      to,
      value
    }
  }
}

type SwapInput = {
  chain: string
  fromToken: string
  toToken: string
  amount: number
  max: boolean
  slippage: number
  recipient: string
  dryMode: boolean
}

// 1inch uses 0xeee…eee address for native tokens (eth, matic, xdai, etc)
const nativeTokenAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export async function swap (input: SwapInput) {
  let {
    chain,
    fromToken,
    toToken,
    amount: formattedAmount,
    max,
    slippage = 0.1,
    recipient,
    dryMode
  } = input
  if (slippage > 1) {
    throw new Error('slippage parameter is too high')
  }

  if (slippage <= 0) {
    throw new Error('slippage must be higher than 0')
  }

  const wallet = wallets.get(chain)
  const oneInch = new OneInch(chain)

  const walletAddress = await wallet.getAddress()
  let amount: string
  const isFromNative = nativeChainTokens[chain] === fromToken
  const isToNative = nativeChainTokens[chain] === toToken
  const canonicalFromTokenSymbol = getCanonicalTokenSymbol(fromToken)
  const canonicalToTokenSymbol = getCanonicalTokenSymbol(toToken)
  const fromDecimals = getTokenDecimals(canonicalFromTokenSymbol)
  const toDecimals = getTokenDecimals(canonicalToTokenSymbol)

  if (max) {
    if (isFromNative) {
      amount = (await wallet.getBalance()).toString()
      formattedAmount = Number(formatUnits(amount.toString(), fromDecimals))
    } else {
      const tokenContracts = contracts.get(fromToken, chain)
      if (!tokenContracts) {
        throw new Error('token contracts not found')
      }
      let token: Token
      if (chain === Chain.Ethereum) {
        token = new Token(tokenContracts.l1CanonicalToken)
      } else {
        token = new Token(tokenContracts.l2CanonicalToken)
      }

      amount = (await token.getBalance()).toString()
      formattedAmount = Number(formatUnits(amount.toString(), fromDecimals))
    }
  } else {
    amount = parseUnits(formattedAmount.toString(), fromDecimals).toString()
  }

  logger.debug('chain:', chain)
  logger.debug('fromToken:', fromToken)
  logger.debug('toToken:', toToken)
  logger.debug('canonicalFromTokenSymbol:', canonicalFromTokenSymbol)
  logger.debug('canonicalToTokenSymbol:', canonicalToTokenSymbol)
  logger.debug('amount:', formattedAmount)
  logger.debug('slippage:', slippage)
  logger.debug('dryMode:', !!dryMode)

  const fromTokenConfig = (mainnetAddresses as any).bridges?.[canonicalFromTokenSymbol]?.[chain]
  const toTokenConfig = (mainnetAddresses as any).bridges?.[canonicalToTokenSymbol]?.[chain]
  let fromTokenAddress = fromTokenConfig?.l1CanonicalToken || fromTokenConfig?.l2CanonicalToken
  let toTokenAddress = toTokenConfig?.l1CanonicalToken || toTokenConfig?.l2CanonicalToken

  if (isFromNative) {
    fromTokenAddress = nativeTokenAddress
  }
  if (isToNative) {
    toTokenAddress = nativeTokenAddress
  }

  if (!fromTokenAddress) {
    throw new Error(`from token "${fromToken}" is not supported`)
  }

  if (!toTokenAddress) {
    throw new Error(`to token "${toToken}" is not supported`)
  }

  logger.debug('checking allowance')
  const tokenAddress = fromTokenAddress
  const allowance = await oneInch.getAllowance({ tokenAddress, walletAddress })
  logger.debug('allowance:', formatUnits(allowance, fromDecimals))

  if (BigNumber.from(allowance).lt(amount)) {
    const txData = await oneInch.getApproveTx({ tokenAddress, amount })
    logger.debug('approval data:', txData)

    if (dryMode) {
      logger.warn(`dry: ${dryMode}, skipping approve tx`)
    } else {
      logger.debug('sending approve tx')
      const tx = await wallet.sendTransaction(txData)
      logger.debug('approval tx:', tx.hash)
      await tx.wait()
    }
  }

  logger.debug('checking quote')

  const oneFromToken = parseUnits('1', fromDecimals).toString()
  const quote = await oneInch.getQuote({ fromTokenAddress, toTokenAddress, amount: oneFromToken })
  const { toTokenAmount, fromTokenAmount } = await oneInch.getQuote({ fromTokenAddress, toTokenAddress, amount })
  const toTokenAmountFormatted = formatUnits(toTokenAmount, toDecimals)
  const ratio1 = Number(formatUnits(quote.fromTokenAmount, fromDecimals)) / Number(formatUnits(quote.toTokenAmount, toDecimals))
  const ratio2 = Number(formattedAmount) / Number(toTokenAmountFormatted)
  const calculatedSlippage = Number(((ratio2 / ratio1) / 100).toFixed(4))
  if (calculatedSlippage > slippage) {
    throw new Error(`calculated slippage is too high (${calculatedSlippage})`)
  }

  logger.debug(`toTokenAmount: ${toTokenAmountFormatted}`)
  logger.debug('getting swap data')

  const fromAddress = walletAddress
  const txData = await oneInch.getSwapTx({ fromTokenAddress, toTokenAddress, fromAddress, amount, slippage, destReceiver: recipient })
  logger.debug('swap data:', txData)

  if (dryMode) {
    logger.warn(`dry: ${dryMode}, skipping dex swap tx`)
  } else {
    logger.debug('sending swap tx')
    const tx = await wallet.sendTransaction(txData)
    logger.debug('swap tx:', tx.hash)
    return tx
  }
}
