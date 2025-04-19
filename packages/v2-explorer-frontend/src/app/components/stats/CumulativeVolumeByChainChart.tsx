import { useEffect, useRef, useState } from 'react'
import { Box, Typography, CircularProgress, Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { useFetchCumulativeVolumeByChain } from '@/app/hooks/useFetchCumulativeVolumeByChain'
import { formatNumber } from '@/app/utils/format'
import { useTheme } from '@mui/material/styles'

interface CumulativeVolumeByChainChartProps {
  days?: number
}

export const CumulativeVolumeByChainChart = ({ days = 30 }: CumulativeVolumeByChainChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<any>(null)
  const { data: cumulativeVolumeByChainStats, isLoading, error } = useFetchCumulativeVolumeByChain(days)
  const theme = useTheme()
  const [selectedChains, setSelectedChains] = useState<number[]>([])
  const [canvasId] = useState(() => `chart-${Math.random().toString(36).substr(2, 9)}`)
  const [totalVolumeUsd, setTotalVolumeUsd] = useState<number>(0)

  // Define a palette of pastel colors for the chart lines
  const chartColors = [
    '#FFB3BA', // Pastel Red
    '#BAFFC9', // Pastel Green
    '#BAE1FF', // Pastel Blue
    '#FFFFBA', // Pastel Yellow
    '#FFB3F7', // Pastel Pink
    '#B3FFF7', // Pastel Turquoise
    '#E8BAFF', // Pastel Purple
    '#FFD9BA', // Pastel Orange
    '#C4FAF8', // Pastel Mint
    '#FFCBC1', // Pastel Salmon
    '#D4FFBA', // Pastel Lime
    '#FFC9DE', // Pastel Rose
    '#BAC3FF', // Pastel Periwinkle
    '#E3FFE6', // Pastel Sage
    '#FFE2BA'  // Pastel Peach
  ]

  // Format large numbers with appropriate units
  const formatLargeNumber = (value: number) => {
    if (value === 0) return '$0'
    if (Math.abs(value) >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`
    }
    if (Math.abs(value) >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`
    }
    if (Math.abs(value) >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`
    }
    return `$${value.toFixed(2)}`
  }

  useEffect(() => {
    if (cumulativeVolumeByChainStats?.datasets) {
      setSelectedChains(cumulativeVolumeByChainStats.datasets.map(dataset => dataset.chainId))
      
      // Calculate total volumeUsd across all chains and all dates
      let total = 0
      cumulativeVolumeByChainStats.datasets.forEach(dataset => {
        dataset.data.forEach(item => {
          total += parseFloat(item.volumeUsd.toString() || '0')
        })
      })
      setTotalVolumeUsd(total)
    }
  }, [cumulativeVolumeByChainStats])

  useEffect(() => {
    const loadChart = async () => {
      if (!chartRef.current || !cumulativeVolumeByChainStats?.datasets) return

      // Clean up existing chart instance
      if (chartInstance.current) {
        chartInstance.current.destroy()
        chartInstance.current = null
      }

      // Reset canvas
      const canvas = chartRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Reset canvas dimensions
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      try {
        const { Chart, registerables } = await import('chart.js')
        Chart.register(...registerables)

        // Format dates for x-axis labels
        const formatDate = (dateString: string) => {
          const date = new Date(dateString)
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }

        // Get all unique dates from the datasets
        const allDates = new Set<string>()
        cumulativeVolumeByChainStats.datasets.forEach(dataset => {
          dataset.data.forEach(item => {
            allDates.add(item.date)
          })
        })
        
        // Sort dates chronologically
        const sortedDates = Array.from(allDates).sort((a, b) => 
          new Date(a).getTime() - new Date(b).getTime()
        )

        // Create formatted labels
        const labels = sortedDates.map(formatDate)

        // Generate cumulative datasets manually to ensure proper accumulation
        const filteredDatasets = cumulativeVolumeByChainStats.datasets
          .filter(dataset => selectedChains.includes(dataset.chainId))
          .map((dataset, index) => {
            // Sort data by date
            const sortedData = [...dataset.data].sort((a, b) => 
              new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            
            // Calculate running cumulative total
            let cumulativeTotal = 0
            const volumeMap = new Map()
            sortedData.forEach(item => {
              // Use the volumeUsd directly
              const volumeValue = parseFloat(item.volumeUsd.toString())
              
              // Add to running total
              cumulativeTotal += volumeValue
              
              // Store the cumulative value for this date
              volumeMap.set(item.date, cumulativeTotal)
            })

            // Map each date to its corresponding cumulative volume
            const cumulativeData = sortedDates.map(date => {
              if (volumeMap.has(date)) {
                return volumeMap.get(date)
              }
              
              // If no data for this date, use the latest cumulative value before this date
              const previousDate = sortedDates
                .filter(d => d < date && volumeMap.has(d))
                .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
                
              return previousDate ? volumeMap.get(previousDate) : 0
            })

            // Get color for this dataset
            const colorIndex = index % chartColors.length
            const color = chartColors[colorIndex]

            return {
              label: dataset.chainName,
              data: cumulativeData,
              borderColor: color,
              backgroundColor: color,
              fill: false,
              tension: 0.4
            }
          })

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: filteredDatasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value = context.parsed.y
                    return `${context.dataset.label}: ${formatLargeNumber(value)}`
                  }
                },
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: theme.palette.text.primary,
                bodyColor: theme.palette.text.primary,
                borderColor: theme.palette.divider,
                borderWidth: 1,
                padding: 12,
                boxPadding: 4
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date',
                  color: theme.palette.text.secondary
                },
                grid: {
                  color: theme.palette.divider,
                },
                ticks: {
                  color: theme.palette.text.secondary
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Volume (USD)',
                  color: theme.palette.text.secondary
                },
                grid: {
                  color: theme.palette.divider,
                },
                ticks: {
                  color: theme.palette.text.secondary,
                  callback: (value) => formatLargeNumber(value as number)
                }
              }
            },
            interaction: {
              mode: 'nearest',
              axis: 'x',
              intersect: false
            }
          }
        })
      } catch (error) {
        console.error('Error loading chart:', error)
      }
    }

    loadChart()

    return () => {
      if (chartInstance.current) {
        try {
          chartInstance.current.destroy()
          chartInstance.current = null
        } catch (error) {
          console.error('Error destroying chart:', error)
        }
      }
    }
  }, [cumulativeVolumeByChainStats, selectedChains, theme, chartColors])

  const handleChainChange = (event: SelectChangeEvent<number[]>) => {
    setSelectedChains(event.target.value as number[])
  }

  if (isLoading) {
    return (
      <Paper elevation={3} sx={{ p: 3, height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Paper>
    )
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="error">Error loading cumulative volume by chain data</Typography>
      </Paper>
    )
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">Cumulative Volume by Chain</Typography>
          <Typography variant="body2" color="text.secondary">
            Total sum: ${totalVolumeUsd.toFixed(2)} USD
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Chains</InputLabel>
          <Select
            multiple
            value={selectedChains}
            onChange={handleChainChange}
            label="Select Chains"
          >
            {cumulativeVolumeByChainStats?.datasets?.map(dataset => (
              <MenuItem key={dataset.chainId} value={dataset.chainId}>
                {dataset.chainName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ height: 400 }}>
        <canvas ref={chartRef} id={canvasId} />
      </Box>
    </Paper>
  )
}