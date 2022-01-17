import { useMemo, useState, useEffect } from 'react'
import { Hop, HopBridge, TToken } from '@hop-protocol/sdk'
import { addresses } from 'src/config'
import useQueryParams from 'src/hooks/useQueryParams'
import { findMatchingBridge } from 'src/utils'

const useBridges = (sdk: Hop) => {
  const { queryParams, updateQueryParams, location } = useQueryParams()

  const bridges = useMemo(() => {
    return Object.keys(addresses.tokens).map(symbol => {
      return sdk.bridge(symbol as TToken)
    })
  }, [sdk])

  const queryParamBridge = useMemo(
    () => findMatchingBridge(bridges, queryParams.token as string),
    [bridges, queryParams]
  )

  const [selectedBridge, _setSelectedBridge] = useState<HopBridge>(queryParamBridge ?? bridges[0])

  const setSelectedBridge = (bridge: HopBridge) => {
    if (!location.pathname.startsWith('/tx')) {
      updateQueryParams({
        token: bridge.getTokenSymbol(),
      })
    }

    _setSelectedBridge(bridge)
  }

  useEffect(() => {
    if (!(selectedBridge && bridges.length)) {
      return
    }

    const matchingBridge = findMatchingBridge(bridges, selectedBridge.getTokenSymbol())

    if (matchingBridge) {
      setSelectedBridge(matchingBridge)
    } else {
      setSelectedBridge(bridges[0])
    }
  }, [selectedBridge, bridges])

  return { bridges, selectedBridge, setSelectedBridge }
}

export default useBridges
