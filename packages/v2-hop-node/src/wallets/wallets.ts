import { type ValidationOptions, HopSigner } from '#signer/index.js'
import { Wallet } from 'ethers'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import type { Signer} from 'ethers'
import { ChainSlug, getChain } from '@hop-protocol/sdk'
import { CLIConfig, SignerConfig } from '#config/index.js'

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

  const validationOptions: ValidationOptions = {
    clientName: CLIConfig.clientName,
    validationStatusEndpoint: SignerConfig.validationStatusEndpoint,
    validationClientUrls: {
      calldataValidationClientUrl: SignerConfig.calldataValidationClientUrl,
      stateValidationClientUrl: SignerConfig.stateValidationClientUrl
    }
  }
  const signer = new HopSigner(wallet, validationOptions)
  cache[cacheKey] = signer
  return signer
}

// lazy instantiate
export const wallets = {
  has (networkOrChainId: string): boolean {
    const privateKey = SignerConfig.bonderPrivateKey
    return !!constructSigner(networkOrChainId, privateKey)
  },
  get (networkOrChainId: string): Signer {
    const privateKey = SignerConfig.bonderPrivateKey
    return constructSigner(networkOrChainId, privateKey)
  }
}
