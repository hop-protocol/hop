'use client'
import Box from '@mui/material/Box'
import React from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import { BundleCommittedEvents } from './events/BundleCommittedEvents'
import { BundleForwardedEvents } from './events/BundleForwardedEvents'
import { BundleReceivedEvents } from './events/BundleReceivedEvents'
import { BundleSetEvents } from './events/BundleSetEvents'
import { MessageBundledEvents } from './events/MessageBundledEvents'
import { MessageExecutedEvents } from './events/MessageExecutedEvents'
import { MessageSentEvents } from './events/MessageSentEvents'
import { TransferSentEvents } from './events/TransferSentEvents'
import { TransferBondedEvents } from './events/TransferBondedEvents'
import { ClaimPushedEvents } from './events/ClaimPushedEvents'
import { ClaimReaddedEvents } from './events/ClaimReaddedEvents'
import { ClaimRemovedEvents } from './events/ClaimRemovedEvents'
import { BonderPreferenceEvents } from './events/BonderPreferenceEvents'
import { PathInitializedEvents } from './events/PathInitializedEvents'
// import { ClaimWithdrawnEvents } from './events/ClaimWithdrawnEvents'

export function Events () {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const tables = [
    <TransferSentEvents key="TransferSentEvents" />,
    <TransferBondedEvents key="TransferBondedEvents" />,
    <ClaimPushedEvents key="ClaimPushedEvents" />,
    <ClaimReaddedEvents key="ClaimReaddedEvents" />,
    <ClaimRemovedEvents key="ClaimRemovedEvents" />,
    // <ClaimWithdrawnEvents key="ClaimWithdrawnEvents" />,
    <BonderPreferenceEvents key="BonderPreferenceEvents" />,
    <PathInitializedEvents key="PathInitializedEvents" />,
    <MessageSentEvents key="MessageSentEvents" />,
    <MessageBundledEvents key="MessageBundledEvents" />,
    <MessageExecutedEvents key="MessageExecutedEvents" />,
    <BundleCommittedEvents key="BundleCommittedEvents" />,
    <BundleForwardedEvents key="BundleForwardedEvents" />,
    <BundleReceivedEvents key="BundleReceivedEvents" />,
    <BundleSetEvents key="BundleSetEvents" />,
  ]

  return (
    <Box width="100%" maxWidth="2000px">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        mb: 4
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight="bold" 
          color="text.primary"
        >
          Events
        </Typography>
      </Box>

      <Box width="100%" mb={6} display="flex" flexDirection="column">
        <Box>
          <Box width="100%" maxWidth="2000px" m="0 auto">
            {tables.map((table, i) => {
              return (
                <Paper 
                  key={i} 
                  elevation={isDarkMode ? 3 : 1} 
                  sx={{ 
                    p: { xs: 2, md: 3 }, 
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    mb: 4,
                    overflow: 'hidden'
                  }}
                >
                  {table}
                </Paper>
              )
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
