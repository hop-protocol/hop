import Box from '@mui/material/Box'
import React from 'react'

export function ButtonsWrapper(props: any) {
  const { children } = props

  return (
    <Box my="1rem" display="flex" justifyContent="space-around" alignItems="center" flexWrap="wrap" maxWidth={['450px']} width="100%">
      {children}
    </Box>
  )
}
