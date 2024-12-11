'use client'
import Box from '@mui/material/Box'
import React from 'react'
import Typography from '@mui/material/Typography'
import { BundleCommittedEvents } from './events/BundleCommittedEvents'
import { BundleForwardedEvents } from './events/BundleForwardedEvents'
import { BundleReceivedEvents } from './events/BundleReceivedEvents'
import { BundleSetEvents } from './events/BundleSetEvents'
import { MessageBundledEvents } from './events/MessageBundledEvents'
import { MessageExecutedEvents } from './events/MessageExecutedEvents'
import { MessageSentEvents } from './events/MessageSentEvents'
import { TransferSentEvents } from './events/TransferSentEvents'
import { TransferBondedEvents } from './events/TransferBondedEvents'
import { ClaimPostedEvents } from './events/ClaimPostedEvents'
import { ClaimChainUpdatedEvents } from './events/ClaimChainUpdatedEvents'
import { BonderPreferenceEvents } from './events/BonderPreferenceEvents'

export function Events () {
  const tables = [
    <BundleCommittedEvents key="BundleCommittedEvents" />,
    <BundleForwardedEvents key="BundleForwardedEvents" />,
    <BundleReceivedEvents key="BundleReceivedEvents" />,
    <BundleSetEvents key="BundleSetEvents" />,
    <MessageBundledEvents key="MessageBundledEvents" />,
    <MessageExecutedEvents key="MessageExecutedEvents" />,
    <MessageSentEvents key="MessageSentEvents" />,
    <TransferSentEvents key="TransferSentEvents" />,
    <TransferBondedEvents key="TransferBondedEvents" />,
    <ClaimPostedEvents key="ClaimPostedEvents" />,
    <ClaimChainUpdatedEvents key="ClaimChainUpdatedEvents" />,
    <BonderPreferenceEvents key="BonderPreferenceEvents" />
  ]

  return (
    <Box>
      <Typography variant="h3" color="textPrimary">Events</Typography>
      <Box width="100%" mt={2} mb={6} display="flex" flexDirection="column">
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
    </Box>
  )
}
