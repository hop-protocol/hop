import React from 'react'
import Pools from './Pools'
import PoolsContext from './PoolsContext'

const fc = () => (
  <PoolsContext>
    <Pools />
  </PoolsContext>
)
export default fc
