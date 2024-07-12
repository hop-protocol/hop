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
import { useTheme } from '@/app/theme/useTheme'
import { useRouter } from 'next/navigation'

const logoDark = 'https://user-images.githubusercontent.com/168240/218285469-4df03677-43de-4abd-986d-b6dd99a3b961.svg'
const logo = 'https://user-images.githubusercontent.com/168240/218271509-66a35bed-94f7-46da-ab41-71c806ac9a96.svg'

const useStyles = makeStyles((theme: any) => ({
  container: {
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    }
  },
  tabs: {
    [theme.breakpoints.down('md')]: {
      marginTop: '1rem'
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
      '/events': 'events'
    }

    return routes[pathname] ?? 'home'
  }, [])

  function handleTabChange (event: any, newValue: number) {
    const routes: any = {
      home: '/',
      events: '/events'
    }
    navigate(routes[newValue])
  }

  return (
    <Box width="100%" mb={4} display="flex" justifyContent="space-between">
      <Box display="flex" className={styles.container}>
        <Box display="flex" justifyItems="center" alignItems="center" className={styles.container}>
          <Box>
            <Typography variant="h4" color="textPrimary">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Box mr={1}>
                <img src={dark ? logoDark : logo} alt="Hop" />
                </Box><Box style={{ whiteSpace: 'nowrap' }}>Hop v2 Explorer</Box>
              </Box>
            </Typography>
          </Box>
          <Box ml={2}>
            <Typography variant="subtitle1" color="secondary">
              {networkName}
            </Typography>
          </Box>
        </Box>
        <Box ml={4} className={styles.tabs}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Transfers" value="home" />
            <Tab label="Events" value="events" />
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
