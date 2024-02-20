import React, { useMemo, useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Header } from './Header'
import { Footer } from './Footer'

export function SiteWrapper (props: any) {
  const { children } = props

  return (
    <Box p={4} m="0 auto" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Header />
      {children}
      <Footer />
    </Box>
  )
}
