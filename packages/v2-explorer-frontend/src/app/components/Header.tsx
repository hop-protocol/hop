import Box from '@mui/material/Box'
import React, { useMemo } from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { networkName } from '@/app/config'
import { usePathname } from 'next/navigation'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@/app/hooks/useTheme'
import { useRouter } from 'next/navigation'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme as useMuiTheme } from '@mui/material/styles'

const logoDark = 'https://user-images.githubusercontent.com/168240/218285469-4df03677-43de-4abd-986d-b6dd99a3b961.svg'
const logo = 'https://user-images.githubusercontent.com/168240/218271509-66a35bed-94f7-46da-ab41-71c806ac9a96.svg'

export function Header () {
  const router = useRouter()
  const navigate = router.push
  const pathname = usePathname()
  const { theme, dark, toggleTheme } = useTheme()
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'))

  const routes: Record<string, string> = {
    home: '/',
    events: '/events',
    tokens: '/tokens',
    paths: '/paths',
    prices: '/prices',
    analytics: '/analytics',
    gateways: '/gateways',
    bonders: '/bonders',
  }

  const currentTab = useMemo(() => {
    const routesMap: any = {
      '/': 'home',
      '/events': 'events',
      '/tokens': 'tokens',
      '/paths': 'paths',
      '/prices': 'prices',
      '/analytics': 'analytics',
      '/gateways': 'gateways',
      '/bonders': 'bonders',
    }

    return routesMap[pathname] ?? 'home'
  }, [pathname])

  function handleTabChange (event: any, newValue: string) {
    navigate(routes[newValue])
  }

  const logoImage = dark ? logoDark : logo

  return (
    <Box width="100%" mb={{ xs: 2, sm: 3, md: 4 }} mt={{ xs: 1, sm: 2 }}>
      {/* Header top row - logo and theme toggle */}
      <Box 
        display="flex" 
        width="100%"
        justifyContent="space-between"
        alignItems="center" 
        mb={{ xs: 2, md: 2 }}
      >
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          gap={{ xs: 1, sm: 2 }}
        >
          <Box>
            <Typography 
              variant="h4" 
              color="textPrimary"
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
            >
              <a href="/" style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Box display="flex" mr={1}>
                    <img 
                      src={logoImage} 
                      alt="Hop" 
                      style={{ 
                        height: isMobile ? '24px' : '32px',
                        width: 'auto'
                      }} 
                    />
                  </Box>
                  <Box style={{ whiteSpace: 'nowrap' }}>v2 Explorer</Box>
                </Box>
              </a>
            </Typography>
          </Box>
          <Box>
            <Typography 
              variant="subtitle1" 
              color="secondary"
              sx={{ 
                fontSize: { xs: '0.8rem', sm: '1rem' },
                mt: { xs: 0, sm: 0 }
              }}
            >
              {networkName}
            </Typography>
          </Box>
        </Box>
        
        <Box>
          <IconButton onClick={toggleTheme} title="Toggle theme color mode">
            {dark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Box>
      
      {/* Navigation tabs row */}
      <Box 
        sx={{
          width: '100%',
          overflowX: 'auto',
          display: 'flex',
          justifyContent: { xs: 'flex-start', md: 'flex-start' }
        }}
      >
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: { xs: '36px', sm: '48px' },
            '.MuiTabs-scrollButtons': {
              '&.Mui-disabled': {
                opacity: 0.3,
              },
            },
            '.MuiTab-root': {
              minWidth: { xs: '70px', sm: '90px', md: 'auto' },
              minHeight: { xs: '36px', sm: '48px' }, 
              padding: { xs: '6px 12px', sm: '8px 16px' },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }
          }}
        >
          <Tab label="Transfers" value="home" />
          <Tab label="Events" value="events" />
          <Tab label="Bonders" value="bonders" />
          <Tab label="Gateways" value="gateways" />
          <Tab label="Tokens" value="tokens" />
          <Tab label="Paths" value="paths" />
          <Tab label="Prices" value="prices" />
          <Tab label="Analytics" value="analytics" />
        </Tabs>
      </Box>
    </Box>
  )
}
