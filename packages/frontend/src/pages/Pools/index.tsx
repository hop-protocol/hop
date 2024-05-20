import PoolDetails from '#pages/Pools/PoolDetails/index.js'
import PoolsProvider from '#pages/Pools/PoolsContext.js'
import React from 'react'

const fc = () => (
  <PoolsProvider>
    <PoolDetails />
  </PoolsProvider>
)
export default fc
