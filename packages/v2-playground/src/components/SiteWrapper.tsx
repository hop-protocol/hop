import React from 'react'
import Box from '@mui/material/Box'
import { Header } from './Header.js'
import { Footer } from './Footer.js'

export function SiteWrapper (props: any) {
  const { children } = props

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      minHeight="100vh"
      sx={{
        overflow: 'hidden', // Prevent horizontal scrolling on mobile
        maxWidth: '100vw', // Ensure content doesn't exceed viewport width
        position: 'relative'
      }}
    >
      <Header />
      <Box 
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          padding: { xs: '16px 12px', sm: '24px 16px', md: '32px' },
          maxWidth: '100%',
          width: '100%',
          margin: '0 auto',
          marginTop: { xs: '12px', sm: '20px', md: '24px' },
          overflowX: 'hidden',
          '& > *': {
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%'
          }
        })}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  )
}
