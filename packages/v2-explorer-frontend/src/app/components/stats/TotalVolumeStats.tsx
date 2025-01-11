import React from 'react'
import { useFetchVolumeStats } from '../../hooks/useFetchVolumeStats'
import { Box, Typography } from '@mui/material'

export const TotalVolumeStats: React.FC = () => {
  const { volumeStats, loading, error } = useFetchVolumeStats({})

  if (loading || error) {
    return null
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="body2" gutterBottom>
        Total Volume
      </Typography>
      <Typography variant="body1" color="primary">
        {volumeStats?.stats?.totalVolume?.totalUsdDisplay ?? ''}
      </Typography>
    </Box>
  )
}
