import { ethers, Wallet } from 'ethers'
import memoize from 'fast-memoize'
import { config } from 'src/config'
import { getRpcUrl } from 'src/utils'

const constructWallet = memoize(
  (network: string): Wallet => {
    const rpcUrl = getRpcUrl(network)
    if (!rpcUrl) {
      return null
    }
    const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl)
    if (!config.bonderPrivateKey) {
      throw new Error('BONDER_PRIVATE_KEY is required')
    }
    return new ethers.Wallet(config.bonderPrivateKey, provider)
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
