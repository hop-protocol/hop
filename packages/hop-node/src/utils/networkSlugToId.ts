const networkSlugsToId: Record<string, number> = {
  mainnet: 1,
  goerli: 5,
  sepolia: 11155111
}

export function networkSlugToId (networkSlug: string): number {
  const networkId = networkSlugsToId[networkSlug]
  if (!networkId) {
    throw new Error(`network slug ${networkSlug} not found`)
  }
  return networkId
}
