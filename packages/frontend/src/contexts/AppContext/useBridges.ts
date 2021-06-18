import { useMemo, useState, useEffect } from 'react'
import { Hop, HopBridge } from '@hop-protocol/sdk'
import { addresses } from 'src/config'

const useBridges = (sdk: Hop) => {
  const bridges = useMemo(() => {
    return Object.keys(addresses.tokens).map(symbol => {
      return sdk.bridge(symbol)
    })
  }, [sdk])

  const [selectedBridge, setSelectedBridge] = useState<HopBridge>(bridges[0])

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
