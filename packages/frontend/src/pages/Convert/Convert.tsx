import React, { FC, ChangeEvent } from 'react'
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation,
  useRouteMatch
} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import ConvertContext from 'src/pages/Convert/ConvertContext'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import MenuItem from '@material-ui/core/MenuItem'
import ConvertViaHopBridge from 'src/pages/Convert/ConvertViaHopBridge'
import ConvertViaCanonicalBridge from 'src/pages/Convert/ConvertViaCanonicalBridge'
import ConvertViaUniswap from 'src/pages/Convert/ConvertViaUniswap'

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: '4.2rem'
  },
  tabs: {
    marginBottom: '4.4rem'
  },
  box: {
    marginBottom: '4.2rem'
  }
}))

const Convert: FC = () => {
  const styles = useStyles()
  const { pathname } = useLocation()
  const { path } = useRouteMatch()
  const history = useHistory()

  const lastPathname = pathname.replace(path, '') || '/bridge'
  const handleTabChange = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string
    history.push(`${path}${value}`)
  }

  const tabs = [
    { label: 'via Hop Bridge', value: '/hop' },
    { label: 'via Canonical Bridge', value: '/bridge' },
    { label: 'via Uniswap', value: '/uniswap' }
  ]

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="h4" className={styles.title}>
          Convert
        </Typography>
      </Box>
      <Grid className={styles.tabs}>
        <RaisedSelect value={lastPathname} onChange={handleTabChange}>
          {tabs.map(tab => (
            <MenuItem value={tab.value} key={tab.value}>
              {tab.label}
            </MenuItem>
          ))}
        </RaisedSelect>
      </Grid>
      <Switch>
        <Route path={`${path}/hop`}>
          <div className={styles.box}>
            <ConvertContext>
              <ConvertViaHopBridge />
            </ConvertContext>
          </div>
        </Route>
        <Route path={`${path}/bridge`}>
          <div className={styles.box}>
            <ConvertContext>
              <ConvertViaCanonicalBridge />
            </ConvertContext>
          </div>
        </Route>
        <Route path={`${path}/uniswap`}>
          <div className={styles.box}>
            <ConvertContext>
              <ConvertViaUniswap />
            </ConvertContext>
          </div>
        </Route>
        <Redirect to={`${path}/hop`} />
      </Switch>
    </Box>
  )
}

export default Convert
