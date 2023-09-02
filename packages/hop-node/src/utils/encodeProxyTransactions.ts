import { ProxyTransaction } from 'src/types'
import { defaultAbiCoder } from 'ethers/lib/utils'

const encodeProxyTransactions = (proxyTransactions: ProxyTransaction[]): string[] => {
  return proxyTransactions.map((proxyTransaction: ProxyTransaction) => {
    let { to, data, value } = proxyTransaction
    return defaultAbiCoder.encode(
      ['address', 'bytes', 'uint256'],
      [to, data, value]
    )
  })
}

export default encodeProxyTransactions