import React from 'react'
import Convert from 'src/pages/Convert/Convert'
import ConvertProvider from 'src/pages/Convert/ConvertContext'

const fc = () => (
  <ConvertProvider>
    <Convert />
  </ConvertProvider>
)
export default fc
