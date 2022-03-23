import GasBoostSigner from 'src/gasboost/GasBoostSigner'
import getRpcProvider from 'src/utils/getRpcProvider'
import memoize from 'fast-memoize'
import { Signer, Wallet } from 'ethers'
import {
  gasPriceMultiplier,
  getNetworkMaxGasPrice,
  config as globalConfig,
  minPriorityFeePerGas,
  priorityFeePerGasCap,
  timeTilBoostMs
} from 'src/config'
import { getGasBoostDb } from 'src/db'

const constructSigner = memoize(
  (network: string, privateKey: string): Signer => {
    if (!privateKey) {
      throw new Error('private key is required to instantiate wallet')
    }
    const db = getGasBoostDb(network)
    const provider = getRpcProvider(network)
    const wallet = new Wallet(privateKey, provider!)
    const signer = new GasBoostSigner(wallet, db)
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
  has (network: string) {
    return !!constructSigner(network, globalConfig.bonderPrivateKey)
  },
  get (network: string) {
    return constructSigner(network, globalConfig.bonderPrivateKey)
  }
}
