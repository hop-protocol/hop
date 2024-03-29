import React, { ChangeEvent, FC } from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { isMainnet, showRewards } from 'src/config'
import { makeStyles, useTheme } from '@mui/styles'
import { useClaim } from 'src/pages/Claim/useClaim'
import { useLocation, useNavigate } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  tabs: {
    "& .MuiTabs-flexContainer": {
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
  }
}));

export const HeaderRoutes: FC = () => {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const styles = useStyles()
  const theme = useTheme()

  const handleChange = (event: ChangeEvent<object>, newValue: string) => {
    event.preventDefault()
    navigate(`${newValue}${search}`)
  }

  const value = pathname.split('/').slice(0, 2).join('/')
  const { canClaim } = useClaim()

  const hasRewards = false

  return (
    <Tabs value={value || '/send'} onChange={handleChange} style={{ width: 'max-content' }} variant="scrollable"
    scrollButtons="auto" className={styles.tabs}>
      <Tab label="Send" value="/send" />
      <Tab label="Pool" value="/pools" />
      <Tab label="Convert" value="/convert" />
      {showRewards && (
        <Tab label={<span style={{
            display: 'inline-block',
            position: 'relative'
          }}>Rewards {hasRewards && <mark style={{
          background: 'none',
          color: theme.palette?.primary?.main,
          display: 'inline-block',
          position: 'absolute',
          top: '-10px',
          right: '-10px'
        }}>•</mark>}</span>} value="/rewards" />
      )}
      {!isMainnet && <Tab label="Faucet" value="/faucet" />}
      {canClaim && (
        <Tab label="Claim HOP" value="/claim" style={{
          color: '#fff',
          padding: '1rem 3rem',
          margin: '1rem 0 1rem 1rem',
          opacity: 1
        }}/>
      )}
    </Tabs>
  )
}
