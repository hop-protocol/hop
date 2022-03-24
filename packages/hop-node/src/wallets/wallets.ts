import GasBoostSigner from 'src/gasboost/GasBoostSigner'
import getRpcProvider from 'src/utils/getRpcProvider'
import memoize from 'fast-memoize'
import { Wallet } from 'ethers'
import {
  gasPriceMultiplier,
  getNetworkMaxGasPrice,
  config as globalConfig,
  lowPriorityTimeTilBoostMs,
  minPriorityFeePerGas,
  priorityFeePerGasCap,
  timeTilBoostMs
} from 'src/config'
import { getGasBoostDb } from 'src/db'

const constructWallet = memoize(
  (network: string, privateKey: string, isLowPriority: boolean = false): Wallet => {
    if (!privateKey) {
      throw new Error('private key is required to instantiate wallet')
    }
    const db = getGasBoostDb(network)
    const provider = getRpcProvider(network)
    const signer = new GasBoostSigner(privateKey, provider!, db)
    const maxGasPriceGwei = getNetworkMaxGasPrice(network)
    const initialTimeTilBoostMs = isLowPriority && lowPriorityTimeTilBoostMs ? lowPriorityTimeTilBoostMs : timeTilBoostMs
    const { waitConfirmations: reorgWaitConfirmations } = globalConfig.networks[network]!
    signer.setOptions({
      gasPriceMultiplier,
      initialTxIsLowPriority: isLowPriority,
      maxGasPriceGwei,
      minPriorityFeePerGas,
      priorityFeePerGasCap,
      timeTilBoostMs,
      initialTimeTilBoostMs,
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
        const isLowPriority = true
        return constructWallet(network, globalConfig.bonderLowPriorityPrivateKey, isLowPriority)
      }

      // return regular signer if low priority private key is not set since it's optional
      return constructWallet(network, globalConfig.bonderPrivateKey)
    }
  }
}
