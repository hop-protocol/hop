import { config as coreConfig } from '@hop-protocol/core/config'
import { reactAppNetwork } from 'src/config'
import { getNativeTokenSymbol } from './getNativeTokenSymbol'

export function getDefaultSendGasLimit(chainSlug: string, tokenSymbol: string) {
  const nativeTokenSymbol = getNativeTokenSymbol(chainSlug)
  const defaultGasLimit = coreConfig[reactAppNetwork]?.defaultSendGasLimit?.[tokenSymbol === nativeTokenSymbol ? 'native' : 'token']?.[chainSlug]
  if (!defaultGasLimit) {
    throw new Error(`default send gas limit not found for chain ${chainSlug} and token ${tokenSymbol}`)
  }
  return defaultGasLimit
}
