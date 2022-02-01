import React, { useMemo, useState } from 'react'
import { Box, MenuItem, Typography } from '@material-ui/core'
import { useApp } from 'src/contexts/AppContext'
import FlatSelect from '../selects/FlatSelect'
import { useNetworkSelectorStyles } from './useNetworkSelectorStyles'
import { Flex, Text } from '../ui'
import { findNetworkBySlug } from 'src/utils'
import Network from 'src/models/Network'

interface Props {
  network?: Network
  setNetwork?: (network: Network) => void
  onChange?: (e: any) => void
  availableNetworks?: Network[] | any[]
}

function NetworkSelector({ network, setNetwork, availableNetworks, onChange }: Props) {
  const { networks: allNetworks } = useApp()
  const styles = useNetworkSelectorStyles()
  const networks = useMemo(
    () => (availableNetworks?.length ? availableNetworks : allNetworks),
    [availableNetworks, allNetworks]
  )

  function selectNetwork(event) {
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
        <Flex alignCenter height="3.8rem" pl="1.2rem">
          <Text
            fontSize="1.6rem"
            fontWeight={700}
            ml=".4rem"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            Select Network
          </Text>
        </Flex>
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
