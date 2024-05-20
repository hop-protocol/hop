import Network from 'src/models/Network'
import { ALL, DisabledRoute, disabledRoutes } from 'src/config/disabled'
import { ChainSlug } from '@hop-protocol/sdk'
import { isSameNetwork } from 'src/utils'
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
