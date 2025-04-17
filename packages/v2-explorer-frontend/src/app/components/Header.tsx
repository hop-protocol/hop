import Box from '@mui/material/Box'
import React, { useMemo, useEffect, useState } from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { networkName, networkSlug } from '@/app/config'
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
import CodeIcon from '@mui/icons-material/Code'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'

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
  const { theme, dark: isDarkMode, toggleTheme } = useTheme()
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))
  const [alternativeExplorer, setAlternativeExplorer] = useState({
    url: '',
    label: ''
  })

  useEffect(() => {
    // Check network slug from config instead of hostname
    const isMainnet = networkSlug === 'mainnet'
    
    if (isMainnet) {
      setAlternativeExplorer({
        url: 'https://v2-explorer-sepolia.hop.exchange/',
        label: 'Sepolia Explorer'
      })
    } else {
      setAlternativeExplorer({
        url: 'https://v2-explorer.hop.exchange/',
        label: 'Mainnet Explorer'
      })
    }
  }, [])

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

  const logoImage = isDarkMode ? logoDark : logo

  return (
    <Box width="100%" mb={{ xs: 3, sm: 3, md: 4 }} mt={{ xs: 2, sm: 2 }}>
      {/* Header top row - logo and theme toggle */}
      <Box 
        display="flex" 
        width="100%"
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexDirection={{ xs: 'column', sm: 'row' }}
        mb={{ xs: 2, md: 2 }}
        gap={{ xs: 2, sm: 0 }}
      >
        {/* Logo and title area */}
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
              sx={{ 
                fontSize: { xs: '1.6rem', sm: '2rem' },
                fontWeight: { xs: 600, sm: 500 },
                lineHeight: 1.2
              }}
            >
              <a href="/" style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}>
                <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                  <Box display="flex">
                    <img 
                      src={logoImage} 
                      alt="Hop" 
                      style={{ 
                        height: isMobile ? '28px' : '32px',
                        width: 'auto'
                      }} 
                    />
                  </Box>
                  <Box style={{ whiteSpace: 'nowrap' }}>v2 Explorer</Box>
                </Box>
              </a>
            </Typography>
          </Box>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 'medium',
              color: 'primary.main',
              padding: { xs: '0.25rem 0', sm: '0.25rem 0.75rem' },
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
              borderRadius: 1
            }}
          >
            {networkName}
          </Typography>
        </Box>
        
        {/* Actions area - links and theme toggle */}
        <Box 
          display="flex" 
          width={{ xs: '100%', sm: 'auto' }}
          justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
          alignItems="center" 
          gap={1.5}
          flexWrap="wrap"
        >
          <Box display="flex" gap={1.5}>
            {alternativeExplorer.url && (
              <Tooltip 
                title={alternativeExplorer.label === 'Mainnet Explorer' ? 'Coming soon' : ''} 
                arrow
              >
                <span>
                  <Button
                    variant="outlined"
                    size="small"
                    href={alternativeExplorer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={!isSmallMobile && <SyncAltIcon />}
                    disabled={alternativeExplorer.label === 'Mainnet Explorer'}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      whiteSpace: 'nowrap',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      px: { xs: 1, sm: 1.5 },
                      py: { xs: 0.5, sm: 0.75 },
                      minWidth: { xs: 'auto', sm: 'auto' },
                      opacity: 1,
                      cursor: alternativeExplorer.label === 'Mainnet Explorer' ? 'not-allowed' : 'pointer',
                      pointerEvents: alternativeExplorer.label === 'Mainnet Explorer' ? 'auto' : 'auto',
                      '&.Mui-disabled': {
                        color: theme => theme.palette.mode === 'dark' ? 'text.secondary' : 'rgba(0, 0, 0, 0.3)',
                        borderColor: theme => theme.palette.mode === 'dark' ? 'text.disabled' : 'rgba(0, 0, 0, 0.12)',
                        backgroundColor: theme => theme.palette.mode === 'dark' ? 'action.disabledBackground' : 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    {isSmallMobile ? <SyncAltIcon fontSize="small" /> : alternativeExplorer.label}
                  </Button>
                </span>
              </Tooltip>
            )}
            <Button
              variant="outlined"
              size="small"
              href="https://v2-playground.hop.exchange/"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={!isSmallMobile && <CodeIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, sm: 1.5 },
                py: { xs: 0.5, sm: 0.75 },
                minWidth: { xs: 'auto', sm: 'auto' }
              }}
            >
              {isSmallMobile ? <CodeIcon fontSize="small" /> : "V2 Playground"}
            </Button>
          </Box>
          <IconButton 
            onClick={toggleTheme} 
            title="Toggle theme color mode"
            size={isMobile ? "small" : "medium"}
            sx={{
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              },
              p: { xs: 1, sm: 1.25 }
            }}
          >
            {isDarkMode ? <LightModeIcon fontSize={isMobile ? "small" : "medium"} /> : <DarkModeIcon fontSize={isMobile ? "small" : "medium"} />}
          </IconButton>
        </Box>
      </Box>
      
      {/* Navigation tabs row */}
      <Paper 
        elevation={0} 
        sx={{
          width: '100%',
          borderRadius: 2,
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'}`,
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{
            width: '100%',
            overflowX: 'auto',
            display: 'flex',
            justifyContent: { xs: 'flex-start', md: 'flex-start' },
            padding: { xs: '2px', sm: '4px 8px' }
          }}
        >
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: { xs: '40px', sm: '48px' },
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
