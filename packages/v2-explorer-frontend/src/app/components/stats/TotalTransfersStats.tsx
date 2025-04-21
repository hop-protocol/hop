import { Box, Typography, CircularProgress, Paper, Stack } from '@mui/material'
import { useFetchTotalTransfers } from '@/app/hooks/useFetchTotalTransfers'
import { formatNumber } from '@/app/utils/format'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { useTheme } from '@mui/material/styles'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'

export const TotalTransfersStats = () => {
  const { totalTransfersStats, loading, error } = useFetchTotalTransfers()
  const theme = useTheme()

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%" minHeight={120}>
        <CircularProgress size={40} thickness={4} suppressHydrationWarning />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={2} color="error.main">
        <Typography variant="subtitle1">Failed to load transfer statistics</Typography>
      </Box>
    )
  }

  const count = totalTransfersStats?.stats?.count ?? '0'
  const lastUpdated = totalTransfersStats?.lastUpdated

  return (
    <Box>
      <Stack spacing={0.5}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h5" fontWeight="bold" color="primary">
            Total Transfers
          </Typography>
          {lastUpdated && (
            <Typography variant="caption" color="text.secondary">
              Updated: {new Date(lastUpdated).toLocaleString()}
            </Typography>
          )}
        </Box>

        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center"
          py={1}
          position="relative"
        >
          {/* Background icon */}
          <Box 
            sx={{
              position: 'absolute',
              opacity: 0.07,
              transform: 'scale(3.5)',
              zIndex: 0,
            }}
          >
            <SwapHorizIcon fontSize="large" />
          </Box>
          
          {/* Main value */}
          <Typography variant="h3" fontWeight="bold" color="primary" sx={{ zIndex: 1 }}>
            {formatNumber(parseInt(count))}
          </Typography>
          
          <Box 
            mt={0.5}
            display="flex" 
            alignItems="center" 
            px={2} 
            py={0.5} 
            bgcolor={theme.palette.info.light} 
            borderRadius={5}
            sx={{ zIndex: 1 }}
          >
            <SwapHorizIcon 
              fontSize="small" 
              sx={{ color: theme.palette.info.dark, mr: 0.5 }} 
            />
            <Typography variant="body2" fontWeight="medium" color={theme.palette.info.dark}>
              All-time transfers
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}