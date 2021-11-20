import { BigNumber, FixedNumber, utils } from 'ethers'
import Network from 'src/models/Network'
import { prettifyErrorMessage } from '.'

export function formatError(error: any, network?: Network) {
  if (!error) {
    return
  }

  let errMsg = 'Something went wrong. Please try again.'
  if (typeof error === 'string') {
    errMsg = error
  } else if (error?.message) {
    errMsg = error.message
  } else if (error?.data?.message) {
    errMsg = error.data.message
  }

  // TODO: handle custom error messages elsewhere (and better)
  if (errMsg === 'not enough funds for gas') {
    const feeToken = network?.nativeTokenSymbol || 'funds'
    errMsg = `Insufficient balance. Please add ${feeToken} to pay for tx fees.`
  } else if (errMsg.includes('NetworkError when attempting to fetch resource')) {
    errMsg = `${errMsg} Please check your wallet network settings are correct and try again. More info: https://docs.hop.exchange/rpc-endpoints`
  }

  return prettifyErrorMessage(errMsg)
}

export function sanitizeNumericalString(numStr: string) {
  return numStr.replace(/[^0-9.]|\.(?=.*\.)/g, '')
}

export function maxDecimals(amount: string, decimals) {
  const sanitizedAmount = sanitizeNumericalString(amount)
  const indexOfDecimal = sanitizedAmount.indexOf('.')
  if (indexOfDecimal === -1) {
    return sanitizedAmount
  }

  const wholeAmountStr = sanitizedAmount.slice(0, indexOfDecimal) || '0'
  const wholeAmount = BigNumber.from(wholeAmountStr).toString()

  const fractionalAmount = sanitizedAmount.slice(indexOfDecimal + 1)
  const decimalAmount = decimals !== 0 ? `.${fractionalAmount.slice(0, decimals)}` : ''

  return `${wholeAmount}${decimalAmount}`
}

export function fixedDecimals(amount: string, decimals: number = 18) {
  if (amount === '') {
    return amount
  }
  const mdAmount = maxDecimals(amount, decimals)
  return FixedNumber.from(mdAmount).toString()
}

export function amountToBN(amount: string, decimals: number = 18) {
  const fixedAmount = fixedDecimals(amount, decimals)
  return utils.parseUnits(fixedAmount || '0', decimals)
}
