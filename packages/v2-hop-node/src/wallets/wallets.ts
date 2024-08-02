import { GasBoostSigner } from '#gasboost/GasBoostSigner.js'
import { Wallet } from 'ethers'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import type { Signer} from 'ethers'
import type { ChainSlug } from '@hop-protocol/sdk'
import { SignerConfig } from '#config/index.js'

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
  cache[cacheKey] = signer
  return signer
}

// lazy instantiate
export const wallets = {
  has (network: string): boolean {
    const privateKey = SignerConfig.bonderPrivateKey
    return !!constructSigner(network, privateKey)
  },
  get (network: string): Signer {
    const privateKey = SignerConfig.bonderPrivateKey
    return constructSigner(network, privateKey)
  }
}
