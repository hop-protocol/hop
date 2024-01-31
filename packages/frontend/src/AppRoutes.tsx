import React, { FC, lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Send from 'src/pages/Send'
import { AirdropPreview } from 'src/pages/Airdrop/AirdropPreview'
import { Claim } from 'src/pages/Claim'
import { Loading } from 'src/components/Loading'

const PoolsOverview = lazy(() => import(/* webpackChunkName: "Pools" */ 'src/pages/Pools/PoolsOverview'))
const PoolDetails = lazy(() => import(/* webpackChunkName: "Pools" */ 'src/pages/Pools'))
const Convert = lazy(() => import(/* webpackChunkName: "Convert" */ 'src/pages/Convert'))
const Stats = lazy(() => import(/* webpackChunkName: "Stats" */ 'src/pages/Stats'))
const Withdraw = lazy(() => import(/* webpackChunkName: "Withdraw" */ 'src/pages/Withdraw'))
const Faucet = lazy(() => import(/* webpackChunkName: "Faucet" */ 'src/pages/Faucet'))
const Health = lazy(() => import(/* webpackChunkName: "Health" */ 'src/pages/Health'))
const Rewards = lazy(() => import(/* webpackChunkName: "Rewards" */ 'src/pages/Rewards'))

const SocialVerified = lazy(
  () => import(/* webpackChunkName: "SocialVerified" */ './pages/Airdrop/SocialVerified')
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
          <Box display="flex" flexGrow={1}>
            <Box p={['2.2rem', '2.5rem']} flexGrow={1}>
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
