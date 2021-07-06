import { useMemo, useState, useEffect } from 'react'
import { Hop, HopBridge } from '@hop-protocol/sdk'
import { addresses } from 'src/config'
import useQueryParams from 'src/hooks/useQueryParams'

const useBridges = (sdk: Hop) => {
  const { queryParams, updateQueryParams } = useQueryParams()

  const bridges = useMemo(() => {
    return Object.keys(addresses.tokens).map(symbol => {
      return sdk.bridge(symbol)
    })
  }, [sdk])

  const [selectedBridge, _setSelectedBridge] = useState<HopBridge>(bridges[0])

  useEffect(() => {
    const _selectedBridge = bridges.find(bridge =>
      bridge.getTokenSymbol() === queryParams.token
    )

    if (_selectedBridge) {
      _setSelectedBridge(_selectedBridge)
    }
  }, [queryParams, bridges])

  const setSelectedBridge = (bridge: HopBridge) => {
    updateQueryParams({
      token: bridge.getTokenSymbol()
    })

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
