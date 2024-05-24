import Convert from '#pages/Convert/Convert.js'
import ConvertProvider from '#pages/Convert/ConvertContext.js'
import React from 'react'

const fc = () => (
  <ConvertProvider>
    <Convert />
  </ConvertProvider>
)
export default fc
