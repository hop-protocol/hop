import React, { FC } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Components from 'src/pages/Components'
import Send from 'src/pages/Send'
import Pools from 'src/pages/Pools'
import Stake from 'src/pages/Stake'
import SocialVerify from 'src/pages/Airdrop/SocialVerify'
import AuthereumVerify from 'src/pages/Airdrop/AuthereumVerify'
import Convert from 'src/pages/Convert'
import Stats from 'src/pages/Stats'
import Withdraw from 'src/pages/Withdraw'
import Health from 'src/pages/Health'
import TransactionPage from 'src/pages/Transaction'
import { Div } from './components/ui'
import SocialVerified from './pages/Airdrop/SocialVerified'
import AuthereumVerified from './pages/Airdrop/AuthereumVerified'
import { AirdropPreview } from './pages/Airdrop/AirdropPreview'

const AppRoutes: FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={() => <Redirect to="/send" />} />
      <Route exact path="/airdrop" component={() => <Redirect to="/airdrop/preview" />} />
      <Div flexGrow={1}>
        <Div p={['2.2rem', '2.5rem']} flexGrow={1}>
          <Route exact path="/stats" component={Stats} />
          <Route exact path="/send" component={Send} />

          <Route path="/convert" component={Convert} />
          <Route exact path="/pool" component={Pools} />
          <Route exact path="/stake" component={Stake} />
          <Route exact path="/withdraw" component={Withdraw} />
          <Route exact path="/health" component={Health} />
          <Route exact path="/airdrop/social-verify" component={SocialVerify} />
          <Route path="/airdrop/preview" component={AirdropPreview} />
          <Route exact path="/social-verified" component={SocialVerified} />
          <Route exact path="/authereum-verified" component={AuthereumVerified} />
          <Route exact path="/airdrop/authereum" component={AuthereumVerify} />
          <Route exact path={['/tx', '/tx/:hash']} component={TransactionPage} />

          <Route exact path="/components" component={Components} />
        </Div>
      </Div>
      <Route component={() => <Redirect to="/send" />} />
    </Switch>
  )
}

export default AppRoutes
