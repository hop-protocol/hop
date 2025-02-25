import React from 'react'
import { useFetchVolumeStats } from '../../hooks/useFetchVolumeStats'
import { Box, Typography } from '@mui/material'

export const TokenVolumeStats: React.FC = () => {
  const { volumeStats, loading, error } = useFetchVolumeStats()

  if (loading || error) {
    return null
  }

  const tokenVolumes = volumeStats?.stats?.tokenVolumes || {}

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {Object.entries(tokenVolumes).map(([tokenSymbol, tokenData]) => (
        <Box key={tokenSymbol} display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Typography variant="subtitle1" gutterBottom color="secondary">
            <strong>{tokenSymbol}</strong> Total Volume
          </Typography>
          <Typography variant="h5" color="secondary">
            {tokenData.totalUsdDisplay ?? ''}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
