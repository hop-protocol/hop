'use client'
import Box from '@mui/material/Box'
import React from 'react'
import Typography from '@mui/material/Typography'
import { SiteWrapper } from '../components/SiteWrapper'

export function NotFound () {
  return (
    <SiteWrapper>
      <Box p={4}>
        <Typography variant="h2">Not Found</Typography>
      </Box>
    </SiteWrapper>
  )
}
