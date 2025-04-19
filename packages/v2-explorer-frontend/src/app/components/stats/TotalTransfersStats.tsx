import { Box, Typography, CircularProgress, Paper } from '@mui/material'
import { useFetchTotalTransfers } from '@/app/hooks/useFetchTotalTransfers'
import { formatNumber } from '@/app/utils/format'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { useTheme } from '@mui/material/styles'

export const TotalTransfersStats = () => {
  const { totalTransfersStats, loading, error } = useFetchTotalTransfers()
  const theme = useTheme()

  if (loading) {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
          minHeight: 200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress />
      </Paper>
    )
  }

  if (error) {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
          minHeight: 200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography color="error">Error loading total transfers: {error}</Typography>
      </Paper>
    )
  }

  const count = totalTransfersStats?.stats?.count ?? '0'
  const lastUpdated = totalTransfersStats?.lastUpdated

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        borderRadius: 2,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-2px)',
          transition: 'transform 0.2s ease-in-out'
        }
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute',
          top: 0,
          right: 0,
          width: 100,
          height: 100,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
          borderRadius: '50%',
          transform: 'translate(30%, -30%)'
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <TrendingUpIcon 
            sx={{ 
              fontSize: 32, 
              color: theme.palette.primary.main,
              mr: 2
            }} 
          />
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Total Transfers
          </Typography>
        </Box>
        <Typography 
          variant="h3" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            mb: 1
          }}
        >
          {formatNumber(parseInt(count))}
        </Typography>
        {lastUpdated && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              opacity: 0.8,
              fontStyle: 'italic'
            }}
          >
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </Typography>
        )}
      </Box>
    </Paper>
  )
}