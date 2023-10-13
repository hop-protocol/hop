const getExponentialBackoffDelayMs = (backoffIndex: number): number => {
  return (1 << backoffIndex) * 10 * 1000 // eslint-disable
}

export default getExponentialBackoffDelayMs
