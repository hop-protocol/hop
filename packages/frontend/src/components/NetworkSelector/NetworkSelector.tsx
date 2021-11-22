import React from 'react'
import { Box, MenuItem, Typography } from '@material-ui/core'
import { useApp } from 'src/contexts/AppContext'
import FlatSelect from '../selects/FlatSelect'
import { useNetworkSelectorStyles } from './useNetworkSelectorStyles'

function NetworkSelector({ network, setNetwork }) {
  const { networks } = useApp()
  const styles = useNetworkSelectorStyles()

  function selectNetwork(event) {
    const match = networks.find(_network => _network.slug === event.target.value)
    setNetwork(match)
  }

  return (
    <FlatSelect value={network?.slug || 'default'} onChange={selectNetwork}>
      <MenuItem value="default">
        <Box display="flex" flexDirection="row" alignItems="center" className={styles.defaultLabel}>
          <Typography variant="subtitle2" className={styles.networkLabel}>
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

export default NetworkSelector
