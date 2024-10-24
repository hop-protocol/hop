import { type ValidationOptions, HopSigner } from '#signer/index.js'
import { Wallet } from 'ethers'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import type { Signer} from 'ethers'
import { ChainSlug, getChain } from '@hop-protocol/sdk'
import { Config } from '#config/index.js'

const cache: Record<string, Signer> = {}

const constructSigner = (networkOrChainId: string, privateKey?: string): Signer => {
  let network = networkOrChainId
  if (!(Object.values(ChainSlug).includes(networkOrChainId as ChainSlug))) {
    network = getChain(networkOrChainId).slug
  }
  const cacheKey = `${network}`
  const cachedValue = cache[cacheKey]
  if (typeof cachedValue !== 'undefined') {
    return cachedValue
  }

  if (!privateKey) {
    throw new Error('private key is required to instantiate wallet')
  }

  const provider = getRpcProvider(network as ChainSlug)
  const wallet = new Wallet(privateKey, provider)

  const validationOptions: ValidationOptions = Config.SignerConfig.validation
  const signer = new HopSigner(wallet, validationOptions)
  cache[cacheKey] = signer
  return signer
}

// lazy instantiate
export const wallets = {
  has (networkOrChainId: string): boolean {
    return !!constructSigner(networkOrChainId)
  },
  get (networkOrChainId: string): Signer {
    const privateKey = Config.SignerConfig.shared.bonderPrivateKey
    return constructSigner(networkOrChainId, privateKey)
  }
}
