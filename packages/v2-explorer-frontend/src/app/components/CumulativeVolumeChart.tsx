'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useFetchCumulativeVolumeStats } from '@/app/hooks/useFetchCumulativeVolumeStats'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ShowChartIcon from '@mui/icons-material/ShowChart'

type CumulativeVolumeChartProps = {
  pathId?: string
  days?: number
  title?: string
}

export const CumulativeVolumeChart: React.FC<CumulativeVolumeChartProps> = ({ 
  pathId, 
  days = 30,
  title = 'Cumulative Volume by Token'
}) => {
  const [periodDays, setPeriodDays] = useState<string>(String(days))
  const [useLogScale, setUseLogScale] = useState<boolean>(false)
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const { cumulativeVolumeStats, loading, error } = useFetchCumulativeVolumeStats({ 
    pathId, 
    days: parseInt(periodDays) 
  })
  
  // Prepare individual token charts
  const [tokenData, setTokenData] = useState<{[key: string]: {
    ref: React.RefObject<HTMLCanvasElement>,
    instance: any
  }}>({})

  // Format numbers for display with proper token amounts
  const formatTokenAmount = (value: number, tokenSymbol: string): string => {
    if (value === 0) return '0'
    
    // Format with appropriate precision based on the value
    if (value < 0.001) {
      return value.toExponential(2) + ' ' + tokenSymbol
    } else if (value < 1) {
      return value.toFixed(4) + ' ' + tokenSymbol
    } else if (value < 10000) {
      return value.toFixed(2) + ' ' + tokenSymbol
    } else {
      return value.toLocaleString('en-US', {
        maximumFractionDigits: 2
      }) + ' ' + tokenSymbol
    }
  }

  // Create refs when data changes
  useEffect(() => {
    if (!cumulativeVolumeStats?.data?.datasets) return;
    
    // Create refs for each token
    const newTokenData = { ...tokenData };
    
    cumulativeVolumeStats.data.datasets.forEach(dataset => {
      const tokenSymbol = dataset.label;
      if (!newTokenData[tokenSymbol]) {
        newTokenData[tokenSymbol] = {
          ref: React.createRef<HTMLCanvasElement>(),
          instance: null
        };
      }
    });
    
    setTokenData(newTokenData);
  }, [cumulativeVolumeStats?.data?.datasets]);
  
  // Set initial selected tokens
  useEffect(() => {
    if (selectedTokens.length === 0 && cumulativeVolumeStats?.data?.datasets && cumulativeVolumeStats.data.datasets.length > 0) {
      setSelectedTokens(cumulativeVolumeStats.data.datasets.map(dataset => dataset.label));
    }
  }, [cumulativeVolumeStats?.data?.datasets, selectedTokens.length]);

  // Create a chart for each token
  useEffect(() => {
    const loadChartJs = async () => {
      if (typeof window === 'undefined' || !cumulativeVolumeStats?.data || !cumulativeVolumeStats.data.datasets.length) {
        return
      }

      try {
        // Dynamic import for Chart.js
        const { Chart, registerables } = await import('chart.js')
        Chart.register(...registerables)
        
        const { labels, datasets } = cumulativeVolumeStats.data
        
        // Assign colors to datasets
        const colorScheme = [
          'rgba(75, 192, 192, 1)',   // teal
          'rgba(54, 162, 235, 1)',    // blue
          'rgba(255, 99, 132, 1)',    // red
          'rgba(255, 206, 86, 1)',    // yellow
          'rgba(153, 102, 255, 1)',   // purple
          'rgba(255, 159, 64, 1)'     // orange
        ]

        // Update or create charts for each token
        datasets.forEach((dataset, index) => {
          const tokenSymbol = dataset.label
          const chartData = tokenData[tokenSymbol]
          
          if (!chartData || !chartData.ref.current) return
          
          // Destroy existing chart if it exists
          if (chartData.instance) {
            chartData.instance.destroy()
          }
          
          // Convert string values to numbers for chart
          const numericData = dataset.data.map(value => Number(value))
          
          // Find min and max values for this dataset
          const dataValues = numericData.filter(value => value > 0) // Filter out zero values
          const minValue = dataValues.length ? Math.min(...dataValues) : 0
          const maxValue = dataValues.length ? Math.max(...dataValues) : 1
          
          // Calculate appropriate min and max for y-axis
          const yMin = Math.max(0, minValue * 0.9) // Allow some padding below, but not below zero
          const yMax = maxValue * 1.1 // Allow 10% padding above max value
          
          const color = colorScheme[index % colorScheme.length]
          
          // Create a dataset with just this token's data
          const enhancedDataset = {
            ...dataset,
            data: numericData,
            borderColor: color,
            backgroundColor: color.replace('1)', '0.1)'),
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.2,
            fill: true
          }
          
          // Create new chart
          const newChart = new Chart(chartData.ref.current, {
            type: 'line',
            data: {
              labels,
              datasets: [enhancedDataset]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              scales: {
                y: {
                  type: useLogScale ? 'logarithmic' : 'linear',
                  beginAtZero: true,
                  min: useLogScale ? undefined : 0, // Start at 0 for clarity
                  max: useLogScale ? undefined : yMax, // Only set explicit max in linear mode
                  title: {
                    display: true,
                    text: `Cumulative Volume (${tokenSymbol})`,
                    font: {
                      weight: 'bold'
                    }
                  },
                  ticks: {
                    callback: (value: number | string) => {
                      return formatTokenAmount(Number(value), '')
                    },
                    maxTicksLimit: 5
                  },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Date',
                    font: {
                      weight: 'bold'
                    }
                  },
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    maxTicksLimit: 10,
                    callback: function(value, index, values) {
                      const label = labels[index];
                      if (labels.length > 15) {
                        return index % 3 === 0 ? label : '';
                      }
                      return label;
                    }
                  },
                  grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)'
                  }
                }
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context: any) => {
                      if (context.raw !== undefined && context.dataset?.label) {
                        return formatTokenAmount(context.raw, context.dataset.label)
                      }
                      return '';
                    }
                  },
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  padding: 10,
                  titleFont: {
                    size: 14
                  },
                  bodyFont: {
                    size: 13
                  },
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderWidth: 1,
                  displayColors: true,
                  boxWidth: 10,
                  boxHeight: 10
                },
                legend: {
                  display: false
                }
              }
            }
          })
          
          // Update the chart instance in our state
          tokenData[tokenSymbol].instance = newChart
        })
      } catch (err) {
        console.error('Error loading Chart.js:', err)
      }
    }
    
    // Only load charts when we have both data and refs
    if (cumulativeVolumeStats?.data && Object.keys(tokenData).length > 0) {
      loadChartJs()
    }
    
    // Cleanup
    return () => {
      Object.values(tokenData).forEach(data => {
        if (data.instance) {
          data.instance.destroy()
        }
      })
    }
  }, [cumulativeVolumeStats?.data, tokenData, useLogScale, selectedTokens])

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setPeriodDays(event.target.value)
  }

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseLogScale(event.target.checked)
  }
  
  const handleTokenToggle = (tokenSymbol: string) => {
    if (selectedTokens.includes(tokenSymbol)) {
      // If all tokens would be deselected, don't allow it
      if (selectedTokens.length === 1) return;
      setSelectedTokens(selectedTokens.filter(t => t !== tokenSymbol));
    } else {
      setSelectedTokens([...selectedTokens, tokenSymbol]);
    }
  }

  // Error state
  if (error) {
    return (
      <Box p={4} textAlign="center" color="error.main">
        <Typography variant="h6">Unable to load volume data</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>Please try again later</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center">
            <ShowChartIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight="bold" color="primary">
              {title}
            </Typography>
            <Tooltip 
              title="Shows the cumulative token volume over time" 
              placement="top"
            >
              <InfoOutlinedIcon 
                sx={{ 
                  ml: 1, 
                  color: 'text.secondary',
                  fontSize: '0.9rem',
                  cursor: 'help' 
                }} 
              />
            </Tooltip>
          </Box>
          
          <Box display="flex" alignItems="center" gap={2}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="period-select-label">Time Period</InputLabel>
              <Select
                labelId="period-select-label"
                id="period-select"
                value={periodDays}
                onChange={handlePeriodChange}
                label="Time Period"
              >
                <MenuItem value="7">7 days</MenuItem>
                <MenuItem value="30">30 days</MenuItem>
                <MenuItem value="90">90 days</MenuItem>
                <MenuItem value="180">180 days</MenuItem>
                <MenuItem value="365">365 days</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={useLogScale}
                  onChange={handleScaleChange}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  Log Scale
                </Typography>
              }
            />
          </Box>
        </Box>
        
        {loading && (
          <Box p={4} display="flex" justifyContent="center">
            <Box textAlign="center">
              <CircularProgress size={40} thickness={4} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Loading chart data...
              </Typography>
            </Box>
          </Box>
        )}
        
        {!loading && cumulativeVolumeStats?.data?.datasets && (
          <Box>
            {/* Token filter chips */}
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                mb: 2, 
                flexWrap: 'wrap', 
                gap: 1,
                '& > *': { my: 0.5 }
              }}
            >
              {cumulativeVolumeStats.data.datasets.map(dataset => (
                <Chip 
                  key={dataset.label}
                  label={dataset.label}
                  onClick={() => handleTokenToggle(dataset.label)}
                  variant={selectedTokens.includes(dataset.label) ? "filled" : "outlined"}
                  sx={{ 
                    fontWeight: selectedTokens.includes(dataset.label) ? 'bold' : 'normal',
                    backgroundColor: selectedTokens.includes(dataset.label) 
                      ? 'primary.main' 
                      : 'transparent',
                    color: selectedTokens.includes(dataset.label)
                      ? 'primary.contrastText'
                      : 'text.primary',
                    borderColor: selectedTokens.includes(dataset.label) ? 'primary.main' : 'divider',
                    '&:hover': {
                      backgroundColor: selectedTokens.includes(dataset.label) 
                        ? 'primary.main' 
                        : 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                />
              ))}
            </Stack>
            
            <Grid container spacing={4}>
              {cumulativeVolumeStats.data.datasets
                .filter(dataset => selectedTokens.includes(dataset.label))
                .map(dataset => (
                <Grid item xs={12} key={dataset.label}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      height: 300,
                      borderRadius: 2,
                      border: '1px solid rgba(230, 235, 250, 0.8)'
                    }}
                  >
                    <Box mb={2}>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        color="text.primary"
                      >
                        {dataset.label} Cumulative Volume
                      </Typography>
                    </Box>
                    <Box sx={{ height: 'calc(100% - 40px)' }}>
                      {tokenData[dataset.label] ? (
                        <canvas ref={tokenData[dataset.label].ref} />
                      ) : (
                        <Skeleton variant="rectangular" height="100%" animation="wave" />
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  )
} 