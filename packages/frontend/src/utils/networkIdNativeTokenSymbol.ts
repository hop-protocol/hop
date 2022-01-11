import { networkIdToSlug } from './networkIdToSlug'

export const networkIdNativeTokenSymbol = (networkId: string | number) => {
  const slug = networkIdToSlug(networkId)
  if (slug === 'gnosis') {
    return 'XDAI'
  } else if (slug === 'polygon') {
    return 'MATIC'
  }
  return 'ETH'
}
