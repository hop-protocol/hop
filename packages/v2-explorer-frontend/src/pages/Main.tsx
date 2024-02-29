import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { SiteWrapper } from '../components/SiteWrapper'
import { ExplorerEvents } from '../components/ExplorerEvents'
import Box from '@mui/material/Box'

export function Main () {
  return (
    <SiteWrapper>
      <Box width="100%" maxWidth="2000px" m="0 auto">
        <ExplorerEvents />
      </Box>
    </SiteWrapper>
  )
}
