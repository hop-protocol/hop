const getExponentialBackoffDelayMs = (backoffIndex: number): number => {
  // Used for tx retries. Must be long enough for a tx to be processed and confirmed onchain.
  return (1 << backoffIndex) * 30 * 1000 // eslint-disable
}

export default getExponentialBackoffDelayMs
