import React from 'react'
import Status from './Status'
import StatusContext from './StatusContext'

const fc = () => (
  <StatusContext>
    <Status />
  </StatusContext>
)
export default fc
