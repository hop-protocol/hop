import { GasBoostSigner } from '#gasboost/GasBoostSigner.js'
import { Wallet } from 'ethers'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import type { Signer} from 'ethers'
import type { ChainSlug } from '@hop-protocol/sdk'
import {
  MAX_PRIORITY_FEE_CONFIDENCE_LEVEL,
  INITIAL_TX_GAS_PRICE_MULTIPLIER,
  GAS_PRICE_MULTIPLIER,
  TIME_TIL_BOOST_MS,
  PRIORITY_FEE_PER_GAS_CAP
} from '#gasboost/constants.js'
import { GasBoostConfig } from '#config/index.js'

const cache: Record<string, Signer> = {}

const constructSigner = (network: string, privateKey?: string): Signer => {
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
  if (!privateKey) {
    throw new Error('private key is required to instantiate wallet')
  }
  wallet = new Wallet(privateKey, provider)

  const signer = new GasBoostSigner(wallet)
  signer.setOptions({
    gasPriceMultiplier: GAS_PRICE_MULTIPLIER,
    initialTxGasPriceMultiplier: INITIAL_TX_GAS_PRICE_MULTIPLIER,
    maxGasPriceGwei: GasBoostConfig.maxGasPriceGwei,
    priorityFeePerGasCap: PRIORITY_FEE_PER_GAS_CAP,
    timeTilBoostMs: TIME_TIL_BOOST_MS,
    maxPriorityFeeConfidenceLevel: MAX_PRIORITY_FEE_CONFIDENCE_LEVEL
  })
  cache[cacheKey] = signer
  return signer
}

// lazy instantiate
export const wallets = {
  has (network: string): boolean {
    const privateKey = GasBoostConfig.bonderPrivateKey
    return !!constructSigner(network, privateKey)
  },
  get (network: string): Signer {
    const privateKey = GasBoostConfig.bonderPrivateKey
    return constructSigner(network, privateKey)
  }
}
