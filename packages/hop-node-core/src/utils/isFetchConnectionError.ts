export function isFetchConnectionError (errMsg: string): boolean {
  const connectionErrorRegex = /(ETIMEDOUT|ENETUNREACH|ECONNRESET|ECONNREFUSED|SERVER_ERROR|EPROTO|EHOSTUNREACH)/i
  return connectionErrorRegex.test(errMsg)
}
