import chainSlugToId from 'src/utils/chainSlugToId'
import fetch from 'node-fetch'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import wallets from 'src/wallets'
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

const addresses: any = {
  ethereum: {
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    ETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
  },
  polygon: {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    ETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
  },
  xdai: {
    USDC: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
    ETH: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1'
  }
}

class OneInch {
  baseUrl: string = 'https://api.1inch.exchange/v4.0'

  async getQuote (config: any) {
    const { chainId, fromTokenAddress, toTokenAddress, amount } = config
    if (!chainId) {
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
    const url = `${this.baseUrl}/${chainId}/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}`
    const result = await this.getJson(url)
    if (!result.toTokenAmount) {
      console.log(result)
      throw new Error('expected tx data')
    }

    const { toTokenAmount } = result

    return toTokenAmount
  }

  async getAllowance (config: any) {
    const { chainId, tokenAddress, walletAddress } = config
    if (!chainId) {
      throw new Error('chainId is required')
    }
    if (!tokenAddress) {
      throw new Error('tokenAddress required')
    }
    if (!walletAddress) {
      throw new Error('walletAddress is required')
    }

    const url = `${this.baseUrl}/${chainId}/approve/allowance?tokenAddress=${tokenAddress}&walletAddress=${walletAddress}`
    const result = await this.getJson(url)
    if (result.allowance === undefined) {
      console.log(result)
      throw new Error('expected tx data')
    }

    return result.allowance
  }

  async getApproveTx (config: any) {
    const { chainId, tokenAddress, amount } = config
    if (!chainId) {
      throw new Error('chainId is required')
    }
    if (!tokenAddress) {
      throw new Error('tokenAddress required')
    }
    if (!amount) {
      throw new Error('amount is required')
    }

    const url = `${this.baseUrl}/${chainId}/approve/transaction?&amount=${amount}&tokenAddress=${tokenAddress}`
    const result = await this.getJson(url)
    if (!result.data) {
      console.log(result)
      throw new Error('expected tx data')
    }

    const { data, to, value } = result

    return {
      data,
      to,
      value
    }
  }

  async getSwapTx (config: any) {
    const { chainId, fromTokenAddress, toTokenAddress, fromAddress, amount, slippage, destReceiver } = config
    if (!chainId) {
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
    let url = `${this.baseUrl}/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&fromAddress=${fromAddress}&slippage=${slippage}`
    if (destReceiver) {
      url = `${url}&destReceiver=${destReceiver}`
    }
    const result = await this.getJson(url)
    if (!result.tx) {
      console.log(result)
      throw new Error('expected tx data')
    }

    const { data, to, value } = result.tx

    return {
      data,
      to,
      value
    }
  }

  async getJson (url: string) {
    const res = await fetch(url)
    const json = await res.json()
    if (!json) {
      throw new Error('no response')
    }
    if (json.error) {
      console.log(json)
      throw new Error(json.description || json.error)
    }

    return json
  }
}

export async function swap (config: any) {
  const {
    chain,
    fromToken,
    toToken,
    amount: formattedAmount,
    max,
    slippage,
    recipient
  } = config
  if (max) {
    throw new Error('todo: max')
  }

  const wallet = wallets.get(chain)
  const oneInch = new OneInch()

  const chainId = chainSlugToId(chain)
  const walletAddress = await wallet.getAddress()
  const amount = parseUnits(formattedAmount, getTokenDecimals(fromToken)).toString()

  console.log('chain:', chain)
  console.log('fromToken:', fromToken)
  console.log('toToken:', toToken)
  console.log('amount:', formattedAmount)

  if (!addresses[chain]) {
    throw new Error('chain is not supported')
  }

  const fromTokenAddress = addresses[chain][fromToken]
  if (!fromTokenAddress) {
    throw new Error(`from token "${fromToken}" is not supported`)
  }

  const toTokenAddress = addresses[chain][toToken]
  if (!toTokenAddress) {
    throw new Error(`to token "${toToken}" is not supported`)
  }

  const tokenAddress = fromTokenAddress
  const allowance = await oneInch.getAllowance({ chainId, tokenAddress, walletAddress })
  console.log('allowance:', formatUnits(allowance, getTokenDecimals(fromToken)))
  if (BigNumber.from(allowance).lt(amount)) {
    const txData = await oneInch.getApproveTx({ chainId, tokenAddress, amount })
    console.log('approval data:', txData)

    const tx = await wallet.sendTransaction(txData)
    console.log('approval tx:', tx.hash)
    await tx.wait()
  }

  const toTokenAmount = await oneInch.getQuote({ chainId, fromTokenAddress, toTokenAddress, amount })
  const toTokenAmountFormatted = formatUnits(toTokenAmount, getTokenDecimals(toToken))
  console.log(`toTokenAmount: ${toTokenAmountFormatted}`)

  const fromAddress = walletAddress
  const txData = await oneInch.getSwapTx({ chainId, fromTokenAddress, toTokenAddress, fromAddress, amount, slippage, destReceiver: recipient })
  console.log('swap data:', txData)
  const tx = await wallet.sendTransaction(txData)
  console.log('swap tx:', tx.hash)
  await tx.wait()

  console.log('done')
}
