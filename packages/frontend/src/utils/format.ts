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
