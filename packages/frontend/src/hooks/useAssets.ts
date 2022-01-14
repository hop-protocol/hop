import { HopBridge } from '@hop-protocol/sdk'
import { useMemo } from 'react'
import { hopAppNetwork } from 'src/config'
import logger from 'src/logger'
import Network from 'src/models/Network'

export function useAssets(selectedBridge?: HopBridge, fromNetwork?: Network, toNetwork?: Network) {
  // Check if asset is supported by networks
  const unsupportedAsset = useMemo<any>(() => {
    if (!(selectedBridge && fromNetwork && toNetwork)) {
      return null
    }
    const unsupportedAssets = {
      Optimism: hopAppNetwork === 'kovan' ? [] : ['MATIC'],
      Arbitrum: hopAppNetwork === 'kovan' ? [] : ['MATIC'],
    }

    for (const chain in unsupportedAssets) {
      const tokenSymbols = unsupportedAssets[chain]
      for (const tokenSymbol of tokenSymbols) {
        const isUnsupported =
          selectedBridge?.getTokenSymbol() === tokenSymbol &&
          [fromNetwork?.slug, toNetwork?.slug].includes(chain.toLowerCase())
        if (isUnsupported) {
          return {
            chain,
            tokenSymbol,
          }
        }
      }
    }

    return null
  }, [selectedBridge, fromNetwork, toNetwork])

  // Set source token
  const sourceToken = useMemo(() => {
    try {
      if (!fromNetwork || !selectedBridge || unsupportedAsset?.chain) return
      return selectedBridge.getCanonicalToken(fromNetwork?.slug)
    } catch (err) {
      logger.error(err)
    }
  }, [unsupportedAsset, selectedBridge, fromNetwork])

  // Set destination token
  const destToken = useMemo(() => {
    try {
      if (!toNetwork || !selectedBridge || unsupportedAsset?.chain) return
      return selectedBridge.getCanonicalToken(toNetwork?.slug)
    } catch (err) {
      logger.error(err)
    }
  }, [unsupportedAsset, selectedBridge, toNetwork])

  // Set placeholder token
  const placeholderToken = useMemo(() => {
    if (!selectedBridge) return
    return selectedBridge.getL1Token()
  }, [selectedBridge])

  return {
    unsupportedAsset,
    sourceToken,
    destToken,
    placeholderToken,
  }
}
