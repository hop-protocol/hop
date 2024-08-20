import Box from '@mui/material/Box'
import React from 'react'
import IconButton from '@mui/material/IconButton'
import GitHubIcon from '@mui/icons-material/GitHub'

export function Footer () {
  return (
    <Box mt={8} mb={4}>
      <IconButton
          aria-label="github"
          color="inherit"  // Adjust color based on your theme; 'inherit' takes color from parent
          target="_blank"
          href="https://github.com/hop-protocol/hop"
          rel="noopener noreferrer"
      >
          <GitHubIcon />
      </IconButton>
    </Box>
  )
}
