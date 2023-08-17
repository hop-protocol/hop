import React from 'react'
import Box from '@material-ui/core/Box'
import Alert from 'src/components/alert/Alert'

export function ClaimDateMessage () {
  return (
    <Box m={3} maxWidth={600} textAlign="center">
      <Alert severity="info">
        <Box textAlign="left">
          The claim window has been reopened following a successful governance vote and will remain open for a period of 6 months. The verified address snapshot for claiming was taken June 7 2022 8PM UTC and eligible accounts that have not yet claimed can submit an address now.
        </Box>
      </Alert>
    </Box>
  )
}
