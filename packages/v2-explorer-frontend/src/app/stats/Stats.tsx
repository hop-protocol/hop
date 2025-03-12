'use client'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { useFetchTokens } from '@/app/hooks/useFetchTokens'
import { TotalVolumeStats } from '@/app/components/stats/TotalVolumeStats'
import { TokenVolumeStats } from '@/app/components/stats/TokenVolumeStats'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

export function Stats () {
  return (
    <Box width="100%" maxWidth="600px">
      <Box mb={8}>
        <TotalVolumeStats />
      </Box>
      <Box>
        <TokenVolumeStats />
      </Box>
    </Box>
  )
}
