import { ethers, Wallet } from 'ethers'
import memoize from 'fast-memoize'
import { config } from 'src/config'
import { getRpcProvider } from 'src/utils'

const constructWallet = memoize(
  (network: string): Wallet => {
    if (!config.bonderPrivateKey) {
      throw new Error('BONDER_PRIVATE_KEY is required')
    }
    const provider = getRpcProvider(network)
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
