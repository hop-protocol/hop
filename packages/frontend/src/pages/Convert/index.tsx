import Convert from 'src/pages/Convert/Convert'
import ConvertProvider from 'src/pages/Convert/ConvertContext'
import React from 'react'

const fc = () => (
  <ConvertProvider>
    <Convert />
  </ConvertProvider>
)
export default fc
