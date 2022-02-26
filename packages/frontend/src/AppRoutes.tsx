import React, { FC } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Components from 'src/pages/Components'
import Send from 'src/pages/Send'
import Pools from 'src/pages/Pools'
import Stake from 'src/pages/Stake'
import Convert from 'src/pages/Convert'
import Stats from 'src/pages/Stats'
import Withdraw from 'src/pages/Withdraw'
import TransactionPage from 'src/pages/Transaction'
import { useThemeMode } from './theme/ThemeProvider'
import { makeStyles } from '@material-ui/core'
import bgImage from 'src/assets/circles-bg.svg'
import bgImageDark from 'src/assets/circles-bg-dark.svg'

const useStyles = makeStyles(theme => ({
  app: {
    backgroundImage: ({ isDarkMode }: any) =>
      isDarkMode ? `url(${bgImageDark})` : `url(${bgImage})`,
    backgroundColor: theme.palette.background.default,
    backgroundSize: '120%',
    transition: 'background 0.15s ease-out',
  },
  stats: {
    flexGrow: 1,
  },
  content: {
    padding: '2.5rem',
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      padding: '2.2rem',
    },
  },
}))

const AppRoutes: FC = () => {
  const { isDarkMode } = useThemeMode()
  const styles = useStyles({ isDarkMode })

  return (
    <Switch>
      <div className={styles.stats}>
        <Route path="/stats" component={Stats} />
        <div className={styles.content}>
          <Route path="/(send|arbitrum|optimism|polygon|gnosis)" component={Send} />

          <Route path="/convert" component={Convert} />
          <Route path="/pool" component={Pools} />
          <Route path="/stake" component={Stake} />
          <Route path="/withdraw" component={Withdraw} />

          <Route exact path={['/tx', '/tx/:hash']} component={TransactionPage} />

          <Route path="/components" component={Components} />
        </div>
      </div>
      <Redirect to="/send" />
    </Switch>
  )
}

export default AppRoutes
