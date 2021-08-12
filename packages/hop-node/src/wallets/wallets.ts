import GasBoostSigner from 'src/gasboost/GasBoostSigner'
import memoize from 'fast-memoize'
import { Wallet } from 'ethers'
import { getRpcProvider } from 'src/utils'
import { config as globalConfig } from 'src/config'

const constructWallet = memoize(
  (network: string, privateKey: string): Wallet => {
    if (!privateKey) {
      throw new Error('private key is required to instantiate wallet')
    }
    const provider = getRpcProvider(network)
    return new GasBoostSigner(privateKey, provider)
  }
)

// lazy instantiate
export default {
  has (network: string) {
    return !!constructWallet(network, globalConfig.bonderPrivateKey)
  },
  get (network: string) {
    return constructWallet(network, globalConfig.bonderPrivateKey)
  },
  getRelayer (network: string) {
    return constructWallet(
      network,
      globalConfig.relayerPrivateKey || globalConfig.bonderPrivateKey
    )
  }
}
