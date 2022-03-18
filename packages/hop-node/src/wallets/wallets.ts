import GasBoostSigner from 'src/gasboost/GasBoostSigner'
import getRpcProvider from 'src/utils/getRpcProvider'
import memoize from 'fast-memoize'
import { Wallet } from 'ethers'
import {
  gasPriceMultiplier,
  getNetworkMaxGasPrice,
  config as globalConfig,
  minPriorityFeePerGas,
  priorityFeePerGasCap,
  timeTilBoostMs
} from 'src/config'
import { getGasBoostDb } from 'src/db'

const constructWallet = memoize(
  (network: string, privateKey: string): Wallet => {
    if (!privateKey) {
      throw new Error('private key is required to instantiate wallet')
    }
    const db = getGasBoostDb(network)
    const provider = getRpcProvider(network)
    const signer = new GasBoostSigner(privateKey, provider!, db)
    const maxGasPriceGwei = getNetworkMaxGasPrice(network)
    const { waitConfirmations: reorgWaitConfirmations } = globalConfig.networks[network]!
    signer.setOptions({
      gasPriceMultiplier,
      maxGasPriceGwei,
      minPriorityFeePerGas,
      priorityFeePerGasCap,
      timeTilBoostMs,
      reorgWaitConfirmations
    })
    return signer
  }
)

// lazy instantiate
export default {
  get (network: string) {
    return constructWallet(network, globalConfig.bonderPrivateKey)
  },
  lowPriority: {
    get (network: string) {
      if (globalConfig.bonderLowPriorityPrivateKey) {
        return constructWallet(network, globalConfig.bonderLowPriorityPrivateKey)
      }

      // return regular signer if low priority private key is not set since it's optional
      return constructWallet(network, globalConfig.bonderPrivateKey)
    }
  }
}
