import React, { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { useTheme as useMuiTheme } from '@mui/material/styles'
import HomeIcon from '@mui/icons-material/Home'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useTheme } from '../contexts/ThemeContext.js'

const useStyles = makeStyles((theme: any) => ({
  headerContainer: {
    padding: theme.spacing(2, 3),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1.5, 2),
    },
    position: 'sticky',
    top: 0,
    zIndex: 1100,
    transition: theme.transitions.create(['padding', 'background', 'box-shadow'], {
      duration: theme.transitions.duration.standard,
    }),
  },
  innerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'center',
    }
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
      marginBottom: theme.spacing(1.5),
    },
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(1),
    }
  },
  logoImage: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      transform: 'scale(1.05)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '36px',
      height: '36px',
    }
  },
  title: {
    fontWeight: 700,
    color: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.25rem',
    }
  },
  version: {
    fontSize: '0.7rem',
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: '3px 6px',
    borderRadius: '12px',
    marginLeft: theme.spacing(1),
    fontWeight: 'bold',
    position: 'relative',
    top: '-8px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.65rem',
      padding: '2px 5px',
      top: '-6px',
      marginLeft: theme.spacing(0.5),
    }
  },
  tabsContainer: {
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      width: '100%',
      maxWidth: '360px',
      justifyContent: 'center',
      display: 'flex',
      marginLeft: 0,
      marginTop: theme.spacing(1),
    }
  },
  tabs: {
    minHeight: '40px',
    '& .MuiTab-root': {
      minHeight: '36px',
      fontSize: '0.95rem',
      fontWeight: 500,
      textTransform: 'none',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.85rem',
        padding: theme.spacing(0.5, 1),
        minWidth: 'auto',
      }
    },
  },
  tabIcon: {
    marginRight: theme.spacing(0.75),
    fontSize: '1.1rem',
    verticalAlign: 'middle',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
      marginRight: theme.spacing(0.5),
    }
  }
}))

export function Header () {
  const styles = useStyles()
  const muiTheme = useMuiTheme()
  const { darkMode, toggleDarkMode } = useTheme()
  const history = useHistory()
  const location = useLocation()

  const currentTab = useMemo(() => {
    const routes: any = {
      '/': 'home',
      '/tutorial': 'tutorial',
      '/hardhat-tutorial': 'hardhat-tutorial'
    }

    return routes[location.pathname]
  }, [location.pathname])

  function handleTabChange (event: any, newValue: string) {
    const routes: any = {
      home: '/',
      tutorial: '/tutorial',
      'hardhat-tutorial': '/hardhat-tutorial',
    }
    history.push(routes[newValue])
  }

  return (
    <Box className={styles.headerContainer}>
      <Box 
        display="flex" 
        justifyContent="space-between"
        alignItems="center"
        className={styles.innerContainer}
      >
        <Box className={styles.logoContainer}>
          <img 
            className={styles.logoImage}
            src="https://assets.hop.exchange/images/hop_logo.png" 
            alt="Hop Logo"
          />
        </Box>
        
        <Box display="flex" alignItems="center" sx={{ width: { xs: '100%', md: 'auto' } }}>
          <Box className={styles.tabsContainer}>
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange}
              className={styles.tabs}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              textColor="primary"
              indicatorColor="primary"
            >
              {/*}
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HomeIcon className={styles.tabIcon} fontSize="small" />
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Home</Box>
                  </Box>
                } 
                value="home" 
                aria-label="Home"
              />
              */}
              {/* Commented out tabs that may be needed in the future */}
            </Tabs>
          </Box>
          
          {/* Dark mode toggle */}
          <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            <IconButton 
              onClick={toggleDarkMode} 
              sx={{ 
                ml: { xs: 1, sm: 2 },
                color: muiTheme.palette.primary.main,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'rotate(30deg)'
                },
                padding: { xs: 1, sm: 1.5 },
              }}
              aria-label="Toggle dark mode"
              size="small"
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  )
}
