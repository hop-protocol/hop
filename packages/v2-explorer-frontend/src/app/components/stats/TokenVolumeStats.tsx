import React from 'react'
import { useFetchVolumeStats } from '../../hooks/useFetchVolumeStats'
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Grid, 
  Avatar, 
  Divider, 
  useTheme 
} from '@mui/material'

export const TokenVolumeStats: React.FC = () => {
  const { volumeStats, loading, error } = useFetchVolumeStats()
  const theme = useTheme()

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%" minHeight={180}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Box p={2} color="error.main">
        <Typography variant="subtitle1">Failed to load token volume statistics</Typography>
      </Box>
    )
  }

  const tokenVolumes = volumeStats?.stats?.tokenVolumes || {}
  const tokenEntries = Object.entries(tokenVolumes)

  if (tokenEntries.length === 0) {
    return (
      <Box p={2} textAlign="center">
        <Typography variant="subtitle1" color="text.secondary">No token volume data available</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Volume by Token
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {tokenEntries.map(([tokenSymbol, tokenData]) => (
          <Grid item xs={12} sm={6} md={4} key={tokenSymbol}>
            <Box 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <Avatar 
                src={tokenData.tokenImageUrl}
                alt={tokenSymbol}
                sx={{ 
                  width: 50, 
                  height: 50, 
                  mb: 1,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              >
                {tokenSymbol.charAt(0)}
              </Avatar>
              
              <Typography 
                variant="h6" 
                fontWeight="bold"
                color="text.primary"
                gutterBottom
              >
                {tokenSymbol}
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  gap: 0.5 
                }}
              >
                <Typography 
                  variant="h5" 
                  fontWeight="bold" 
                  color="primary" 
                  sx={{ letterSpacing: '0.02em' }}
                >
                  {tokenData.totalUsdDisplay ?? '$0'}
                </Typography>
                
                <Typography 
                  variant="body1"
                  color="text.secondary"
                  sx={{ 
                    fontWeight: 'medium',
                    letterSpacing: '0.02em'
                  }}
                >
                  {tokenData.totalVolumeFormatted ?? '0'} {tokenSymbol}
                </Typography>
              </Box>
              
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ mt: 1 }}
              >
                Total Volume
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
