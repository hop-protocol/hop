import Logger from 'src/logger'
import chainSlugToId from 'src/utils/chainSlugToId'
import fetch from 'node-fetch'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import serializeQueryParams from 'src/utils/serializeQueryParams'
import wallets from 'src/wallets'
import { BigNumber } from 'ethers'
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
    const serializedParams = serializeQueryParams(params)
    const url = `${this.baseUrl}/${this.chainId}${path}?${serializedParams}`
    return url
  }

  async getJson (url: string) {
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

    const { toTokenAmount } = result

    return toTokenAmount
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
  amount: string
  max: boolean
  slippage: number
  recipient: string
}

export async function swap (input: SwapInput) {
  const {
    chain,
    fromToken,
    toToken,
    amount: formattedAmount,
    max,
    slippage,
    recipient
  } = input
  if (max) {
    throw new Error('todo: max')
  }

  if (slippage > 1) {
    throw new Error('slippage parameter is too high')
  }

  if (slippage < 0) {
    throw new Error('slippage must be higher than 0')
  }

  const wallet = wallets.get(chain)
  const oneInch = new OneInch(chain)

  const walletAddress = await wallet.getAddress()
  const amount = parseUnits(formattedAmount, getTokenDecimals(fromToken)).toString()

  logger.debug('chain:', chain)
  logger.debug('fromToken:', fromToken)
  logger.debug('toToken:', toToken)
  logger.debug('amount:', formattedAmount)

  const fromTokenConfig = (mainnetAddresses as any).bridges?.[fromToken]?.[chain]
  const toTokenConfig = (mainnetAddresses as any).bridges?.[toToken]?.[chain]
  const fromTokenAddress = fromTokenConfig?.l1CanonicalToken || fromTokenConfig?.l2CanonicalToken
  const toTokenAddress = toTokenConfig?.l1CanonicalToken || toTokenConfig?.l2CanonicalToken

  if (!fromTokenAddress) {
    throw new Error(`from token "${fromToken}" is not supported`)
  }

  if (!toTokenAddress) {
    throw new Error(`to token "${toToken}" is not supported`)
  }

  const tokenAddress = fromTokenAddress
  const allowance = await oneInch.getAllowance({ tokenAddress, walletAddress })
  logger.debug('allowance:', formatUnits(allowance, getTokenDecimals(fromToken)))

  if (BigNumber.from(allowance).lt(amount)) {
    const txData = await oneInch.getApproveTx({ tokenAddress, amount })
    logger.debug('approval data:', txData)

    const tx = await wallet.sendTransaction(txData)
    logger.debug('approval tx:', tx.hash)
    await tx.wait()
  }

  const toTokenAmount = await oneInch.getQuote({ fromTokenAddress, toTokenAddress, amount })
  const toTokenAmountFormatted = formatUnits(toTokenAmount, getTokenDecimals(toToken))
  logger.debug(`toTokenAmount: ${toTokenAmountFormatted}`)

  const fromAddress = walletAddress
  const txData = await oneInch.getSwapTx({ fromTokenAddress, toTokenAddress, fromAddress, amount, slippage, destReceiver: recipient })
  logger.debug('swap data:', txData)

  const tx = await wallet.sendTransaction(txData)
  logger.debug('swap tx:', tx.hash)
  await tx.wait()

  logger.debug('swap complete')
}
