interface ErrorData {
  data?: {
    message?: string
  }
}

export function formatError(error: Error & ErrorData) {
  if (typeof error === 'string') {
    return error
  }

  const { data } = error

  // TODO: handle custom error messages elsewhere (and better)
  if (data?.message === 'not enough funds for gas') {
    return 'Insufficient funds. Please add ETH to pay for tx gas.'
  }

  if (data?.message) {
    return data.message
  }

  if (error?.message) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}
