import { useMemo, useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import qs from 'qs'
import { Hop, HopBridge } from '@hop-protocol/sdk'
import { addresses } from 'src/config'

const useBridges = (sdk: Hop) => {
  const history = useHistory()
  const location = useLocation()
  const queryParams = useMemo(() => {
    return qs.parse(location.search, { ignoreQueryPrefix: true })
  }, [location])

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
    queryParams.token = bridge.getTokenSymbol()

    history.push({
      pathname: location.pathname,
      search: qs.stringify(queryParams)
    })

    _setSelectedBridge(bridge)
  }

  return { bridges, selectedBridge, setSelectedBridge }
}

export default useBridges
