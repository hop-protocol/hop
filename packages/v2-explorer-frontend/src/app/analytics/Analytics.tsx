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
import { useTheme } from '@mui/material/styles'
import { TotalVolumeStats } from '@/app/components/stats/TotalVolumeStats'
import { TokenVolumeStats } from '@/app/components/stats/TokenVolumeStats'
import { VolumeChart } from '@/app/components/VolumeChart'
import { CumulativeVolumeChart } from '@/app/components/CumulativeVolumeChart'

export function Analytics() {
  const theme = useTheme()
  const [timeRange, setTimeRange] = useState<string>("30")

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value)
  }

  const isDarkMode = theme.palette.mode === 'dark'

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" color="text.primary" mb={1}>
          Hop v2 Analytics
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track volume and activity across the network
        </Typography>
      </Box>

      {/* Main Stats Overview */}
      <Grid container spacing={4} mb={10}>
        <Grid item xs={12} md={5}>
          <Box sx={{ height: '100%' }}>
            <Paper 
              elevation={isDarkMode ? 3 : 2}
              sx={{ 
                p: 3, 
                height: '100%',
                background: isDarkMode 
                  ? `linear-gradient(145deg, rgba(30, 40, 50, 0.8) 0%, rgba(25, 25, 35, 0.9) 100%)`
                  : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,245,255,0.9) 100%)',
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: isDarkMode 
                  ? '0 4px 20px rgba(0,0,0,0.25)' 
                  : undefined
              }}
            >
              <TotalVolumeStats />
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`
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
        <CumulativeVolumeChart title="Cumulative Volume by Token" days={parseInt(timeRange)} />
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
        <VolumeChart title="Daily Volume by Token" days={parseInt(timeRange)} />
      </Paper>
    </Container>
  )
}
