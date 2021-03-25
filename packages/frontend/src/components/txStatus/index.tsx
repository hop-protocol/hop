import React from 'react'
import Status, { StatusProps } from './Status'
import StatusContext from './StatusContext'

const fc = (props: StatusProps) => (
  <StatusContext>
    <Status {...props} />
  </StatusContext>
)
export default fc
