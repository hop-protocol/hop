import React, { FC } from 'react'
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import Components from './pages/Components'
import Send from './pages/Send'
import Demo from './pages/Demo'

type Props = {}

const COMPONENT_NAME: FC<Props> = () => {

  return (
    <Switch>
      <Route path="/send">
        <Send />
      </Route>
      <Route path="/pool">
        Pools coming soon
      </Route>
      <Route path="/stake">
        Staking coming soon
      </Route>
      <Route path="/demo">
        <Demo />
      </Route>

      <Route path="/components">
        <Components />
      </Route>

      <Redirect to="/send" />
    </Switch>
  )
}

export default COMPONENT_NAME