import React from 'react'
import TokenWrapper, { Props } from './TokenWrapper'
import TokenWrapperContext from './TokenWrapperContext'

const fc = (props: Props) => (
  <TokenWrapperContext>
    <TokenWrapper {...props} />
  </TokenWrapperContext>
)
export default fc
