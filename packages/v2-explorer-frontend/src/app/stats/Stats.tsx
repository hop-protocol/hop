'use client'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { useFetchTokens } from '@/app/hooks/useFetchTokens'
import { TotalVolumeStats } from '@/app/components/stats/TotalVolumeStats'
import { TokenVolumeStats } from '@/app/components/stats/TokenVolumeStats'
import { VolumeChart } from '@/app/components/VolumeChart'
import { CumulativeVolumeChart } from '@/app/components/CumulativeVolumeChart'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

export function Stats () {
  return (
    <Box width="100%" maxWidth="1200px">
      <Box mb={4}>
        <TotalVolumeStats />
      </Box>
      <Box mb={8}>
        <TokenVolumeStats />
      </Box>
      <Paper elevation={2} sx={{ mb: 4 }}>
        <VolumeChart title="Daily Volume by Token" days={30} />
      </Paper>
      <Paper elevation={2} sx={{ mb: 4 }}>
        <CumulativeVolumeChart title="Cumulative Volume by Token" days={30} />
      </Paper>
    </Box>
  )
}
