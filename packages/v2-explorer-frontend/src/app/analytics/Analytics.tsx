'use client'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import useMediaQuery from '@mui/material/useMediaQuery'
import { TotalVolumeStats } from '@/app/components/stats/TotalVolumeStats'
import { TokenVolumeStats } from '@/app/components/stats/TokenVolumeStats'
import { VolumeChart } from '@/app/components/VolumeChart'
import { CumulativeVolumeChart } from '@/app/components/CumulativeVolumeChart'
import InsightsIcon from '@mui/icons-material/Insights'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import SankeyChart from '@/app/components/charts/SankeyChart'
import { useFetchSankeyData } from '@/app/hooks/useFetchSankeyData'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@/app/hooks/useTheme'
import { CumulativeTransfersChart } from '@/app/components/CumulativeTransfersChart'
import { TotalTransfersStats } from '@/app/components/stats/TotalTransfersStats'
import { CumulativeVolumeByChainChart } from '@/app/components/stats/CumulativeVolumeByChainChart'
import { CombinedVolumeTransferStats } from '@/app/components/stats/CombinedVolumeTransferStats'

// Helper function for formatting dates
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

// Time range options component
const TimeRangeSelect = ({ value, onChange, label = "Time Range" }: { value: string, onChange: (event: SelectChangeEvent) => void, label?: string }) => (
  <FormControl sx={{ minWidth: 150 }}>
    <InputLabel id={`${label.toLowerCase()}-select-label`}>{label}</InputLabel>
    <Select
      labelId={`${label.toLowerCase()}-select-label`}
      value={value}
      label={label}
      onChange={onChange}
    >
      <MenuItem value={"7"}>7 days</MenuItem>
      <MenuItem value={"30"}>30 days</MenuItem>
      <MenuItem value={"90"}>90 days</MenuItem>
      <MenuItem value={"365"}>365 days</MenuItem>
    </Select>
  </FormControl>
);

export function Analytics() {
  const { theme, dark: isDarkMode } = useTheme()
  const [volumeTimeRange, setVolumeTimeRange] = useState<string>("30")
  const [sankeyTimeRange, setSankeyTimeRange] = useState<string>("30")
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const handleVolumeTimeRangeChange = (event: SelectChangeEvent) => {
    setVolumeTimeRange(event.target.value)
  }

  const handleSankeyTimeRangeChange = (event: SelectChangeEvent) => {
    setSankeyTimeRange(event.target.value)
  }

  // Calculate responsive heights with more granular breakpoints
  const sankeyChartHeight = isMobile 
    ? 350  // Smaller height for mobile devices
    : isTablet 
      ? 450  // Medium height for tablets
      : 550; // Full height for desktops
  
  // Fetch sankey data using our custom hook
  const { sankeyData, loading: sankeyLoading, error: sankeyError, lastUpdated } = useFetchSankeyData({
    days: parseInt(sankeyTimeRange)
  })

  // Get time range text for subtitle
  const getTimeRangeText = (days: number) => {
    switch (days) {
      case 7:
        return 'Last 7 days'
      case 30:
        return 'Last 30 days'
      case 90:
        return 'Last 90 days'
      case 365:
        return 'Last year'
      default:
        return `Last ${days} days`
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 5 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            whiteSpace: 'nowrap',
            mb: 1
          }}
        >
          <InsightsIcon 
            sx={{ 
              fontSize: '2.2rem',
              color: theme.palette.primary.main,
              mr: 1
            }} 
          />
          <Typography variant="h3" component="h1" fontWeight="bold" color="text.primary">
            Analytics
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          Track volume and activity across the network
        </Typography>
      </Box>

      {/* Main Stats Overview */}
      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', minHeight: 400 }}>
            <CombinedVolumeTransferStats isDarkMode={isDarkMode} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={isDarkMode ? 3 : 2}
            sx={{ 
              p: 3, 
              height: '100%',
              height: 400,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              background: isDarkMode 
                ? `linear-gradient(145deg, rgba(30, 40, 50, 0.8) 0%, rgba(25, 25, 35, 0.9) 100%)`
                : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,245,255,0.9) 100%)',
            }}
          >
            <TokenVolumeStats />
          </Paper>
        </Grid>
      </Grid>

      {/* Cumulative Volume Chart */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <CumulativeVolumeChart 
          title="Cumulative Volume by Token" 
          key="cumulative-volume"
        />
      </Paper>

      {/* Cumulative Transfers Chart */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">Cumulative Transfers</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Total number of transfers over time
          </Typography>
        </Box>
        <CumulativeTransfersChart 
          title="Cumulative Transfers" 
          key="cumulative-transfers"
        />
      </Paper>

      {/* Cumulative Volume by Chain Chart */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">Cumulative Volume by Chain</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Total volume by chain over time
          </Typography>
        </Box>
        <CumulativeVolumeByChainChart days={parseInt(volumeTimeRange)} />
      </Paper>
      
      {/* Daily Volume Chart */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          mb: 5
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Typography variant="h5" fontWeight="bold">Daily Volume by Token</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {getTimeRangeText(parseInt(volumeTimeRange))}
            </Typography>
          </Box>
          <TimeRangeSelect value={volumeTimeRange} onChange={handleVolumeTimeRangeChange} />
        </Box>
        <VolumeChart 
          days={parseInt(volumeTimeRange)}
          key={`daily-volume-${volumeTimeRange}`}
        />
      </Paper>
     {/* Sankey Chart */}
     <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Box display="flex" alignItems="center">
              <AccountTreeIcon 
                sx={{ 
                  fontSize: '2rem',
                  color: theme.palette.primary.main,
                  mr: 1.5
                }} 
              />
              <Box>
                <Typography variant="h5" fontWeight="bold">Token Flow Visualization</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {getTimeRangeText(parseInt(sankeyTimeRange))} • {lastUpdated ? `Last updated: ${formatDate(new Date(lastUpdated))}` : 'Loading data...'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <TimeRangeSelect value={sankeyTimeRange} onChange={handleSankeyTimeRangeChange} />
        </Box>
        
        <Box sx={{ 
          height: sankeyChartHeight, 
          width: '100%', 
          position: 'relative',
          transition: 'height 0.3s ease-in-out'
        }}>
          {sankeyLoading && (
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.5)',
              zIndex: 10
            }}>
              <CircularProgress />
            </Box>
          )}
          
          {sankeyData ? (
            <SankeyChart 
              data={sankeyData} 
              height={sankeyChartHeight}
              key={`sankey-${sankeyTimeRange}`}
            />
          ) : (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: sankeyChartHeight,
              color: 'text.secondary'
            }}>
              <Typography>
                No transfers found in the selected time range
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            The width of each flow represents the volume of tokens transferred between networks.
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}
