import { getBaseExplorerUrl } from '.'

export function getExplorerTxUrl(networkName, txHash) {
  switch (networkName) {
    case 'mainnet':
    case 'ethereum': {
      return `${getBaseExplorerUrl(networkName)}/tx/${txHash}`
    }
    case 'arbitrum': {
      return `${getBaseExplorerUrl('arbitrum')}/tx/${txHash}`
    }
    case 'optimism': {
      try {
        const url = new URL(getBaseExplorerUrl('optimism'))
        return `${url.origin}${url.pathname}/tx/${txHash}${url.search}`
      } catch (err) {
        return ''
      }
    }
    case 'gnosis': {
      return `${getBaseExplorerUrl('gnosis')}/tx/${txHash}`
    }
    case 'polygon': {
      return `${getBaseExplorerUrl('polygon')}/tx/${txHash}`
    }
  }
}
