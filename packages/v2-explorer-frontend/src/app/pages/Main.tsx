'use client'
import Box from '@mui/material/Box'
import React from 'react'
import { ExplorerEvents } from '../components/ExplorerEvents'
import { SiteWrapper } from '../components/SiteWrapper'

export function Main (props: any) {
  const { initialEvents } = props
  return (
    <SiteWrapper>
      <Box width="100%" maxWidth="2000px" m="0 auto">
        <ExplorerEvents initialEvents={initialEvents} />
      </Box>
    </SiteWrapper>
  )
}
