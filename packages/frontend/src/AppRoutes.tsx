import React, { FC } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Components from 'src/pages/Components'
import Send from 'src/pages/Send'
import Vote from './pages/Vote'
import VotePage from './pages/Vote/VotePage'
import Pools from 'src/pages/Pools'
import Convert from 'src/pages/Convert'
import Demo from 'src/pages/Demo'

type Props = {}

interface IProposal {
  index: string
  description: string
  status: string
}

const proposals: IProposal[] = [
  {
    index: '1',
    description: 'Reduce HOP Governance Proposal',
    status: 'defeated'
  }, {
    index: '2',
    description: 'Retroactive Proxy Contract Airdrop',
    status: 'passed'
  }
]

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

      {/* Vote Pages */}
      <Route path="/vote/1">
        <VotePage
          proposal={proposals[0]}
        />
      </Route>
      <Route path="/vote">
        <Vote 
        proposals={proposals}
      />

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
