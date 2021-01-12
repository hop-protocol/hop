import React, { FC } from 'react'
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
import FlatTabs from 'src/components/tabs/FlatTabs'
import ConvertContext from 'src/pages/Convert/ConvertContext'
import ConvertViaHopBridge from 'src/pages/Convert/ConvertViaHopBridge'
import ConvertViaL2Bridge from 'src/pages/Convert/ConvertViaL2Bridge'
import ConvertViaUniswap from 'src/pages/Convert/ConvertViaUniswap'

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: '4.2rem'
  },
  tabs: {
    marginBottom: '1rem'
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
  const handleTabChange = (value: string) => {
    history.push(`${path}${value}`)
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="h4" className={styles.title}>
          Convert
        </Typography>
      </Box>
      <Grid className={styles.tabs}>
        <FlatTabs
          value={lastPathname}
          onChange={handleTabChange}
          tabs={[
            { label: 'via Hop Bridge', value: '/hop' },
            { label: 'via Canonical Bridge', value: '/bridge' },
            { label: 'via Uniswap', value: '/uniswap' }
          ]}
        />
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
              <ConvertViaL2Bridge />
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
        <Redirect to={`${path}/bridge`} />
      </Switch>
    </Box>
  )
}

export default Convert
