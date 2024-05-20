export function isFetchBadResponseError (errMsg: string): boolean {
  const badResponseErrorRegex = /(bad response|response error|missing response|processing response error|invalid json response body|FetchError)/i
  return badResponseErrorRegex.test(errMsg)
}
