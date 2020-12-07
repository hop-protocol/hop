import React, { FC } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Components from 'src/pages/Components'
import Send from 'src/pages/Send'
import Pools from 'src/pages/Pools'
import Convert from 'src/pages/Convert'
import Demo from 'src/pages/Demo'

type Props = {}

const COMPONENT_NAME: FC<Props> = () => {
  return (
    <Switch>
      <Route path="/send">
        <Send />
      </Route>
      <Route path="/convert">
        <Convert />
      </Route>
      <Route path="/pool">
        <Pools />
      </Route>
      <Route path="/stake">Staking coming soon</Route>
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
