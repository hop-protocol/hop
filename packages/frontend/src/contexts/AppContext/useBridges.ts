import useQueryParams from '#hooks/useQueryParams.js'
import { Hop, HopBridge, TToken } from '@hop-protocol/sdk'
import { addresses } from '#config/index.js'
import { findMatchingBridge } from '#utils/index.js'
import { useEffect, useMemo, useState } from 'react'

const useBridges = (sdk: Hop) => {
  const { queryParams, updateQueryParams, location } = useQueryParams()

  const bridges = useMemo(() => {
    return Object.keys(addresses.tokens).map(symbol => {
      return sdk.bridge(symbol as TToken)
    })
  }, [sdk])

  const queryParamBridge = useMemo(
    () => {
      return findMatchingBridge(bridges, queryParams.token as string)
    }, [bridges, queryParams]
  )

  const [selectedBridge, _setSelectedBridge] = useState<HopBridge>(queryParamBridge ?? bridges[0])

  useEffect(() => {
    if (queryParamBridge) {
      _setSelectedBridge(queryParamBridge)
    }
  }, [queryParamBridge])

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
