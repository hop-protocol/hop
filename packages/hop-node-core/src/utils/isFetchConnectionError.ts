export function isFetchConnectionError (errMsg: string) {
  const connectionErrorRegex = /(ETIMEDOUT|ENETUNREACH|ECONNRESET|ECONNREFUSED|SERVER_ERROR|EPROTO|EHOSTUNREACH)/i
  return connectionErrorRegex.test(errMsg)
}
