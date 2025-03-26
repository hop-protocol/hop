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
// Import icons for navigation tabs
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle'
import EventIcon from '@mui/icons-material/Event'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import StorageIcon from '@mui/icons-material/Storage'
import TokenIcon from '@mui/icons-material/Token'
import RouteIcon from '@mui/icons-material/Route'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import InsightsIcon from '@mui/icons-material/Insights'
import Paper from '@mui/material/Paper'

const logoDark = 'https://user-images.githubusercontent.com/168240/218285469-4df03677-43de-4abd-986d-b6dd99a3b961.svg'
const logo = 'https://user-images.githubusercontent.com/168240/218271509-66a35bed-94f7-46da-ab41-71c806ac9a96.svg'

// Custom Tab component with icon
interface StyledTabProps {
  label: string;
  value: string;
  icon: React.ReactElement;
}

function StyledTab(props: StyledTabProps) {
  const { label, value, icon, ...other } = props;
  
  return (
    <Tab
      sx={{
        minHeight: { xs: '36px', sm: '48px' },
        minWidth: { xs: '70px', sm: '90px', md: 'auto' },
        padding: { xs: '6px 12px', sm: '12px 16px' },
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
        fontWeight: 'medium',
        transition: 'all 0.2s ease-in-out',
        opacity: 0.8,
        '&.Mui-selected': {
          opacity: 1,
          fontWeight: 'bold',
        },
        '&:hover': {
          opacity: 1,
          backgroundColor: 'rgba(144, 202, 249, 0.08)',
        },
        display: 'flex',
        flexDirection: { xs: 'row', md: 'row' },
        alignItems: 'center',
        gap: 1,
      }}
      icon={icon}
      iconPosition="start"
      label={label}
      value={value}
      {...other}
    />
  );
}

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
          <IconButton 
            onClick={toggleTheme} 
            title="Toggle theme color mode"
            sx={{
              backgroundColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              }
            }}
          >
            {dark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Box>
      
      {/* Navigation tabs row */}
      <Paper 
        elevation={0} 
        sx={{
          width: '100%',
          borderRadius: 2,
          backgroundColor: dark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
          border: `1px solid ${dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'}`,
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{
            width: '100%',
            overflowX: 'auto',
            display: 'flex',
            justifyContent: { xs: 'flex-start', md: 'flex-start' },
            padding: { xs: '4px', sm: '4px 8px' }
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
              '.MuiTabs-indicator': {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }
            }}
          >
            <StyledTab 
              label={isMobile ? "" : "Transfers"} 
              value="home" 
              icon={<SwapHorizontalCircleIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.3rem' }} />} 
            />
            <StyledTab 
              label={isMobile ? "" : "Events"} 
              value="events" 
              icon={<EventIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.3rem' }} />} 
            />
            <StyledTab 
              label={isMobile ? "" : "Bonders"} 
              value="bonders" 
              icon={<SupervisorAccountIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.3rem' }} />} 
            />
            <StyledTab 
              label={isMobile ? "" : "Gateways"} 
              value="gateways" 
              icon={<StorageIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.3rem' }} />} 
            />
            <StyledTab 
              label={isMobile ? "" : "Paths"} 
              value="paths" 
              icon={<RouteIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.3rem' }} />} 
            />
            <StyledTab 
              label={isMobile ? "" : "Tokens"} 
              value="tokens" 
              icon={<TokenIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.3rem' }} />} 
            />
            <StyledTab 
              label={isMobile ? "" : "Prices"} 
              value="prices" 
              icon={<AttachMoneyIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.3rem' }} />} 
            />
            <StyledTab 
              label={isMobile ? "" : "Analytics"} 
              value="analytics" 
              icon={<InsightsIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.3rem' }} />} 
            />
          </Tabs>
        </Box>
      </Paper>
    </Box>
  )
}
