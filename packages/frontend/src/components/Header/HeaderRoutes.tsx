import React, { FC, ChangeEvent } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import LaunchIcon from '@material-ui/icons/Launch'

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
  whitepaperTab: {
    color: '#46525C',
    opacity: '0.7',
    fontSize: '1.8rem',
    fontWeight: 700,
    lineHeight: '1.75',
    whiteSpace: 'normal',
    textTransform: 'capitalize',
    textDecoration: 'none',
    alignSelf: 'center'
  },
  whitepaperExternalLink: {
    color: '#46525C',
    opacity: '0.7'
  }
}))

const HeaderRoutes: FC<Props> = () => {
  const { pathname } = useLocation()
  const history = useHistory()
  const styles = useStyles()

  const handleChange = (event: ChangeEvent<{}>, value: string) => {
    event.preventDefault()
    history.push(value)
  }

  const value = pathname
    .split('/')
    .slice(0, 2)
    .join('/')

  return (
    <Tabs value={value} onChange={handleChange}>
      <Tab label="Send" value="/send" />
      <Tab label="Pool" value="/pool" />
      {/* <Tab label="Stake" value="/stake" /> */}
      {/* <Tab label="HOP" value="/earn" /> */}
      {/* <Tab label="Vote" value="/vote" /> */}
      <Tab label="Convert" value="/convert" />
      <Tab label="Faucet" value="/faucet" />
      <Box className={styles.whitepaperTabContainer}>
        <a
          className={styles.whitepaperTab}
          rel="noopener noreferrer"
          href={`${window.location.origin}/whitepaper.pdf`}
          target="_blank"
        >
          Whitepaper
        </a>
        <LaunchIcon className={styles.whitepaperExternalLink} />
      </Box>
    </Tabs>
  )
}

export default HeaderRoutes
