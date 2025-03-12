import React from 'react'
import { useFetchVolumeStats } from '../../hooks/useFetchVolumeStats'
import { Box, Typography } from '@mui/material'

export const TotalVolumeStats: React.FC = () => {
  const { volumeStats, loading, error } = useFetchVolumeStats()

  if (loading || error) {
    return null
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" color="textPrimary">
          Stats
        </Typography>
        {volumeStats?.lastUpdated && (
          <Typography variant="body2" color="textSecondary">
            Last Updated: {volumeStats.lastUpdated}
          </Typography>
        )}
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5" gutterBottom color="secondary">
          Total Volume
        </Typography>
        <Typography variant="h4" color="primary">
          {volumeStats?.stats?.totalVolume?.totalUsdDisplay ?? ''}
        </Typography>
      </Box>
    </Box>
  )
}
