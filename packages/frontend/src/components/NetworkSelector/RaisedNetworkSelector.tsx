import React, { useMemo } from 'react'
import { MenuItem } from '@material-ui/core'
import { useApp } from 'src/contexts/AppContext'
import { Flex, Text } from '../ui'
import { findNetworkBySlug } from 'src/utils'
import Network from 'src/models/Network'
import RaisedSelect from '../selects/RaisedSelect'
import SelectOption from '../selects/SelectOption'

interface Props {
  selectedNetwork?: Network
  onSelect?: (e: any) => void
  availableNetworks?: Network[]
  setNetwork?: (n: Network) => void
}

export function RaisedNetworkSelector(props: Props) {
  const { selectedNetwork, onSelect, setNetwork, availableNetworks } = props
  const { networks: allNetworks } = useApp()
  const networks = useMemo(
    () => (availableNetworks?.length ? availableNetworks : allNetworks),
    [availableNetworks, allNetworks]
  )

  function selectNetwork(event) {
    if (onSelect) {
      return onSelect(event)
    }
    const match = findNetworkBySlug(event.target.value, networks)
    if (setNetwork && match) {
      setNetwork(match)
    }
  }

  return (
    <RaisedSelect value={selectedNetwork?.slug} onChange={selectNetwork}>
      {networks.map(network => (
        <MenuItem value={network.slug} key={network.slug}>
          <SelectOption value={network.slug} icon={network.imageUrl} label={network.name} />
        </MenuItem>
      ))}
    </RaisedSelect>
  )
}
