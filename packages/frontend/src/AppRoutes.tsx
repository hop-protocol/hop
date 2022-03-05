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
import { Div } from './components/ui'

const AppRoutes: FC = () => {
  return (
    <Switch>
      <Div flexGrow={1}>
        <Div p={['2.2rem', '2.5rem']} flexGrow={1}>
          <Route exact path="/" component={() =>
            <Redirect to="/send" />
          } />
          <Route path="/stats" component={Stats} />
          <Route path="/send" component={Send} />

          <Route path="/convert" component={Convert} />
          <Route path="/pool" component={Pools} />
          <Route path="/stake" component={Stake} />
          <Route path="/withdraw" component={Withdraw} />

          <Route exact path={['/tx', '/tx/:hash']} component={TransactionPage} />

          <Route path="/components" component={Components} />
          <Redirect to="/send" />
        </Div>
      </Div>
    </Switch>
  )
}

export default AppRoutes
