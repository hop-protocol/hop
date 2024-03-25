const map: Record<string, number> = {
  ethereum: 0,
  optimism: 2,
  arbitrum: 3,
  base: 6,
  polygon: 7
}

function getCctpDomain(chainSlug: string): number | null {
  return map[chainSlug] ?? null
}
