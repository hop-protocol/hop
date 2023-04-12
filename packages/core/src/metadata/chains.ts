import { Chains } from './types'
import {
  arbitrumImage,
  baseImage,
  ethereumImage,
  gnosisImage,
  lineaImage,
  novaImage,
  optimismImage,
  polygonImage,
  scrollzkImage,
  zksyncImage
} from './assets'

export const chains: Chains = {
  ethereum: {
    name: 'Ethereum',
    slug: 'ethereum',
    image: ethereumImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: true
  },
  gnosis: {
    name: 'Gnosis',
    slug: 'gnosis',
    image: gnosisImage,
    nativeTokenSymbol: 'XDAI',
    isLayer1: false
  },
  polygon: {
    name: 'Polygon',
    slug: 'polygon',
    image: polygonImage,
    nativeTokenSymbol: 'MATIC',
    isLayer1: false
  },
  arbitrum: {
    name: 'Arbitrum',
    slug: 'arbitrum',
    image: arbitrumImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: false
  },
  optimism: {
    name: 'Optimism',
    slug: 'optimism',
    image: optimismImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: false
  },
  nova: {
    name: 'Nova',
    slug: 'nova',
    image: novaImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: false
  },
  zksync: {
    name: 'zkSync',
    slug: 'zksync',
    image: zksyncImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: false
  },
  linea: {
    name: 'Linea',
    slug: 'linea',
    image: lineaImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: false
  },
  scrollzk: {
    name: 'Scroll zkEVM',
    slug: 'scrollzk',
    image: scrollzkImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: false
  },
  base: {
    name: 'Base',
    slug: 'base',
    image: baseImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: false
  }
}
