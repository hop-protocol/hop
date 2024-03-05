import React, { useMemo, useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@mui/styles'

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
  const history = useHistory()
  const location = useLocation()

  const currentTab = useMemo(() => {
    const routes: any = {
      '/': 'home',
      '/tutorial': 'tutorial',
      '/hardhat-tutorial': 'hardhat-tutorial'
    }

    return routes[location.pathname]
  }, [])

  function handleTabChange (event: any, newValue: number) {
    const routes: any = {
      home: '/',
      tutorial: '/tutorial',
      'hardhat-tutorial': '/hardhat-tutorial',
    }
    history.push(routes[newValue])
  }

  return (
    <Box width="100%" mb={4} display="flex" justifyContent="space-between">
      <Box display="flex" className={styles.container}>
        <Box display="flex" justifyItems="center" alignItems="center" className={styles.container}>
          <Box>
            <Typography variant="h4">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Box mr={1}><img width="32px" src="https://assets.hop.exchange/images/hop_logo.png" style={{ borderRadius: '50%' }}/></Box><Box>Hop v2 SDK Playground</Box>
              </Box>
            </Typography>
          </Box>
          <Box ml={2}>
            <Typography variant="subtitle1">
              Goerli
            </Typography>
          </Box>
        </Box>
        <Box ml={4} className={styles.tabs}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Home" value="home" />
            <Tab label="Connector Demo" value="tutorial" />
            <Tab label="Connector Hardhat Tutorial" value="hardhat-tutorial" />
          </Tabs>
        </Box>
      </Box>
    </Box>
  )
}
