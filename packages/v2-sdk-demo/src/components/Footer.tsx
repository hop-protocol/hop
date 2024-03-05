import React from 'react'
import Box from '@mui/material/Box'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import Link from '@mui/material/Link'

export function Footer () {
  return (
    <Box mb={6} display="flex" alignItems="center" justifyContent="center">
      <Box>
        <Link href="https://twitter.com/hopprotocol" target="_blank" rel="noreferrer noopener"><TwitterIcon  /></Link>
      </Box>
      <Box ml={2}>
        <Link href="https://github.com/hop-protocol/v2-monorepo/tree/develop/packages/v2-connector-portal" target="_blank" rel="noreferrer noopener"><GitHubIcon  /></Link>
      </Box>
    </Box>
  )
}
