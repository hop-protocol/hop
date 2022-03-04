import { ChainSlug } from '@hop-protocol/sdk'
import { useEffect, useState } from 'react'
import { DisabledRoute, disabledRoutes, ALL } from 'src/config/disabled'
import Network from 'src/models/Network'
import { isSameNetwork } from 'src/utils'

export function useDisableTxs(
  sourceChain?: Network | ChainSlug,
  destinationChain?: Network | ChainSlug
) {
  const [disabledTx, setDisabledTx] = useState<DisabledRoute | undefined>()

  useEffect(() => {
    for (const disabledRoute of disabledRoutes) {
      const { destination, source } = disabledRoute

      if (source === ALL && isSameNetwork(destinationChain, destination as ChainSlug)) {
        return setDisabledTx(disabledRoute)
      }

      if (destination === ALL && isSameNetwork(sourceChain, source as ChainSlug)) {
        return setDisabledTx(disabledRoute)
      }

      if (source !== ALL && destination !== ALL) {
        if (isSameNetwork(sourceChain, source) && isSameNetwork(destinationChain, destination)) {
          return setDisabledTx(disabledRoute)
        }
      }

      setDisabledTx(undefined)
    }
  }, [sourceChain, destinationChain])

  return {
    disabledTx,
  }
}
