import React from 'react'
import Box from '@mui/material/Box'
import { Header } from './Header.js'
import { Footer } from './Footer.js'

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
