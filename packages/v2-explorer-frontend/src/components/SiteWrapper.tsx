import Box from '@mui/material/Box'
import React from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

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
