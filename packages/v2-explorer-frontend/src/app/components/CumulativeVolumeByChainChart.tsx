import { useEffect, useRef, useState } from 'react'
import { useFetchCumulativeVolumeByChain } from '@/app/hooks/useFetchCumulativeVolumeByChain'
import { Box, Paper, Typography } from '@mui/material'
import { formatNumber } from '@/app/utils/format'
import { useTheme } from '@mui/material/styles'

interface ChartDataPoint {
  x: number
  y: number
}

export function CumulativeVolumeByChainChart({ days = 30 }: { days?: number }) {
  const theme = useTheme()
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<any>(null)
  const { data: cumulativeVolumeStats, isLoading, error } = useFetchCumulativeVolumeByChain(days)
  const [selectedChains, setSelectedChains] = useState<number[]>([])
  const [canvasId] = useState(() => `chart-${Math.random().toString(36).substr(2, 9)}`)

  // Cleanup function to destroy chart instance
  const cleanupChart = () => {
    if (chartInstanceRef.current) {
      try {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      } catch (error) {
        console.error('Error destroying chart:', error)
      }
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupChart()
    }
  }, [])

  // Handle chart updates
  useEffect(() => {
    let mounted = true
    let chartInstance: any = null

    const loadChart = async () => {
      if (!chartRef.current || !cumulativeVolumeStats?.datasets) return

      // Clean up previous chart instance and reset canvas
      cleanupChart()

      const canvas = chartRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Clear the canvas and reset its dimensions
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      try {
        // Dynamic import for Chart.js
        const { Chart, registerables } = await import('chart.js')
        Chart.register(...registerables)

        // Get unique chain IDs from the datasets
        const chainIds = cumulativeVolumeStats.datasets.map(dataset => dataset.chainId)
        if (selectedChains.length === 0) {
          setSelectedChains(chainIds)
        }

        // Filter datasets based on selected chains
        const filteredDatasets = cumulativeVolumeStats.datasets
          .filter(dataset => selectedChains.includes(dataset.chainId))
          .map(dataset => ({
            label: dataset.chainName,
            data: dataset.data.map(item => ({
              x: new Date(item.date).getTime(),
              y: parseFloat(item.volume)
            })),
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.main,
            tension: 0.1
          }))

        // Only create new chart if component is still mounted
        if (mounted) {
          // Create new chart instance
          chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
              datasets: filteredDatasets
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
                intersect: false
              },
              scales: {
                x: {
                  type: 'linear',
                  position: 'bottom',
                  ticks: {
                    callback: (value) => {
                      const date = new Date(value as number)
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    }
                  },
                  title: {
                    display: true,
                    text: 'Date'
                  }
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Volume'
                  },
                  ticks: {
                    callback: (value) => formatNumber(value as number)
                  }
                }
              },
              plugins: {
                legend: {
                  position: 'top' as const
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const value = context.parsed.y
                      return `${context.dataset.label}: ${formatNumber(value)}`
                    }
                  }
                }
              }
            }
          })

          // Store the chart instance
          chartInstanceRef.current = chartInstance
        }
      } catch (error) {
        console.error('Error loading chart:', error)
        if (chartInstance) {
          try {
            chartInstance.destroy()
          } catch (destroyError) {
            console.error('Error destroying failed chart:', destroyError)
          }
        }
      }
    }

    loadChart()

    // Cleanup function for the effect
    return () => {
      mounted = false
      if (chartInstance) {
        try {
          chartInstance.destroy()
        } catch (error) {
          console.error('Error destroying chart in cleanup:', error)
        }
      }
      cleanupChart()
    }
  }, [cumulativeVolumeStats, selectedChains, theme])

  if (isLoading) {
    return (
      <Paper sx={{ p: 2, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading...</Typography>
      </Paper>
    )
  }

  if (error) {
    return (
      <Paper sx={{ p: 2, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error">Error loading data</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2, height: 400 }}>
      <Box sx={{ height: '100%', position: 'relative' }}>
        <canvas ref={chartRef} id={canvasId} />
      </Box>
    </Paper>
  )
} 