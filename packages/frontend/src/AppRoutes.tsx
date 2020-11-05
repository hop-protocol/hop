import React, { FC } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import Components from './pages/Components'
import Send from './pages/Send'

type Props = {}

const COMPONENT_NAME: FC<Props> = () => {

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          Home
        </Route>
        <Route path="/components">
          <Components />
        </Route>
        <Route path="/send">
          <Send />
        </Route>
      </Switch>
    </Router>
  )
}

export default COMPONENT_NAME