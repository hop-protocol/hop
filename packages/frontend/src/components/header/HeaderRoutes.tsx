import React, { FC, ChangeEvent } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import LaunchIcon from '@material-ui/icons/Launch'
import { isMainnet } from 'src/config'

type Props = {}

const useStyles = makeStyles((theme: Theme) => ({
  whitepaperTabContainer: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
    flexDirection: 'row',
    padding: '6px 12px',
    alignItems: 'center'
  },
  whitepaperExternalLink: {
    paddingLeft: '0.6rem'
  }
}))

const HeaderRoutes: FC<Props> = () => {
  const { pathname, search } = useLocation()
  const history = useHistory()
  const styles = useStyles()

  const handleChange = (event: ChangeEvent<{}>, value: string) => {
    event.preventDefault()
    history.push({
      pathname: value,
      search
    })
  }

  const value = pathname
    .split('/')
    .slice(0, 2)
    .join('/')

  const goToWhitepaper = () => {
    window.open('/whitepaper.pdf', 'noopener', 'noreferrer')
  }

  return (
    <Tabs value={value} onChange={handleChange}>
      <Tab label="Send" value="/send" />
      <Tab label="Pool" value="/pool" />
      {/* <Tab label="HOP" value="/earn" /> */}
      {/* <Tab label="Vote" value="/vote" /> */}
      <Tab label="Convert" value="/convert" />
      <Tab label="Stake" value="/stake" />
      {!isMainnet ? <Tab label="Faucet" value="/faucet" /> : null}
    </Tabs>
  )
}

export default HeaderRoutes
