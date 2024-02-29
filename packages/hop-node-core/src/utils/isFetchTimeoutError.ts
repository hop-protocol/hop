export function isFetchTimeoutError (errMsg: string) {
  const timeoutErrorRegex = /(timeout|time-out|time out|timedout|timed out)/i
  return timeoutErrorRegex.test(errMsg)
}
