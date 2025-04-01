import React from 'react'
import Box from '@mui/material/Box'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import Link from '@mui/material/Link'
import { useTheme as useMuiTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import DiscordIcon from '@mui/icons-material/Chat'
import { useTheme } from '../contexts/ThemeContext.js'

export function Footer () {
  const muiTheme = useMuiTheme()
  const { darkMode } = useTheme()
  const currentYear = new Date().getFullYear()

  // Set gradient based on dark mode
  const gradientBg = darkMode 
    ? `linear-gradient(90deg, rgba(226, 123, 216, 0.1) 0%, rgba(226, 123, 216, 0.15) 100%)`
    : `linear-gradient(90deg, rgba(213, 110, 198, 0.05) 0%, rgba(213, 110, 198, 0.1) 100%)`
  
  const borderColor = darkMode
    ? 'rgba(226, 123, 216, 0.15)'
    : 'rgba(213, 110, 198, 0.1)'
  
  const iconColor = darkMode
    ? 'rgba(226, 123, 216, 0.8)'
    : 'rgba(213, 110, 198, 0.8)'
  
  const iconHoverColor = darkMode
    ? '#e27bd8'
    : '#d56ec6'

  return (
    <Box 
      sx={{
        padding: { xs: '18px 12px', sm: '24px 16px', md: '32px' },
        mt: 'auto',
        background: gradientBg,
        borderTop: `1px solid ${borderColor}`,
        width: '100%',
        transition: muiTheme.transitions.create(['background', 'border-color'], {
          duration: muiTheme.transitions.duration.standard
        }),
      }}
    >
      <Box 
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            order: { xs: 2, sm: 1 },
            textAlign: { xs: 'center', sm: 'left' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              opacity: 0.7,
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}
          >
            © {currentYear} Hop Protocol
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 3, sm: 2 },
            order: { xs: 1, sm: 2 },
            mb: { xs: 1, sm: 0 },
            justifyContent: { xs: 'center', sm: 'flex-end' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <Tooltip title="Twitter" arrow>
            <Link 
              href="https://twitter.com/HopProtocol" 
              target="_blank" 
              rel="noreferrer noopener"
              sx={{
                color: iconColor,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: iconHoverColor,
                },
                display: 'flex',
                padding: { xs: '4px', sm: 0 },
              }}
            >
              <TwitterIcon fontSize={muiTheme.breakpoints.down('sm') ? 'small' : 'medium'} />
            </Link>
          </Tooltip>
          
          <Tooltip title="Discord" arrow>
            <Link 
              href="https://discord.gg/PwCF88emV4" 
              target="_blank" 
              rel="noreferrer noopener"
              sx={{
                color: iconColor,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: iconHoverColor,
                },
                display: 'flex',
                padding: { xs: '4px', sm: 0 },
              }}
            >
              <DiscordIcon fontSize={muiTheme.breakpoints.down('sm') ? 'small' : 'medium'} />
            </Link>
          </Tooltip>
          
          <Tooltip title="GitHub" arrow>
            <Link 
              href="https://github.com/hop-protocol/hop" 
              target="_blank" 
              rel="noreferrer noopener"
              sx={{
                color: iconColor,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: iconHoverColor,
                },
                display: 'flex',
                padding: { xs: '4px', sm: 0 },
              }}
            >
              <GitHubIcon fontSize={muiTheme.breakpoints.down('sm') ? 'small' : 'medium'} />
            </Link>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  )
}
