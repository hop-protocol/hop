import React from 'react'
import { useFetchVolumeStats } from '../../hooks/useFetchVolumeStats'
import { Box, Typography, CircularProgress, Stack, useTheme } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ShowChartIcon from '@mui/icons-material/ShowChart'

export const TotalVolumeStats: React.FC = () => {
  const { volumeStats, loading, error } = useFetchVolumeStats()
  const theme = useTheme()

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%" minHeight={120}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Box p={2} color="error.main">
        <Typography variant="subtitle1">Failed to load volume statistics</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Stack spacing={1}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h5" fontWeight="bold" color="primary">
            Total Protocol Volume
          </Typography>
          {volumeStats?.lastUpdated && (
            <Typography variant="caption" color="text.secondary">
              Updated: {new Date(volumeStats.lastUpdated).toLocaleString()}
            </Typography>
          )}
        </Box>

        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center"
          py={2}
          position="relative"
        >
          {/* Background icon */}
          <Box 
            sx={{
              position: 'absolute',
              opacity: 0.07,
              transform: 'scale(4)',
              zIndex: 0,
            }}
          >
            <ShowChartIcon fontSize="large" />
          </Box>
          
          {/* Main value */}
          <Typography variant="h3" fontWeight="bold" color="primary" sx={{ zIndex: 1 }}>
            {volumeStats?.stats?.totalVolume?.totalUsdDisplay ?? '$0'}
          </Typography>
          
          <Box 
            mt={1}
            display="flex" 
            alignItems="center" 
            px={2} 
            py={0.5} 
            bgcolor={theme.palette.success.light} 
            borderRadius={5}
            sx={{ zIndex: 1 }}
          >
            <TrendingUpIcon 
              fontSize="small" 
              sx={{ color: theme.palette.success.dark, mr: 0.5 }} 
            />
            <Typography variant="body2" fontWeight="medium" color={theme.palette.success.dark}>
              All-time volume
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
