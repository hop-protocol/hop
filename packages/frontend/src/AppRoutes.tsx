import React, { FC, lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
  const location = useLocation()

  // root and airdrop paths
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/send')
    } else if (location.pathname === '/airdrop') {
      navigate('/airdrop/preview')
    }
  }, [location, navigate])

  return (
    <Routes>
      <Route
        path="/*"
        element={
          <Div flexGrow={1}>
            <Div p={['2.2rem', '2.5rem']} flexGrow={1}>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/stats" element={<Stats />} />
                  <Route path="/send" element={<Send />} />
                  <Route path="/convert/*" element={<Convert />} />
                  <Route path="/pools" element={<PoolsOverview />} />
                  <Route path="/pool" element={<Navigate to="/pool/deposit" />} />
                  <Route path="/pool/:tab/*" element={<PoolDetails />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/withdraw" element={<Withdraw />} />
                  <Route path="/health" element={<Health />} />
                  <Route path="/faucet" element={<Faucet />} />
                  <Route path="/claim/*" element={<Claim />} />
                  <Route path="/airdrop/social-verify" element={<SocialVerify />} />
                  <Route path="/airdrop/preview/*" element={<AirdropPreview />} />
                  <Route path="/social-verified" element={<SocialVerified />} />
                  <Route path="/authereum-verified" element={<AuthereumVerified />} />
                  <Route path="/airdrop/authereum" element={<AuthereumVerify />} />
                  <Route path="/tx" element={<TransactionPage />} />
                  <Route path="/tx/:hash" element={<TransactionPage />} />
                  <Route path="/components" element={<Components />} />
                  <Route path="/stake" element={<Navigate to="/pool/stake" />} />
                </Routes>
              </Suspense>
            </Div>
          </Div>
        }
      />
    </Routes>
  )
}

export default AppRoutes
