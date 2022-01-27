import React from 'react'
import Convert from './Convert'
import ConvertProvider from './ConvertContext'

const fc = () => (
  <ConvertProvider>
    <Convert />
  </ConvertProvider>
)
export default fc
