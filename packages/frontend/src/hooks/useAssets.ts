import { CanonicalToken, ChainSlug, HopBridge } from '@hop-protocol/sdk'
import { useMemo } from 'react'
import { hopAppNetwork } from 'src/config'
import logger from 'src/logger'
import Chain from 'src/models/Chain'

export interface UnsupportedAsset {
  chain: string
  tokenSymbol: string
}

export function useAssets(selectedBridge?: HopBridge, network?: Chain, destinationChain?: Chain) {
  // Check if asset is supported by networks
  const unsupportedAsset = useMemo<UnsupportedAsset | null>(() => {
    if (!(selectedBridge && network)) {
      return null
    }
    const unsupportedAssets = {
      Optimism: hopAppNetwork === 'kovan' ? [] : [CanonicalToken.MATIC],
      Arbitrum: hopAppNetwork === 'kovan' ? [] : [CanonicalToken.MATIC],
    }
    const selectedTokenSymbol = selectedBridge?.getTokenSymbol()
    for (const chainName in unsupportedAssets) {
      const tokenSymbols = unsupportedAssets[chainName]
      for (const tokenSymbol of tokenSymbols) {
        const isUnsupported =
          selectedTokenSymbol === tokenSymbol &&
          [network?.slug, destinationChain?.slug].includes(chainName.toLowerCase() as ChainSlug)
        if (isUnsupported) {
          return {
            chain: chainName,
            tokenSymbol,
          }
        }
      }
    }

    return null
  }, [selectedBridge, network, destinationChain])

  // Set source token
  const sourceToken = useMemo(() => {
    try {
      if (!network || !selectedBridge || unsupportedAsset?.chain) return
      return selectedBridge.getCanonicalToken(network?.slug)
    } catch (err) {
      logger.error(err)
    }
  }, [unsupportedAsset, selectedBridge, network])

  // Set destination token
  const destinationToken = useMemo(() => {
    try {
      if (!destinationChain || !selectedBridge || unsupportedAsset?.chain) return
      return selectedBridge.getCanonicalToken(destinationChain?.slug)
    } catch (err) {
      logger.error(err)
    }
  }, [unsupportedAsset, selectedBridge, destinationChain])

  // Set placeholder token
  const placeholderToken = useMemo(() => {
    if (!selectedBridge) return
    return selectedBridge.getL1Token()
  }, [selectedBridge])

  return {
    unsupportedAsset,
    sourceToken,
    destinationToken,
    placeholderToken,
  }
}
