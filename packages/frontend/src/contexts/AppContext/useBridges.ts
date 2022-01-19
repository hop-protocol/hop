import { useMemo, useState, useEffect } from 'react'
import { Hop, HopBridge, TToken } from '@hop-protocol/sdk'
import { addresses } from 'src/config'
import useQueryParams from 'src/hooks/useQueryParams'

const useBridges = (sdk: Hop) => {
  const { queryParams, updateQueryParams, location } = useQueryParams()

  const bridges = useMemo(() => {
    return Object.keys(addresses.tokens).map(symbol => {
      return sdk.bridge(symbol as TToken)
    })
  }, [sdk])

  const queryParamBridge = useMemo(() => {
    return bridges.find(bridge => bridge.getTokenSymbol() === queryParams.token)
  }, [bridges, queryParams])

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
    const updatedBridge = bridges.find(bridge => {
      return bridge.getTokenSymbol() === selectedBridge.getTokenSymbol()
    })

    if (updatedBridge) {
      setSelectedBridge(updatedBridge)
    } else {
      setSelectedBridge(bridges[0])
    }
  }, [selectedBridge, bridges])

  return { bridges, selectedBridge, setSelectedBridge }
}

export default useBridges
