import React from 'react'
import TokenWrapper, { Props } from '#components/TokenWrapper/TokenWrapper.js'
import TokenWrapperContext from '#components/TokenWrapper/TokenWrapperContext.js'

const fc = (props: Props) => (
  <TokenWrapperContext>
    <TokenWrapper {...props} />
  </TokenWrapperContext>
)
export default fc
