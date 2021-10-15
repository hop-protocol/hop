import GasBoostSigner from 'src/gasboost/GasBoostSigner'
import getRpcProvider from 'src/utils/getRpcProvider'
import memoize from 'fast-memoize'
import { Wallet } from 'ethers'
import {
  gasPriceMultiplier,
  config as globalConfig,
  maxGasPriceGwei,
  minPriorityFeePerGas,
  priorityFeePerGasCap,
  timeTilBoostMs
} from 'src/config'

const constructWallet = memoize(
  (network: string, privateKey: string): Wallet => {
    if (!privateKey) {
      throw new Error('private key is required to instantiate wallet')
    }
    const provider = getRpcProvider(network)
    const signer = new GasBoostSigner(privateKey, provider!) // eslint-disable-line
    signer.setOptions({
      gasPriceMultiplier,
      maxGasPriceGwei,
      minPriorityFeePerGas,
      priorityFeePerGasCap,
      timeTilBoostMs
    })
    return signer
  }
)

// lazy instantiate
export default {
  has (network: string) {
    return !!constructWallet(network, globalConfig.bonderPrivateKey)
  },
  get (network: string) {
    return constructWallet(network, globalConfig.bonderPrivateKey)
  }
}
