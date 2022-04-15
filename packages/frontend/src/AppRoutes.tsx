import React, { FC } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Components from 'src/pages/Components'
import Send from 'src/pages/Send'
import Pools from 'src/pages/Pools'
import Stake from 'src/pages/Stake'
import Convert from 'src/pages/Convert'
import Stats from 'src/pages/Stats'
import Withdraw from 'src/pages/Withdraw'
import Health from 'src/pages/Health'
import TransactionPage from 'src/pages/Transaction'
import { Div } from './components/ui'

const AppRoutes: FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={() =>
        <Redirect to="/send" />
      } />
      <Div flexGrow={1}>
        <Div p={['2.2rem', '2.5rem']} flexGrow={1}>
          <Route exact path="/stats" component={Stats} />
          <Route exact path="/send" component={Send} />

          <Route path="/convert" component={Convert} />
          <Route exact path="/pool" component={Pools} />
          <Route exact path="/stake" component={Stake} />
          <Route exact path="/withdraw" component={Withdraw} />
          <Route exact path="/health" component={Health} />

          <Route exact path={['/tx', '/tx/:hash']} component={TransactionPage} />

          <Route exact path="/components" component={Components} />
        </Div>
      </Div>
      <Route component={() =>
        <Redirect to="/send" />
      } />
    </Switch>
  )
}

export default AppRoutes
