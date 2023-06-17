import GasBoostSigner from 'src/gasboost/GasBoostSigner'
import getRpcProvider from 'src/utils/getRpcProvider'
import memoize from 'fast-memoize'
import { KmsSigner } from 'src/aws/KmsSigner'
import { LambdaSigner } from 'src/aws/LambdaSigner'
import { Signer, Wallet } from 'ethers'
import {
  gasPriceMultiplier,
  getNetworkMaxGasPrice,
  config as globalConfig,
  initialTxGasPriceMultiplier,
  maxPriorityFeeConfidenceLevel,
  priorityFeePerGasCap,
  timeTilBoostMs
} from 'src/config'
import { getGasBoostDb } from 'src/db'

export const constructSigner = memoize((network: string, privateKey: string): Signer => {
  const provider = getRpcProvider(network)
  if (!provider) {
    throw new Error('expected provider')
  }
  let wallet
  if (globalConfig.signerConfig.type === 'kms') {
    const { keyId, awsRegion } = globalConfig.signerConfig
    wallet = new KmsSigner({ keyId: keyId!, region: awsRegion }, provider)
  } else if (globalConfig.signerConfig.type === 'lambda') {
    const { keyId, awsRegion, lambdaFunctionName } = globalConfig.signerConfig
    wallet = new LambdaSigner({ keyId: keyId!, region: awsRegion, lambdaFunctionName: lambdaFunctionName! }, provider)
  } else {
    if (!privateKey) {
      throw new Error('private key is required to instantiate wallet')
    }
    wallet = new Wallet(privateKey, provider)
  }

  const db = getGasBoostDb(network)
  const signer = new GasBoostSigner(wallet, db)
  const maxGasPriceGwei = getNetworkMaxGasPrice(network)
  const { waitConfirmations: reorgWaitConfirmations } = globalConfig.networks[network]!
  signer.setOptions({
    gasPriceMultiplier,
    initialTxGasPriceMultiplier,
    maxGasPriceGwei,
    priorityFeePerGasCap,
    timeTilBoostMs,
    reorgWaitConfirmations,
    maxPriorityFeeConfidenceLevel
  })
  return signer
})

// lazy instantiate
export default {
  has (network: string) {
    return !!constructSigner(network, globalConfig.bonderPrivateKey)
  },
  get (network: string) {
    return constructSigner(network, globalConfig.bonderPrivateKey)
  }
}
