export function isFetchRateLimitError (errMsg: string) {
  const rateLimitErrorRegex = /(rate limit|too many concurrent requests|exceeded|socket hang up)/i
  return rateLimitErrorRegex.test(errMsg)
}
