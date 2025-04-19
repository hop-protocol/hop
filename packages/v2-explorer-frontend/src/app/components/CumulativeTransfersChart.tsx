'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/app/hooks/useTheme'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import { apiUrl, appApiHost } from '@/app/config'

interface CumulativeTransfersChartProps {
  title: string
  days: number
}

export function CumulativeTransfersChart({ title, days }: CumulativeTransfersChartProps) {
  const { theme, dark: isDarkMode } = useTheme()
  const [data, setData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<any>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the API proxy when in the browser to avoid CORS issues
        const hostname = typeof window === 'undefined' ? appApiHost : window.location.host
        const protocol = hostname.includes('localhost') ? 'http' : 'https'
        
        let url = `${protocol}://${hostname}/api/?pathname=/analytics/cumulative-transfer-counts&days=${days}`

        const response = await fetch(url)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Error fetching cumulative transfer counts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [days])

  useEffect(() => {
    const loadChartJs = async () => {
      if (typeof window === 'undefined' || !data || !chartRef.current) {
        return
      }

      try {
        // Dynamic import for Chart.js
        const { Chart, registerables } = await import('chart.js')
        Chart.register(...registerables)

        // Destroy existing chart if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy()
        }

        // Create new chart
        chartInstance.current = new Chart(chartRef.current, {
          type: 'line',
          data: {
            labels: data.labels,
            datasets: data.datasets.map((dataset: any) => ({
              ...dataset,
              borderColor: theme.palette.primary.main,
              backgroundColor: `${theme.palette.primary.main}20`,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 4,
              borderWidth: 2
            }))
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                titleColor: isDarkMode ? '#fff' : '#000',
                bodyColor: isDarkMode ? '#fff' : '#000',
                borderColor: theme.palette.divider,
                borderWidth: 1,
                padding: 12,
                callbacks: {
                  label: (context: any) => {
                    return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`
                  }
                }
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  color: theme.palette.text.secondary
                }
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: theme.palette.divider
                },
                ticks: {
                  color: theme.palette.text.secondary,
                  callback: (value: any) => value.toLocaleString()
                }
              }
            }
          }
        })
      } catch (error) {
        console.error('Error loading chart:', error)
      }
    }

    loadChartJs()

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, theme, isDarkMode])

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '400px'
      }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!data) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '400px',
        color: theme.palette.text.secondary
      }}>
        No data available
      </Box>
    )
  }

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ShowChartIcon sx={{ mr: 1 }} />
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Box sx={{ height: '400px' }}>
        <canvas ref={chartRef} />
      </Box>
    </Paper>
  )
} 