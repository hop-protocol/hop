import { ChainSlug, Slug } from '@hop-protocol/sdk'
import logger from 'src/logger'
import { getBaseExplorerUrl } from './getBaseExplorerUrl'

export function getExplorerTxUrl(networkName?: Slug | ChainSlug | string, txHash: string = '') {
  if (networkName === Slug.mainnet) {
    networkName = ChainSlug.Ethereum
  }

  if (networkName && (networkName in ChainSlug || Object.values(ChainSlug).includes(networkName as any))) {
    const explorerUrl = getBaseExplorerUrl(ChainSlug[networkName] || networkName)

    switch (networkName) {
      case ChainSlug.Ethereum:
      case ChainSlug.Arbitrum:
      case ChainSlug.Gnosis:
      case ChainSlug.Polygon: {
        return `${explorerUrl}/tx/${txHash}`
      }
      case ChainSlug.Optimism: {
        try {
          const url = new URL(explorerUrl)
          return `${url.origin}${url.pathname}/tx/${txHash}${url.search}`
        } catch (err) {
          return ''
        }
      }
    }
  }

  logger.error(`unknown networkName: ${networkName}`)
}
