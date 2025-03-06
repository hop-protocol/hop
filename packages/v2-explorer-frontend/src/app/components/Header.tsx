import Box from '@mui/material/Box'
import React, { useMemo } from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import { networkName } from '@/app/config'
import { usePathname } from 'next/navigation'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@/app/hooks/useTheme'
import { useRouter } from 'next/navigation'

const logoDark = 'https://user-images.githubusercontent.com/168240/218285469-4df03677-43de-4abd-986d-b6dd99a3b961.svg'
const logo = 'https://user-images.githubusercontent.com/168240/218271509-66a35bed-94f7-46da-ab41-71c806ac9a96.svg'

const useStyles = makeStyles((theme: any) => ({
  container: {
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '90%'
    }
  },
  tabs: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
      overflow: 'auto',
      marginTop: '1rem',
      marginLeft: '0',
      display: 'flex',
      justifyContent: 'center',
    }
  }
}))

export function Header () {
  const styles = useStyles()
  const router = useRouter()
  const navigate = router.push
  const pathname = usePathname()
  const { theme, dark, toggleTheme } = useTheme()

  const currentTab = useMemo(() => {
    const routes: any = {
      '/': 'home',
      '/events': 'events',
      '/tokens': 'tokens',
      '/paths': 'paths',
      '/prices': 'prices',
      '/stats': 'stats',
      '/contracts': 'contracts',
      '/bonders': 'bonders',
    }

    return routes[pathname] ?? 'home'
  }, [pathname])

  function handleTabChange (event: any, newValue: number) {
    const routes: any = {
      home: '/',
      events: '/events',
      tokens: '/tokens',
      paths: '/paths',
      prices: '/prices',
      stats: '/stats',
      contracts: '/contracts',
      bonders: '/bonders',
    }
    navigate(routes[newValue])
  }

  const logoImage = dark ? logoDark : logo

  return (
    <Box width="100%" mb={4} display="flex" justifyContent="space-between">
      <Box display="flex" className={styles.container}>
        <Box display="flex" justifyItems="center" alignItems="center" className={styles.container}>
          <Box>
            <Typography variant="h4" color="textPrimary">
              <a href="/" style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Box display="flex" mr={1}>
                  <img src={logoImage} alt="Hop" />
                  </Box><Box style={{ whiteSpace: 'nowrap' }}>v2 Explorer</Box>
                </Box>
              </a>
            </Typography>
          </Box>
          <Box ml={2}>
            <Typography variant="subtitle1" color="secondary">
              {networkName}
            </Typography>
          </Box>
        </Box>
        <Box ml={4} className={styles.tabs}>
          <Tabs value={currentTab} onChange={handleTabChange}
            sx={{
              '.MuiTabs-scroller': {
                overflow: 'auto !important', // TODO: Fix this
              }
            }}
          >
            <Tab label="Transfers" value="home" />
            <Tab label="Events" value="events" />
            <Tab label="Bonders" value="bonders" />
            <Tab label="Gateways" value="contracts" />
            <Tab label="Tokens" value="tokens" />
            <Tab label="Paths" value="paths" />
            <Tab label="Prices" value="prices" />
            <Tab label="Stats" value="stats" />
          </Tabs>
        </Box>
      </Box>
      <Box>
        <IconButton onClick={toggleTheme} title="Toggle theme color mode">
          { dark ? <LightModeIcon /> : <DarkModeIcon /> }
        </IconButton>
      </Box>
    </Box>
  )
}
