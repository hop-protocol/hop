export function getLastPathSent(fromNetworkSlug, toNetworkSlug, sourceTokenSymbol, fromTokenAmount) {
  return JSON.stringify({ from: fromNetworkSlug, to: toNetworkSlug, symbol: sourceTokenSymbol, amount: fromTokenAmount })
}
