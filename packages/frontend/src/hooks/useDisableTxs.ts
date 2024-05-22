import Network from '#models/Network.js'
import { ALL, DisabledRoute, disabledRoutes } from '#config/disabled.js'
import { ChainSlug } from '@hop-protocol/sdk'
import { isSameNetwork } from '#utils/index.js'
import { useEffect, useState } from 'react'

export function useDisableTxs(
  sourceChain?: Network | ChainSlug,
  destinationChain?: Network | ChainSlug,
  sourceTokenSymbol?: string
) {
  const [disabledTx, setDisabledTx] = useState<DisabledRoute | undefined>()

  useEffect(() => {
    for (const disabledRoute of disabledRoutes) {
      const { source, destination, tokenSymbol } = disabledRoute

      if (source === ALL && isSameNetwork(destinationChain, destination as ChainSlug)) {
        if (tokenSymbol && sourceTokenSymbol) {
          if (sourceTokenSymbol.includes(tokenSymbol)) {
            return setDisabledTx(disabledRoute)
          }
        } else {
          return setDisabledTx(disabledRoute)
        }
      }

      if (destination === ALL && isSameNetwork(sourceChain, source as ChainSlug)) {
        if (tokenSymbol && sourceTokenSymbol) {
          if (sourceTokenSymbol.includes(tokenSymbol)) {
            return setDisabledTx(disabledRoute)
          }
        } else {
          return setDisabledTx(disabledRoute)
        }
      }

      if (source !== ALL && destination !== ALL) {
        if (isSameNetwork(sourceChain, source) && isSameNetwork(destinationChain, destination)) {
          if (tokenSymbol && sourceTokenSymbol) {
            if (sourceTokenSymbol.includes(tokenSymbol)) {
              return setDisabledTx(disabledRoute)
            }
          } else {
            return setDisabledTx(disabledRoute)
          }
        }
      }

      setDisabledTx(undefined)
    }
  }, [sourceChain, destinationChain, sourceTokenSymbol])

  return {
    disabledTx,
  }
}
