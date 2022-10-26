import React, { FC, ChangeEvent } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { isMainnet, showRewards } from 'src/config'
import { useClaim } from 'src/pages/Claim/useClaim'
import { makeStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/core'
import { useHasRewards } from 'src/pages/Rewards/useHasRewards'

const useStyles = makeStyles((theme) => ({
  tabs: {
    "& .MuiTabs-flexContainer": {
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }
}));

const HeaderRoutes: FC = () => {
  const { pathname, search } = useLocation()
  const history = useHistory()
  const styles = useStyles()
  const theme = useTheme()

  const handleChange = (event: ChangeEvent<{}>, newValue: string) => {
    event.preventDefault()
    history.push({
      pathname: newValue,
      search,
    })
  }

  let value = pathname.split('/').slice(0, 2).join('/')
  if (value?.includes('/pool')) {
    value = '/pools'
  }
  const { canClaim } = useClaim()

  let hasRewards = false
  if (showRewards) {
    ({ hasRewards } = useHasRewards())
  }

  return (
    <Tabs value={value || '/send'} onChange={handleChange} style={{ width: 'max-content' }} variant="scrollable"
    scrollButtons="auto" className={styles.tabs}>
      <Tab label="Send" value="/send" />
      <Tab label="Pool" value="/pools" />
      <Tab label="Convert" value="/convert" />
      {/* isMainnet && <Tab label="Stake" value="/stake" /> */}
      {canClaim && (
        <Tab label="Claim HOP" value="/claim" className="rainbow-animated" style={{
          // background: 'rgba(0, 0, 0, 0) linear-gradient(99.85deg, rgb(179, 46, 255) -18.29%, rgb(242, 164, 152) 109.86%) repeat scroll 0% 0%',
          color: '#fff',
          padding: '1rem 3rem',
          margin: '1rem 0 1rem 1rem',
          opacity: 1
        }}/>
      )}
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
    </Tabs>
  )
}

export default HeaderRoutes
