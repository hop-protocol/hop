import { getAddress } from '@ethersproject/address'

import { ETHERSCAN_PREFIXES, NetworkId } from 'src/config/constants'

import MetamaskNetworkMainnet from 'src/assets/onboard/metamask-network-mainnet.png'
import MetamaskNetworkKovan from 'src/assets/onboard/metamask-network-kovan.png'
import MetamaskNetworkGoerli from 'src/assets/onboard/metamask-network-goerli.png'
import MetamaskNetworkRinkeby from 'src/assets/onboard/metamask-network-rinkeby.png'
import MetamaskNetworkRopsten from 'src/assets/onboard/metamask-network-ropsten.png'

export function isAddress (value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function getEtherscanLink (
  networkId: string | NetworkId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const prefix = `https://${ETHERSCAN_PREFIXES[networkId as NetworkId] ||
    ETHERSCAN_PREFIXES[1]}etherscan.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export const prettifyErrorMessage = (str: string = '') => {
  return str.replace(/.*\[ethjs-query\].*"message":"(.*)\"\}.*/, '$1')
}

export const getNetworkSpecificMetamaskImage = (
  networkName: string
): string => {
  const name = networkName.toLowerCase()

  if (name === 'mainnet') {
    return MetamaskNetworkMainnet
  } else if (name === 'kovan') {
    return MetamaskNetworkKovan
  } else if (name === 'goerli') {
    return MetamaskNetworkGoerli
  } else if (name === 'ropsten') {
    return MetamaskNetworkRopsten
  } else if (name === 'rinkeby') {
    return MetamaskNetworkRinkeby
  } else {
    throw new Error('Invalid network name')
  }
}
