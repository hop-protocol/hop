import React, { useMemo, useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import { SiteWrapper } from '../components/SiteWrapper'

export function NotFound () {
  return (
    <SiteWrapper>
      <Box p={4}>
        <h2>Not Found</h2>
      </Box>
    </SiteWrapper>
  )
}
