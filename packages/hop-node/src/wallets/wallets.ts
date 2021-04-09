import { ethers, Wallet } from 'ethers'
import memoize from 'fast-memoize'
import { bonderPrivateKey } from 'src/config'
import { getRpcUrl } from 'src/utils'

const constructWallet = memoize(
  (network: string): Wallet => {
    const rpcUrl = getRpcUrl(network)
    if (!rpcUrl) {
      return null
    }
    const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl)
    return new ethers.Wallet(bonderPrivateKey, provider)
  }
)

// lazy instantiate
export default {
  has (network: string) {
    return !!constructWallet(network)
  },
  get (network: string) {
    return constructWallet(network)
  }
} as any
