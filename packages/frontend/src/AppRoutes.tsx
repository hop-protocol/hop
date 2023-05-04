import React, { FC, lazy, Suspense } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Send from 'src/pages/Send'
import { Div } from './components/ui'
import { Claim } from 'src/pages/Claim'

import { AirdropPreview } from './pages/Airdrop/AirdropPreview'
import { Loading } from './components/Loading'

const PoolsOverview = lazy(() => import(/* webpackChunkName: "Pools" */ 'src/pages/Pools/PoolsOverview'))
const PoolDetails = lazy(() => import(/* webpackChunkName: "Pools" */ 'src/pages/Pools'))
const Convert = lazy(() => import(/* webpackChunkName: "Convert" */ 'src/pages/Convert'))
const Stats = lazy(() => import(/* webpackChunkName: "Stats" */ 'src/pages/Stats'))
const Withdraw = lazy(() => import(/* webpackChunkName: "Withdraw" */ 'src/pages/Withdraw'))
const Faucet = lazy(() => import(/* webpackChunkName: "Faucet" */ 'src/pages/Faucet'))
const Health = lazy(() => import(/* webpackChunkName: "Health" */ 'src/pages/Health'))
const Rewards = lazy(() => import(/* webpackChunkName: "Rewards" */ 'src/pages/Rewards'))
const Components = lazy(() => import(/* webpackChunkName: "Components" */ 'src/pages/Components'))

const SocialVerified = lazy(
  () => import(/* webpackChunkName: "SocialVerified" */ './pages/Airdrop/SocialVerified')
)
const TransactionPage = lazy(
  () => import(/* webpackChunkName: "TransactionPage" */ 'src/pages/Transaction')
)
const SocialVerify = lazy(
  () => import(/* webpackChunkName: "SocialVerify" */ 'src/pages/Airdrop/SocialVerify')
)
const AuthereumVerify = lazy(
  () => import(/* webpackChunkName: "AuthereumVerify" */ 'src/pages/Airdrop/AuthereumVerify')
)
const AuthereumVerified = lazy(
  () => import(/* webpackChunkName: "AuthereumVerified" */ './pages/Airdrop/AuthereumVerified')
)

const AppRoutes: FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={() => <Redirect to="/send" />} />
      <Route exact path="/airdrop" component={() => <Redirect to="/airdrop/preview" />} />
      <Div flexGrow={1} display="flex" flexDirection="column" alignItems="center">
        <Div p={['12px', '16px']} flexGrow={1}>
          <Suspense fallback={<Loading />}>
            <Route exact path="/stats" component={Stats} />
            <Route exact path="/send" component={Send} />
            <Route path="/convert" component={Convert} />
            <Route exact path="/pools" component={PoolsOverview} />
            <Route exact path="/pool" component={() => <Redirect to="/pool/deposit" />} />
            <Route path="/pool/:tab" component={PoolDetails} />
            <Route exact path="/rewards" component={Rewards} />
            <Route exact path="/withdraw" component={Withdraw} />
            <Route exact path="/health" component={Health} />
            <Route exact path="/faucet" component={Faucet} />
            <Route path="/claim" component={Claim} />
            <Route exact path="/airdrop/social-verify" component={SocialVerify} />
            <Route path="/airdrop/preview" component={AirdropPreview} />
            <Route exact path="/social-verified" component={SocialVerified} />
            <Route exact path="/authereum-verified" component={AuthereumVerified} />
            <Route exact path="/airdrop/authereum" component={AuthereumVerify} />
            <Route exact path={['/tx', '/tx/:hash']} component={TransactionPage} />
            <Route exact path="/components" component={Components} />
            <Route exact path="/stake" component={() => <Redirect to="/pool/stake" />} />
          </Suspense>
        </Div>
      </Div>
      <Route component={() => <Redirect to="/send" />} />
    </Switch>
  )
}

export default AppRoutes
