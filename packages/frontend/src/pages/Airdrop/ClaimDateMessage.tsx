import React from 'react'
import Box from '@material-ui/core/Box'
import Alert from 'src/components/alert/Alert'

export function ClaimDateMessage () {
  return (
    <Box m={3} maxWidth={600} textAlign="center">
      <Alert severity="warning">
        <Box textAlign="left">
          The verified address snapshot for claiming was taken June 7 2022 8PM UTC, but eligible accounts can still submit an address up to 6 months after the initial claim period to receive tokens through a governance proposal.
        </Box>
      </Alert>
    </Box>
  )
}
