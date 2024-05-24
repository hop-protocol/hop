import Box from '@mui/material/Box'
import React, { FC, Suspense, lazy, useEffect } from 'react'
import Send from '#pages/Send/index.js'
import { AirdropPreview } from '#pages/Airdrop/AirdropPreview/index.js'
import { Claim } from '#pages/Claim/index.js'
import { Loading } from '#components/Loading/index.js'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

const PoolsOverview = lazy(() => import(/* webpackChunkName: "Pools" */ '#pages/Pools/PoolsOverview/index.js'))
const PoolDetails = lazy(() => import(/* webpackChunkName: "Pools" */ '#pages/Pools/index.js'))
const Convert = lazy(() => import(/* webpackChunkName: "Convert" */ '#pages/Convert/index.js'))
const Stats = lazy(() => import(/* webpackChunkName: "Stats" */ '#pages/Stats/index.js'))
const Withdraw = lazy(() => import(/* webpackChunkName: "Withdraw" */ '#pages/Withdraw/index.js'))
const Relay = lazy(() => import(/* webpackChunkName: "Relay" */ '#pages/Relay/index.js'))
const Faucet = lazy(() => import(/* webpackChunkName: "Faucet" */ '#pages/Faucet/index.js'))
const Health = lazy(() => import(/* webpackChunkName: "Health" */ '#pages/Health/index.js'))
const Rewards = lazy(() => import(/* webpackChunkName: "Rewards" */ '#pages/Rewards/index.js'))

const SocialVerified = lazy(
  () => import(/* webpackChunkName: "SocialVerified" */ '#pages/Airdrop/SocialVerified/index.js')
)
const SocialVerify = lazy(
  () => import(/* webpackChunkName: "SocialVerify" */ '#pages/Airdrop/SocialVerify/index.js')
)
const AuthereumVerify = lazy(
  () => import(/* webpackChunkName: "AuthereumVerify" */ '#pages/Airdrop/AuthereumVerify/index.js')
)
const AuthereumVerified = lazy(
  () => import(/* webpackChunkName: "AuthereumVerified" */ '#pages/Airdrop/AuthereumVerified/index.js')
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
          <Box display="flex" flexGrow={1}>
            <Box p="2.2rem" flexGrow={1}>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/stats" element={<Stats />} />
                  <Route path="/send" element={<Send />} />
                  <Route path="/convert" element={<Convert />} />
                  <Route path="/convert/:via" element={<Convert />} />
                  <Route path="/pools" element={<PoolsOverview />} />
                  <Route path="/pool" element={<Navigate to="/pool/deposit" />} />
                  <Route path="/pool/:tab/*" element={<PoolDetails />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/withdraw" element={<Withdraw />} />
                  <Route path="/relay" element={<Relay />} />
                  <Route path="/health" element={<Health />} />
                  <Route path="/faucet" element={<Faucet />} />
                  <Route path="/claim/*" element={<Claim />} />
                  <Route path="/airdrop/social-verify" element={<SocialVerify />} />
                  <Route path="/airdrop/preview/*" element={<AirdropPreview />} />
                  <Route path="/social-verified" element={<SocialVerified />} />
                  <Route path="/authereum-verified" element={<AuthereumVerified />} />
                  <Route path="/airdrop/authereum" element={<AuthereumVerify />} />
                  <Route path="/stake" element={<Navigate to="/pool/stake" />} />
                </Routes>
              </Suspense>
            </Box>
          </Box>
        }
      />
    </Routes>
  )
}

export default AppRoutes
