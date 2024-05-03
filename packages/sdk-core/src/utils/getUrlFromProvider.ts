export function getUrlFromProvider (provider: any): string {
  const rpcUrl = provider?.connection?.url ?? provider.providers?.[0]?.connection?.url ?? ''
  return rpcUrl
}
