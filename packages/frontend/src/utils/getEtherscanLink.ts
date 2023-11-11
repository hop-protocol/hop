import { getBaseExplorerUrl } from './getBaseExplorerUrl'
import { networkIdToSlug } from './networks'

export function getEtherscanLink(
  networkId: string | number,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const baseUrl = getBaseExplorerUrl(networkIdToSlug(networkId))

  switch (type) {
    case 'transaction': {
      return `${baseUrl}/tx/${data}`
    }
    case 'token': {
      return `${baseUrl}/token/${data}`
    }
    case 'block': {
      return `${baseUrl}/block/${data}`
    }
    case 'address':
    default: {
      return `${baseUrl}/address/${data}`
    }
  }
}
