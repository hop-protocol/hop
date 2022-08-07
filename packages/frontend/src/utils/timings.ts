export function isOlderThanOneHour(timestampMs: number) {
  return (Date.now() - (60 * 60 * 1000)) > timestampMs
}
