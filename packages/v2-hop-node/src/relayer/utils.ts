export const getExponentialBackoffDelayMs = (backoffIndex: number): number => {
  // TODO: Add jitter. Avoid floating point issues
  const baseDelayMs = 1000
  return (1 << backoffIndex) * baseDelayMs
}
