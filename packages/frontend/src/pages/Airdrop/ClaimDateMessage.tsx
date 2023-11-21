import React from 'react'
import Box from '@material-ui/core/Box'
import { Alert } from 'src/components/Alert'

export function ClaimDateMessage () {
  return (
    <Box m={3} maxWidth={600} textAlign="center">
      <Alert severity="info">
        <Box textAlign="left">
          The claim window has reopened following a successful governance vote and will remain open for a period of 60 days. Eligible accounts that have not yet claimed can submit an address.
        </Box>
      </Alert>
    </Box>
  )
}
