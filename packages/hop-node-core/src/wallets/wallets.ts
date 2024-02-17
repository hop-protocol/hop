import GasBoostSigner from 'src/gasboost/GasBoostSigner'
import getRpcProvider from 'src/utils/getRpcProvider'
import memoize from 'fast-memoize'
import { KmsSigner } from 'src/aws/KmsSigner'
import { LambdaSigner } from 'src/aws/LambdaSigner'
import { Signer, Wallet } from 'ethers'
import {
  gasPriceMultiplier,
  config as globalConfig,
  initialTxGasPriceMultiplier,
  maxPriorityFeeConfidenceLevel,
  priorityFeePerGasCap,
  timeTilBoostMs
} from 'src/config'

export const constructSigner = memoize((network: string, privateKey: string): Signer => {
  const provider = getRpcProvider(network)
  if (!provider) {
    throw new Error('expected provider')
  }
  let wallet
  if (globalConfig.signerConfig.type === 'kms') {
    const { keyId, awsRegion } = globalConfig.signerConfig
    if (!keyId) {
      throw new Error('keyId is required')
    }
    wallet = new KmsSigner({ keyId, region: awsRegion }, provider)
  } else if (globalConfig.signerConfig.type === 'lambda') {
    const { keyId, awsRegion, lambdaFunctionName } = globalConfig.signerConfig
    if (!keyId || !awsRegion || !lambdaFunctionName) {
      throw new Error('keyId, awsRegion, and lambdaFunctionName are required')
    }
    wallet = new LambdaSigner({ keyId, region: awsRegion, lambdaFunctionName }, provider)
  } else {
    if (!privateKey) {
      throw new Error('private key is required to instantiate wallet')
    }
    wallet = new Wallet(privateKey, provider)
  }

  const signer = new GasBoostSigner(wallet)
  // TODO: MIGRATION: Handle this
  // const maxGasPriceGwei = getNetworkMaxGasPrice(network)
  const maxGasPriceGwei = 1000
  signer.setOptions({
    gasPriceMultiplier,
    initialTxGasPriceMultiplier,
    maxGasPriceGwei,
    priorityFeePerGasCap,
    timeTilBoostMs,
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
