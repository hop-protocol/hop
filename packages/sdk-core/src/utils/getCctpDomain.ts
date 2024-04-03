const map: Record<string, number> = {
  ethereum: 0,
  optimism: 2,
  arbitrum: 3,
  base: 6,
  polygon: 7
}

export function getCctpDomain(chainSlug: string): number | null {
  const domain = map[chainSlug]
  if (domain == null) {
    throw new Error(`Unknown domain for chain slug: ${chainSlug}`)
  }

  return domain
}
