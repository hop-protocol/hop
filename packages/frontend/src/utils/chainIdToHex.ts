export function chainIdToHex (chainId: number) {
  if (!chainId) {
    throw new Error('chainIdToHex: chainId is required')
  }

  return `0x${chainId.toString(16)}`
}
