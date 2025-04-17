import React from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useTheme } from '@/app/hooks/useTheme'
import TwitterXIcon from '@/assets/logos/twitter-x.svg'
import DiscordIcon from '@/assets/logos/discord.svg'
import GithubIcon from '@/assets/logos/github.svg'
import { alpha } from '@mui/material/styles'

export function Footer () {
  const { theme, dark: isDarkMode } = useTheme()
  const currentYear = new Date().getFullYear()

  // Set gradient based on dark mode
  const gradientBg = isDarkMode 
    ? `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`
    : `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`
  
  const borderColor = isDarkMode
    ? alpha(theme.palette.primary.main, 0.1)
    : alpha(theme.palette.primary.main, 0.08)
  
  const iconColor = isDarkMode
    ? alpha(theme.palette.primary.main, 0.7)
    : theme.palette.primary.main

  const iconHoverColor = isDarkMode
    ? theme.palette.primary.light
    : theme.palette.primary.dark

  const iconFilter = isDarkMode
    ? 'brightness(1.2) contrast(0.85)'
    : 'none'

  const iconHoverFilter = isDarkMode
    ? 'brightness(1.4) contrast(0.9)'
    : 'brightness(1.1)'

  return (
    <Box 
      sx={{
        padding: { xs: '18px 12px', sm: '24px 16px', md: '32px' },
        mt: 'auto',
        background: gradientBg,
        borderTop: `1px solid ${borderColor}`,
        width: '100%',
        transition: theme.transitions.create(['background', 'border-color'], {
          duration: theme.transitions.duration.standard
        }),
        backdropFilter: 'blur(8px)',
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
              opacity: isDarkMode ? 0.8 : 0.7,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              color: isDarkMode ? 'text.secondary' : 'text.primary'
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
                display: 'flex',
                padding: { xs: '4px', sm: 0 },
                opacity: 0.85,
                '&:hover': {
                  opacity: 1,
                  color: iconHoverColor
                }
              }}
            >
              <Box 
                component="img" 
                src={TwitterXIcon.src || TwitterXIcon} 
                alt="Twitter"
                sx={{
                  width: '20px',
                  height: '20px',
                  filter: iconFilter,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    filter: iconHoverFilter
                  }
                }}
              />
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
                display: 'flex',
                padding: { xs: '4px', sm: 0 },
                opacity: 0.85,
                '&:hover': {
                  opacity: 1,
                  color: iconHoverColor
                }
              }}
            >
              <Box 
                component="img" 
                src={DiscordIcon.src || DiscordIcon} 
                alt="Discord"
                sx={{
                  width: '20px',
                  height: '20px',
                  filter: iconFilter,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    filter: iconHoverFilter
                  }
                }}
              />
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
                display: 'flex',
                padding: { xs: '4px', sm: 0 },
                opacity: 0.85,
                '&:hover': {
                  opacity: 1,
                  color: iconHoverColor
                }
              }}
            >
              <Box 
                component="img" 
                src={GithubIcon.src || GithubIcon} 
                alt="GitHub"
                sx={{
                  width: '20px',
                  height: '20px',
                  filter: iconFilter,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    filter: iconHoverFilter
                  }
                }}
              />
            </Link>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  )
}
