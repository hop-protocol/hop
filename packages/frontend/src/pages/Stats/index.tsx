import React from 'react'
import Stats from './Stats'
import StatsProvider from './StatsContext'

const fc = () => (
  <StatsProvider>
    <Stats />
  </StatsProvider>
)
export default fc
