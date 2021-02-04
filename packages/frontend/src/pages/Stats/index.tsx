import React from 'react'
import Stats from './Stats'
import StatsContext from './StatsContext'

const fc = () => (
  <StatsContext>
    <Stats />
  </StatsContext>
)
export default fc
