import { parseUnits } from '@ethersproject/units'
import Network from 'src/models/Network'
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

export function sanitizeNumericalString(numStr: string) {
  return numStr.replace(/[^0-9.]|\.(?=.*\.)/g, '')
}

export function fixedDecimals(amount: string, decimals: number) {
  const sanitizedAmount = sanitizeNumericalString(amount)
  const indexOfDecimal = sanitizedAmount.indexOf('.')
  if (indexOfDecimal === -1) {
    return sanitizedAmount
  }

  const wholeAmount = sanitizedAmount.slice(0, indexOfDecimal) || '0'
  const fractionalAmount = sanitizedAmount.slice(indexOfDecimal + 1)
  const decimalAmount = decimals !== 0 ? `.${fractionalAmount.slice(0, decimals)}` : ''

  return `${wholeAmount}${decimalAmount}`
}

export function amountToBN(amount: string, decimals: number = 18) {
  const fixedAmount = fixedDecimals(amount, decimals).toString()
  return parseUnits(fixedAmount || '0', decimals)
}
