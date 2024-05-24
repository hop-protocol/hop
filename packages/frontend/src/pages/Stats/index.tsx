import React from 'react'
import Stats from '#pages/Stats/Stats.js'
import StatsProvider from '#pages/Stats/StatsContext.js'

const fc = () => (
  <StatsProvider>
    <Stats />
  </StatsProvider>
)
export default fc
