import React from 'react'
import { Flex } from '../ui'

export function ButtonsWrapper(props) {
  const { children } = props

  return (
    <Flex my="1rem" justifyAround alignCenter $wrap maxWidth={['450px']} width="100%">
      {children}
    </Flex>
  )
}
