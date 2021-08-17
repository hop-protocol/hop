import React, { FC } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Components from 'src/pages/Components'
import Send from 'src/pages/Send'
import Vote from './pages/Vote'
import VotePage from './pages/Vote/VotePage'
import Pools from 'src/pages/Pools'
import Faucet from 'src/pages/Faucet'
import Earn from 'src/pages/Earn'
import Stake from 'src/pages/Stake'
import Convert from 'src/pages/Convert'
import Stats from 'src/pages/Stats'
import { isMainnet, IProposal } from 'src/config'

type Props = {}

const mockDetails = [
  {
    target: '0x752Ebd504E4faC89397448b434aa3aA4AEcD0B5E',
    functionSig: 'transfer',
    callData:
      '0x967F2c0826AF779a09E42eff7BfAdAD7618b55E5, 5047600000000000000000000'
  }
]

const mockProposals: IProposal[] = [
  {
    id: '4',
    title: 'Upgrade to V3',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    proposer: '0x92E5A4B202F57B3634d6352fBAbBA9Cf2908a14A',
    status: 'active',
    forCount: 24100,
    againstCount: 21229,
    startBlock: 123,
    endBlock: 678,
    details: mockDetails
  },
  {
    id: '3',
    title: 'Govern the Treasury',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    proposer: '0x92E5A4B202F57B3634d6352fBAbBA9Cf2908a14A',
    status: 'succeeded',
    forCount: 24100,
    againstCount: 21229,
    startBlock: 123,
    endBlock: 678,
    details: mockDetails
  },
  {
    id: '2',
    title: 'Retroactive Proxy Contract Airdrop',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    proposer: '0x92E5A4B202F57B3634d6352fBAbBA9Cf2908a14A',
    status: 'cancelled',
    forCount: 24100,
    againstCount: 21229,
    startBlock: 123,
    endBlock: 678,
    details: mockDetails
  },
  {
    id: '1',
    title: 'Reduce HOP Governance Proposal',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    proposer: '0x92E5A4B202F57B3634d6352fBAbBA9Cf2908a14A',
    status: 'defeated',
    forCount: 1222,
    againstCount: 2245,
    startBlock: 123,
    endBlock: 678,
    details: mockDetails
  }
]

const COMPONENT_NAME: FC<Props> = () => {
  return (
    <Switch>
      <Route path="/(send|arbitrum|optimism|polygon|xdai)/">
        <Send />
      </Route>
      <Route path="/convert" exact >
        <Redirect to="/convert/amm" />
      </Route>
      <Route path="/convert">
        <Convert />
      </Route>
      <Route path="/pool">
        <Pools />
      </Route>
      {!isMainnet ? (
        <Route path="/faucet">
          <Faucet />
        </Route>
      ) : null}
      <Route path="/earn">
        <Earn />
      </Route>
      <Route path="/stake">
        <Stake />
      </Route>
      <Route path="/stats">
        <Stats />
      </Route>

      {/* Vote Pages */}
      <Route path="/vote/1">
        <VotePage proposal={mockProposals[3]} />
      </Route>
      <Route path="/vote/2">
        <VotePage proposal={mockProposals[2]} />
      </Route>
      <Route path="/vote/3">
        <VotePage proposal={mockProposals[1]} />
      </Route>
      <Route path="/vote/4">
        <VotePage proposal={mockProposals[0]} />
      </Route>
      <Route path="/vote">
        <Vote proposals={mockProposals} />
      </Route>
      <Route path="/stake">Staking coming soon</Route>

      <Route path="/components">
        <Components />
      </Route>
      <Redirect to="/send" />
    </Switch>
  )
}

export default COMPONENT_NAME
