import React from 'react'
import TokenWrapper, { Props } from 'src/components/TokenWrapper/TokenWrapper'
import TokenWrapperContext from 'src/components/TokenWrapper/TokenWrapperContext'

const fc = (props: Props) => (
  <TokenWrapperContext>
    <TokenWrapper {...props} />
  </TokenWrapperContext>
)
export default fc
