import { GasBoostSigner } from '#gasboost/GasBoostSigner.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { KmsSigner } from '#aws/KmsSigner.js'
import { LambdaSigner } from '#aws/LambdaSigner.js'
import { Signer, Wallet } from 'ethers'
import {
  gasPriceMultiplier,
  config as globalConfig,
  initialTxGasPriceMultiplier,
  maxPriorityFeeConfidenceLevel,
  priorityFeePerGasCap,
  timeTilBoostMs
} from '#config/index.js'

const cache: Record<string, Signer> = {}

const constructSigner = (network: string, privateKey: string): Signer => {
  const cacheKey = `${network}`
  if (cache[cacheKey]) {
    return cache[cacheKey]
  }

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
  const maxGasPriceGwei = globalConfig.networks[network].maxGasPrice
  signer.setOptions({
    gasPriceMultiplier,
    initialTxGasPriceMultiplier,
    maxGasPriceGwei,
    priorityFeePerGasCap,
    timeTilBoostMs,
    maxPriorityFeeConfidenceLevel
  })

  cache[cacheKey] = signer
  return signer
}

// lazy instantiate
export default {
  has (network: string) {
    return !!constructSigner(network, globalConfig.bonderPrivateKey)
  },
  get (network: string) {
    return constructSigner(network, globalConfig.bonderPrivateKey)
  }
}
