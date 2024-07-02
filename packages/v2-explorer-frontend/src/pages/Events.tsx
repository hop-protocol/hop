import Box from '@mui/material/Box'
import React from 'react'
import { SiteWrapper } from '../components/SiteWrapper.js'
import { BundleCommittedEvents } from '../components/events/BundleCommittedEvents.js'
import { BundleForwardedEvents } from '../components/events/BundleForwardedEvents.js'
import { BundleReceivedEvents } from '../components/events/BundleReceivedEvents.js'
import { BundleSetEvents } from '../components/events/BundleSetEvents.js'
import { MessageBundledEvents } from '../components/events/MessageBundledEvents.js'
import { MessageExecutedEvents } from '../components/events/MessageExecutedEvents.js'
import { MessageSentEvents } from '../components/events/MessageSentEvents.js'

export function Events () {
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
