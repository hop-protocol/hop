import Box from '@mui/material/Box'
import React, { FC, Suspense, lazy, useEffect } from 'react'
// import { SendV2 } from '#pages/Send/SendV2.js'
import { Loading } from '#components/Loading/index.js'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

const Send = lazy(() => import(/* webpackChunkName: "Send" */ '#pages/Send/index.js'))
const PoolsOverview = lazy(() => import(/* webpackChunkName: "Pools" */ '#pages/Pools/PoolsOverview/index.js'))
const PoolDetails = lazy(() => import(/* webpackChunkName: "Pools" */ '#pages/Pools/index.js'))
const Convert = lazy(() => import(/* webpackChunkName: "Convert" */ '#pages/Convert/index.js'))
const Stats = lazy(() => import(/* webpackChunkName: "Stats" */ '#pages/Stats/index.js'))
const Withdraw = lazy(() => import(/* webpackChunkName: "Withdraw" */ '#pages/Withdraw/index.js'))
const Relay = lazy(() => import(/* webpackChunkName: "Relay" */ '#pages/Relay/index.js'))
const CommitTransfers = lazy(() => import(/* webpackChunkName: "CommitTransfers" */ '#pages/CommitTransfers/index.js'))
const Faucet = lazy(() => import(/* webpackChunkName: "Faucet" */ '#pages/Faucet/index.js'))
const Health = lazy(() => import(/* webpackChunkName: "Health" */ '#pages/Health/index.js'))
const Rewards = lazy(() => import(/* webpackChunkName: "Rewards" */ '#pages/Rewards/index.js'))

const AppRoutes: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // root and airdrop paths
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/send')
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
                  {/* <Route path="/sendv2" element={<SendV2 />} /> */}
                  <Route path="/convert" element={<Convert />} />
                  <Route path="/convert/:via" element={<Convert />} />
                  <Route path="/pools" element={<PoolsOverview />} />
                  <Route path="/pool" element={<Navigate to="/pool/deposit" />} />
                  <Route path="/pool/:tab/*" element={<PoolDetails />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/withdraw" element={<Withdraw />} />
                  <Route path="/relay" element={<Relay />} />
                  <Route path="/commit-transfers" element={<CommitTransfers />} />
                  <Route path="/health" element={<Health />} />
                  <Route path="/faucet" element={<Faucet />} />
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
