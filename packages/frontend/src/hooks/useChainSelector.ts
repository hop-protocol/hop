import { HopBridge } from '@hop-protocol/sdk'
import { ChangeEvent, useEffect, useState } from 'react'
import Chain from 'src/models/Chain'
import { findMatchingBridge, findNetworkBySlug } from 'src/utils'
import useQueryParams from './useQueryParams'

interface ChainSelectorProps {
  networks: Chain[]
  bridges: HopBridge[]
  setSelectedBridge: (b: HopBridge) => void
}

export function useChainSelector(props: ChainSelectorProps) {
  const { networks, bridges, setSelectedBridge } = props
  const [sourceChain, _setSourceChain] = useState<Chain>()
  const [destinationChain, _setDestinationChain] = useState<Chain>()

  const { queryParams, updateQueryParams } = useQueryParams()

  // Set sourceChain and destinationChain using query params
  useEffect(() => {
    const _sourceChain = findNetworkBySlug(queryParams.sourceChain as string, networks)
    _setSourceChain(_sourceChain)

    const _destinationChain = findNetworkBySlug(queryParams.destinationChain as string, networks)

    if (_sourceChain?.eq(_destinationChain)) {
      // Leave destination chain empty
      return
    }

    _setDestinationChain(_destinationChain)
  }, [queryParams, networks])

  // Change the bridge if user selects different token to send
  const handleBridgeChange = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value as string
    const bridge = findMatchingBridge(bridges, tokenSymbol)
    if (bridge) {
      setSelectedBridge(bridge)
    }
  }

  // Set sourceChain
  const setSourceChain = (network?: Chain) => {
    updateQueryParams({
      sourceChain: network?.slug ?? '',
    })
    _setSourceChain(network)
  }

  // Set destinationChain
  const setDestinationChain = (network?: Chain) => {
    updateQueryParams({
      destinationChain: network?.slug ?? '',
    })
    _setDestinationChain(network)
  }

  // Switch the sourceChain <--> destinationChain
  const handleSwitchDirection = () => {
    // setToTokenAmount('')
    setSourceChain(destinationChain)
    setDestinationChain(sourceChain)
    // updateQueryParams({
    //   sourceChain: destinationChain?.slug ?? '',
    //   destinationChain: sourceChain?.slug ?? '',
    // })
  }

  // Change the sourceChain
  const handleSourceChainChange = (network?: Chain) => {
    if (network?.slug === destinationChain?.slug) {
      handleSwitchDirection()
    } else {
      setSourceChain(network)
    }
  }

  // Change the destinationChain
  const handleDestinationChainChange = (network?: Chain) => {
    if (network?.slug === sourceChain?.slug) {
      handleSwitchDirection()
    } else {
      setDestinationChain(network)
    }
  }

  return {
    sourceChain,
    destinationChain,
    handleBridgeChange,
    handleSwitchDirection,
    handleSourceChainChange,
    handleDestinationChainChange,
  }
}
