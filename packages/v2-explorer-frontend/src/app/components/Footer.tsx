import Box from '@mui/material/Box'
import React from 'react'
import IconButton from '@mui/material/IconButton'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useTheme } from '@/app/hooks/useTheme'

export function Footer () {
  const { dark } = useTheme()

  return (
    <Box mt={8} mb={4}>
      <IconButton
        aria-label="github"
        sx={{ color: dark ? '#fff' : '#000' }}
        target="_blank"
        href="https://github.com/hop-protocol/hop"
        rel="noopener noreferrer"
      >
        <GitHubIcon />
      </IconButton>
    </Box>
  )
}
