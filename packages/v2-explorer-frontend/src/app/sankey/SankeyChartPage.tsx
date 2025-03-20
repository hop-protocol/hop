'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Paper, Divider, Grid, Alert, Link, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, CircularProgress } from '@mui/material'
import SankeyChart from '../components/charts/SankeyChart'
import { useTheme } from '@mui/material/styles'
import InfoIcon from '@mui/icons-material/Info'
import { useFetchSankeyData } from '../hooks/useFetchSankeyData'

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

export function SankeyChartPage() {
  const theme = useTheme()
  const [isClient, setIsClient] = useState(false)
  const [timeRange, setTimeRange] = useState<number>(30) // Default to 30 days
  
  // Set isClient to true after component mounts on client
  useEffect(() => {
    console.log("[SankeyChartPage] Component mounted")
    setIsClient(true)
    
    // Debug window and document objects
    console.log("[SankeyChartPage] Window object available:", typeof window !== 'undefined')
    console.log("[SankeyChartPage] Document object available:", typeof document !== 'undefined')
    
    // Check for global d3 object
    if (typeof window !== 'undefined') {
      console.log("[SankeyChartPage] Global d3 object:", (window as any).d3 ? "Available" : "Not available")
    }
    
    return () => {
      console.log("[SankeyChartPage] Component unmounting")
    }
  }, [])
  
  // Fetch sankey data using our custom hook
  const { sankeyData, loading, error, lastUpdated } = useFetchSankeyData({
    days: timeRange
  })
  
  // Handle time range changes
  const handleTimeRangeChange = (event: SelectChangeEvent<number>) => {
    setTimeRange(Number(event.target.value))
  }
  
  // Get time range text for subtitle
  const getTimeRangeText = () => {
    switch (timeRange) {
      case 7:
        return 'Last 7 days'
      case 30:
        return 'Last 30 days'
      case 90:
        return 'Last 90 days'
      case 365:
        return 'Last year'
      default:
        return `Last ${timeRange} days`
    }
  }
  
  console.log("[SankeyChartPage] Rendering component, isClient =", isClient)
  
  return (
    <Box sx={{ px: 4, py: 3, maxWidth: '1200px', mx: 'auto' }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <div>
            <Typography variant="h4" sx={{ mb: 1 }}>Token Flow Visualization</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {getTimeRangeText()} • {lastUpdated ? `Last updated: ${formatDate(new Date(lastUpdated))}` : 'Loading data...'}
            </Typography>
          </div>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="time-range-select-label">Time Range</InputLabel>
            <Select
              labelId="time-range-select-label"
              id="time-range-select"
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value={7}>7 days</MenuItem>
              <MenuItem value={30}>30 days</MenuItem>
              <MenuItem value={90}>90 days</MenuItem>
              <MenuItem value={365}>365 days</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ height: '600px', width: '100%', position: 'relative' }}>
          {loading && (
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
          
          {error && (
            <Box sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}>
              <Typography color="error" variant="h6">
                Error loading data
              </Typography>
              <Typography color="text.secondary">
                {error}
              </Typography>
            </Box>
          )}
          
          {isClient && sankeyData && (
            <SankeyChart 
              data={sankeyData}
              title="Cross-Chain Transfer Flow"
              subtitle={`Visualization of token transfers between networks over the last ${getTimeRangeText()}`}
            />
          )}
          
          {isClient && !sankeyData && !loading && !error && (
            <Box sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}>
              <Typography color="text.secondary">
                No data available for the selected time range.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>About This Visualization</Typography>
        <Typography paragraph>
          This Sankey diagram visualizes the flow of tokens across different blockchain networks using the Hop Protocol. 
          The width of each flow represents the volume of tokens transferred between the source and destination networks.
        </Typography>
        <Typography paragraph>
          <strong>How to read this chart:</strong>
        </Typography>
        <Typography paragraph>
          <strong>Nodes:</strong> The boxes on the left represent source networks, while the boxes on the right represent destination networks.
          The middle section represents the tokens being transferred.
        </Typography>
        <Typography paragraph>
          <strong>Flows:</strong> The colored paths show the movement of tokens from source to destination.
          The colors represent different tokens, and the gradient effect shows the path from source to destination.
        </Typography>
        <Typography paragraph>
          <strong>Hover:</strong> Hover over any flow to see detailed information about the transfer amount and the tokens involved.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Data is refreshed every 5 minutes. The visualization shows aggregated transfer volumes for the selected time period.
        </Typography>
      </Paper>

      {/* Debug info - visible only during development */}
      {process.env.NODE_ENV === 'development' && (
        <Paper elevation={2} sx={{ p: 3, mt: 4, bgcolor: '#f5f5f5' }}>
          <Typography variant="h6">Debug Info</Typography>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify({
              isClient,
              d3Available: isClient ? typeof (window as any).d3 !== 'undefined' : false,
              theme: 'Using theme from context',
              currentTime: new Date().toISOString(),
            }, null, 2)}
          </pre>
        </Paper>
      )}
    </Box>
  )
} 