import React from 'react'
import PoolDetails from 'src/pages/Pools/PoolDetails'
import PoolsProvider from 'src/pages/Pools/PoolsContext'

const fc = () => (
  <PoolsProvider>
    <PoolDetails />
  </PoolsProvider>
)
export default fc
