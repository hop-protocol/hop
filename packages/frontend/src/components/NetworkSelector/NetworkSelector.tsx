import React, { useMemo } from 'react'
import Box from '@material-ui/core/Box'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import { useApp } from 'src/contexts/AppContext'
import FlatSelect from '../selects/FlatSelect'
import { useNetworkSelectorStyles } from './useNetworkSelectorStyles'
import { findNetworkBySlug } from 'src/utils'
import Network from 'src/models/Network'

interface Props {
  network?: Network
  setNetwork?: (network: Network) => void
  onChange?: (e: any) => void
  availableNetworks?: Network[] | any[]
}

export function NetworkSelector({ network, setNetwork, availableNetworks, onChange }: Props) {
  const { networks: allNetworks } = useApp()
  const styles = useNetworkSelectorStyles()
  const networks = useMemo(
    () => (availableNetworks?.length ? availableNetworks : allNetworks),
    [availableNetworks, allNetworks]
  )

  function selectNetwork(event: any) {
    if (onChange) {
      return onChange(event)
    }
    const match = findNetworkBySlug(event.target.value, networks)

    if (setNetwork && match) {
      setNetwork(match)
    }
  }

  return (
    <FlatSelect value={network?.slug || 'default'} onChange={selectNetwork}>
      <MenuItem value="default">
        <Box display="flex" alignItems="center" height="3.8rem" pl="1.2rem">
          <Typography className={styles.selectNetworkText}>
            Select Network
          </Typography>
        </Box>
      </MenuItem>

      {networks.map(network => (
        <MenuItem value={network.slug} key={network.slug}>
          <Box className={styles.networkSelectionBox}>
            <Box className={styles.networkIconContainer}>
              <img src={network.imageUrl} className={styles.networkIcon} alt={network.name} />
            </Box>
            <Typography variant="subtitle2" className={styles.networkLabel}>
              {network.name}
            </Typography>
          </Box>
        </MenuItem>
      ))}
    </FlatSelect>
  )
}
