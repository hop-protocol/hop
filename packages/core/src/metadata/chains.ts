import { Chains } from './types'
import {
  arbitrumImage,
  consensyszkImage,
  ethereumImage,
  gnosisImage,
  novaImage,
  optimismImage,
  polygonImage,
  zksyncImage
} from './assets'

export const chains: Chains = {
  ethereum: {
    name: 'Ethereum',
    slug: 'ethereum',
    image: ethereumImage,
    nativeTokenSymbol: 'ETH'
  },
  gnosis: {
    name: 'Gnosis',
    slug: 'gnosis',
    image: gnosisImage,
    nativeTokenSymbol: 'XDAI'
  },
  polygon: {
    name: 'Polygon',
    slug: 'polygon',
    image: polygonImage,
    nativeTokenSymbol: 'MATIC'
  },
  arbitrum: {
    name: 'Arbitrum',
    slug: 'arbitrum',
    image: arbitrumImage,
    nativeTokenSymbol: 'ETH'
  },
  optimism: {
    name: 'Optimism',
    slug: 'optimism',
    image: optimismImage,
    nativeTokenSymbol: 'ETH'
  },
  nova: {
    name: 'Nova',
    slug: 'nova',
    image: novaImage,
    nativeTokenSymbol: 'ETH'
  },
  zksync: {
    name: 'zkSync',
    slug: 'zksync',
    image: zksyncImage,
    nativeTokenSymbol: 'ETH'
  },
  consensyszk: {
    name: 'ConsenSys zkEVM',
    slug: 'consensyszk',
    image: consensyszkImage,
    nativeTokenSymbol: 'ETH'
  }
}
