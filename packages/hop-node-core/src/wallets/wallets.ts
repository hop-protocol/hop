import { GasBoostSigner } from '#gasboost/GasBoostSigner.js'
import { KmsSigner } from '#aws/KmsSigner.js'
import { LambdaSigner } from '#aws/LambdaSigner.js'
import { Wallet } from 'ethers'
import {
  type SignerConfig,
  CoreEnvironment
} from '#config/index.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import type { Signer} from 'ethers'
import { type ChainSlug } from '@hop-protocol/sdk'

const cache: Record<string, Signer> = {}

const constructSigner = (network: string, privateKey?: string): Signer => {
  const coreEnvironmentVariables = CoreEnvironment.getInstance().getEnvironment()
  const cacheKey = `${network}`
  const cachedValue = cache[cacheKey]
  if (cachedValue) {
    return cachedValue
  }
  const provider = getRpcProvider(network as ChainSlug)
  if (!provider) {
    throw new Error('expected provider')
  }
  let wallet
  const signerConfig: SignerConfig | undefined = coreEnvironmentVariables?.signer
  if (signerConfig?.type === 'kms') {
    const { keyId, awsRegion } = signerConfig
    if (!keyId) {
      throw new Error('keyId is required')
    }
    wallet = new KmsSigner({ keyId, region: awsRegion }, provider)
  } else if (signerConfig?.type === 'lambda') {
    const { keyId, awsRegion, lambdaFunctionName } = signerConfig
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
  signer.setOptions({
    gasPriceMultiplier: coreEnvironmentVariables.gasPriceMultiplier,
    initialTxGasPriceMultiplier: coreEnvironmentVariables.initialTxGasPriceMultiplier,
    maxGasPriceGwei: coreEnvironmentVariables.maxGasPriceGwei,
    priorityFeePerGasCap: coreEnvironmentVariables.priorityFeePerGasCap,
    timeTilBoostMs: coreEnvironmentVariables.timeTilBoostMs,
    maxPriorityFeeConfidenceLevel: coreEnvironmentVariables.maxPriorityFeeConfidenceLevel
  })

  cache[cacheKey] = signer
  return signer
}

// lazy instantiate
export const wallets = {
  has (network: string) {
    const coreEnvironmentVariables = CoreEnvironment.getInstance().getEnvironment()
    const privateKey = coreEnvironmentVariables?.bonderPrivateKey
    return !!constructSigner(network, privateKey)
  },
  get (network: string) {
    const coreEnvironmentVariables = CoreEnvironment.getInstance().getEnvironment()
    const privateKey = coreEnvironmentVariables?.bonderPrivateKey
    return constructSigner(network, privateKey)
  }
}
