import { Box, Typography, CircularProgress } from '@mui/material'
import { useFetchTotalTransfers } from '@/app/hooks/useFetchTotalTransfers'
import { formatNumber } from '@/app/utils/format'

export const TotalTransfersStats = () => {
  const { totalTransfersStats, loading, error } = useFetchTotalTransfers()

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <Typography color="error">Error loading total transfers: {error}</Typography>
      </Box>
    )
  }

  const count = totalTransfersStats?.stats?.count ?? '0'
  const lastUpdated = totalTransfersStats?.lastUpdated

  return (
    <Box>
      <Typography variant="h4" component="div" gutterBottom>
        {formatNumber(parseInt(count))} Transfers
      </Typography>
      {lastUpdated && (
        <Typography variant="body2" color="text.secondary">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </Typography>
      )}
    </Box>
  )
} 