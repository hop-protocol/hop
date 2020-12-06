import React, { FC } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Components from 'src/pages/Components'
import Send from 'src/pages/Send'
import Vote from './pages/Vote'
import VotePage from './pages/Vote/VotePage'
import Pools from 'src/pages/Pools'
import Convert from 'src/pages/Convert'
import Demo from 'src/pages/Demo'

import { IProposal } from 'src/config'

type Props = {}

const mockDetails = [{
  target: 'the contract',
  functionSig: '0x12312312',
  callData: '0x'
}]

const mockProposals: IProposal[] = [
  {
    id: '1',
    title: 'Reduce HOP Governance Proposal',
    description: 'Wow 1',
    proposer: '0x92E5A4B202F57B3634d6352fBAbBA9Cf2908a14A',
    status: 'defeated',
    forCount: 1,
    againstCount: 2,
    startBlock: 123,
    endBlock: 678,
    details: mockDetails
  }, {
    id: '2',
    title: 'Retroactive Proxy Contract Airdrop',
    description: 'Wow 2',
    proposer: '0x92E5A4B202F57B3634d6352fBAbBA9Cf2908a14A',
    status: 'passed',
    forCount: 1,
    againstCount: 2,
    startBlock: 123,
    endBlock: 678,
    details: mockDetails
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
          proposal={mockProposals[0]}
        />
      </Route>
      <Route path="/vote">
        <Vote 
        proposals={mockProposals}
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
