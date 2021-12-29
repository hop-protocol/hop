import { ETHERSCAN_PREFIXES, NetworkId } from 'src/utils/constants'

export function getEtherscanLink(
  networkId: string | NetworkId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const prefix = `https://${
    ETHERSCAN_PREFIXES[networkId as NetworkId] || ETHERSCAN_PREFIXES[1]
  }etherscan.io`

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
