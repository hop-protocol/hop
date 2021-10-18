import { parseUnits } from '@ethersproject/units'
import { BigNumber } from 'ethers'
import Network from 'src/models/Network'
import { Token } from '@hop-protocol/sdk'
import { prettifyErrorMessage } from '.'

interface ErrorData {
  data?: {
    message?: string
  }
}

export function formatError(error: Error & ErrorData, network?: Network) {
  if (typeof error === 'string') {
    return prettifyErrorMessage(error)
  }

  const { data } = error

  // TODO: handle custom error messages elsewhere (and better)
  if (data?.message === 'not enough funds for gas') {
    const feeToken = network?.nativeTokenSymbol || 'funds'
    return `Insufficient balance. Please add ${feeToken} to pay for tx fees.`
  }

  if (data?.message) {
    return data.message
  }

  if (error?.message) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}

export function amountToBN(amount: string, decimals: number = 18) {
  const fixedAmount = fixedDecimals(amount, decimals)
  return parseUnits(fixedAmount, decimals)
}

export function fixedDecimals(amount: string, decimals: number): string {
  const sanitizedAmount = amount.replace(/,/g, '')
  const indexOfDecimal = sanitizedAmount.indexOf('.')
  const wholeAmount = sanitizedAmount.slice(0, indexOfDecimal)
  const fractionalAmount = sanitizedAmount.slice(indexOfDecimal + 1)
  const fixedAmount = `${wholeAmount}.${fractionalAmount.slice(0, decimals)}`
  return fixedAmount
}
