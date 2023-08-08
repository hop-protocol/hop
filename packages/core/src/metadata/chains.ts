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
  polygonzkImage,
  scrollzkImage,
  zksyncImage
} from './assets'

export const chains: Chains = {
  ethereum: {
    name: 'Ethereum',
    slug: 'ethereum',
    image: ethereumImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: true,
    primaryColor: '#868dac'
  },
  gnosis: {
    name: 'Gnosis',
    slug: 'gnosis',
    image: gnosisImage,
    nativeTokenSymbol: 'XDAI',
    isLayer1: false,
    primaryColor: '#46a4a1'
  },
  polygon: {
    name: 'Polygon',
    slug: 'polygon',
    image: polygonImage,
    nativeTokenSymbol: 'MATIC',
    isLayer1: false,
    primaryColor: '#8b57e1'
  },
  arbitrum: {
    name: 'Arbitrum One',
    slug: 'arbitrum',
    image: arbitrumImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: false,
    primaryColor: '#289fef'
  },
  optimism: {
    name: 'Optimism',
    slug: 'optimism',
    image: optimismImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: false,
    primaryColor: '#e64b5d'
  },
  nova: {
    name: 'Arbitrum Nova',
    slug: 'nova',
    image: novaImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: false,
    primaryColor: '#ec772c'
  },
  zksync: {
    name: 'zkSync',
    slug: 'zksync',
    image: zksyncImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: false,
    primaryColor: '#8889f4'
  },
  linea: {
    name: 'Linea',
    slug: 'linea',
    image: lineaImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: false,
    primaryColor: '#121212'
  },
  scrollzk: {
    name: 'Scroll zkEVM',
    slug: 'scrollzk',
    image: scrollzkImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: false,
    primaryColor: '#e5d1b8'
  },
  base: {
    name: 'Base',
    slug: 'base',
    image: baseImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: false,
    primaryColor: '#0052ff'
  },
  polygonzk: {
    name: 'Polygon zkEVM',
    slug: 'polygonzk',
    image: polygonzkImage,
    nativeTokenSymbol: 'ETH',
    isLayer1: false,
    primaryColor: '#8b57e1'
  }
}
