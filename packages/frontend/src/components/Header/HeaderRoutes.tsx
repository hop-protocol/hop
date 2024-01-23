import React, { FC, ChangeEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { isMainnet, showRewards } from 'src/config'
import { useClaim } from 'src/pages/Claim/useClaim'
import { useTheme, makeStyles } from '@mui/styles'
// import { useHasRewards } from 'src/pages/Rewards/useHasRewards'

const useStyles = makeStyles((theme: any) => ({
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
  const theme: any = useTheme()

  const handleChange = (event: ChangeEvent<{}>, newValue: string) => {
    event.preventDefault()
    navigate(`${newValue}${search}`)
  }

  let value = pathname.split('/').slice(0, 2).join('/')
  if (value?.includes('/pool')) {
    value = '/pools'
  }
  const { canClaim } = useClaim()

  const hasRewards = false
  if (showRewards) {
    // ({ hasRewards } = useHasRewards()) // disabled to reduce polling and rpc calls
  }

  return (
    <Tabs value={value || '/send'} onChange={handleChange} style={{ width: 'max-content' }} variant="scrollable"
    scrollButtons="auto" className={styles.tabs}>
      <Tab label="Send" value="/send" />
      <Tab label="Pool" value="/pools" />
      <Tab label="Convert" value="/convert" />
      {/* isMainnet && <Tab label="Stake" value="/stake" /> */}
      {showRewards && (
        <Tab label={<span style={{
            display: 'inline-block',
            position: 'relative'
          }}>Rewards {hasRewards && <mark style={{
          background: 'none',
          color: theme.palette.primary.main,
          display: 'inline-block',
          position: 'absolute',
          top: '-10px',
          right: '-10px'
        }}>•</mark>}</span>} value="/rewards" />
      )}
      {!isMainnet && <Tab label="Faucet" value="/faucet" />}
      {canClaim && (
        <Tab label="Claim HOP" value="/claim" className="rainbow-animated" style={{
          // background: 'rgba(0, 0, 0, 0) linear-gradient(99.85deg, rgb(179, 46, 255) -18.29%, rgb(242, 164, 152) 109.86%) repeat scroll 0% 0%',
          color: '#fff',
          padding: '1rem 3rem',
          margin: '1rem 0 1rem 1rem',
          opacity: 1
        }}/>
      )}
    </Tabs>
  )
}
