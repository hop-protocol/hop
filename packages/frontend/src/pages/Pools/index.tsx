import React from 'react'
import { PoolDetails } from './PoolDetails'
import PoolsProvider from './PoolsContext'

const fc = () => (
  <PoolsProvider>
    <PoolDetails />
  </PoolsProvider>
)
export default fc
