'use client'
import Box from '@mui/material/Box'
import React, { useEffect } from 'react'
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
import EventIcon from '@mui/icons-material/Event'
// import { ClaimWithdrawnEvents } from './events/ClaimWithdrawnEvents'

export function Events () {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  useEffect(() => {
    // Get the hash from the URL (excluding the '#' symbol)
    const hash = window.location.hash.slice(1)
    if (hash) {
      // Find the element with the matching ID
      const element = document.getElementById(hash)
      if (element) {
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, []) // Empty dependency array means this runs once when component mounts

  const tables = [
    <div key="TransferSent" id="TransferSent"><TransferSentEvents /></div>,
    <div key="TransferBonded" id="TransferBonded"><TransferBondedEvents /></div>,
    <div key="ClaimPushed" id="ClaimPushed"><ClaimPushedEvents /></div>,
    <div key="ClaimReadded" id="ClaimReadded"><ClaimReaddedEvents /></div>,
    <div key="ClaimRemoved" id="ClaimRemoved"><ClaimRemovedEvents /></div>,
    // <div key="ClaimWithdrawn" id="ClaimWithdrawn"><ClaimWithdrawnEvents /></div>,
    <div key="BonderPreference" id="BonderPreference"><BonderPreferenceEvents /></div>,
    <div key="PathInitialized" id="PathInitialized"><PathInitializedEvents /></div>,
    <div key="MessageSent" id="MessageSent"><MessageSentEvents /></div>,
    <div key="MessageBundled" id="MessageBundled"><MessageBundledEvents /></div>,
    <div key="MessageExecuted" id="MessageExecuted"><MessageExecutedEvents /></div>,
    <div key="BundleCommitted" id="BundleCommitted"><BundleCommittedEvents /></div>,
    <div key="BundleForwarded" id="BundleForwarded"><BundleForwardedEvents /></div>,
    <div key="BundleReceived" id="BundleReceived"><BundleReceivedEvents /></div>,
    <div key="BundleSet" id="BundleSet"><BundleSetEvents /></div>,
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
        <Box>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              whiteSpace: 'nowrap',
              mb: 1
            }}
          >
            <EventIcon 
              sx={{ 
                fontSize: '2.2rem',
                color: theme.palette.primary.main,
                mr: 1
              }} 
            />
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight="bold" 
              color="text.primary"
            >
              Events
            </Typography>
          </Box>
          <Typography variant="subtitle1" color="text.secondary">
            View all event types and activities across the protocol
          </Typography>
        </Box>
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
