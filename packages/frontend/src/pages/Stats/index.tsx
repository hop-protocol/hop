import React from 'react'
import Stats from 'src/pages/Stats/Stats'
import StatsProvider from 'src/pages/Stats/StatsContext'

const fc = () => (
  <StatsProvider>
    <Stats />
  </StatsProvider>
)
export default fc
