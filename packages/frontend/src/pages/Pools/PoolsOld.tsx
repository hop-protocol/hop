import React from 'react'
import Pools from './Pools'
import PoolsProvider from './PoolsContext'

const fc = () => (
  <PoolsProvider>
    <Pools />
  </PoolsProvider>
)
export default fc
