import React from 'react'
import Pools from './Pools'
import PoolsContext from './PoolsContext'

// TODO: cleaner way to wrap context
const fc = () => (
  <PoolsContext>
    <Pools />
  </PoolsContext>
)
export default fc
