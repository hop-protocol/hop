import { ethers, Wallet } from 'ethers'
import memoize from 'fast-memoize'
import { config } from 'src/config'
import { getRpcProvider } from 'src/utils'

const constructWallet = memoize(
  (network: string, privateKey: string): Wallet => {
    if (!privateKey) {
      throw new Error('private key is required to instantiate wallet')
    }
    const provider = getRpcProvider(network)
    return new ethers.Wallet(privateKey, provider)
  }
)

// lazy instantiate
export default {
  has (network: string) {
    return !!constructWallet(network, config.bonderPrivateKey)
  },
  get (network: string) {
    return constructWallet(network, config.bonderPrivateKey)
  },
  getRelayer (network: string) {
    return constructWallet(
      network,
      config.relayerPrivateKey || config.bonderPrivateKey
    )
  }
} as any
