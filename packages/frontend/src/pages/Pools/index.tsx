import PoolDetails from 'src/pages/Pools/PoolDetails'
import PoolsProvider from 'src/pages/Pools/PoolsContext'
import React from 'react'

const fc = () => (
  <PoolsProvider>
    <PoolDetails />
  </PoolsProvider>
)
export default fc
