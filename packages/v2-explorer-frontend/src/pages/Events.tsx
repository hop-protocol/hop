import React, { useMemo, useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SiteWrapper } from '../components/SiteWrapper'
// import { useQueryParams } from './hooks/useQueryParams'
import { BundleCommittedEvents } from '../components/events/BundleCommittedEvents'
import { BundleForwardedEvents } from '../components/events/BundleForwardedEvents'
import { BundleReceivedEvents } from '../components/events/BundleReceivedEvents'
import { BundleSetEvents } from '../components/events/BundleSetEvents'
import { MessageBundledEvents } from '../components/events/MessageBundledEvents'
import { MessageExecutedEvents } from '../components/events/MessageExecutedEvents'
import { MessageSentEvents } from '../components/events/MessageSentEvents'

export function Events () {
  // const { queryParams, updateQueryParams } = useQueryParams()

  const tables = [
    <BundleCommittedEvents />,
    <BundleForwardedEvents />,
    <BundleReceivedEvents />,
    <BundleSetEvents />,
    <MessageBundledEvents />,
    <MessageExecutedEvents />,
    <MessageSentEvents />
  ]

  return (
    <SiteWrapper>
      <Box width="100%" mb={6} display="flex" flexDirection="column">
        <Box mb={8}>
          <Box width="100%" maxWidth="2000px" m="0 auto">
            {tables.map((table, i) => {
              return (
                <Box key={i} mb={8}>
                  {table}
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
    </SiteWrapper>
  )
}
