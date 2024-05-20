const l1Chains: Record<string, boolean> = {
  1: true,
  5: true,
  42: true,
  11155111: true
}

export const isL1ChainId = (chainId: number | string) => {
  return l1Chains[chainId.toString()] ?? false
}
