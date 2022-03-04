import React from 'react'
import { Div, Flex } from 'src/components/ui'
import { commafy } from 'src/utils'

function SpacedTokenAmount(props) {
  const { amount, symbol } = props
  return (
    <Flex textAlign={'right'}>
      <Div>{commafy(amount)}</Div>
      <Div width={[48, 48, 58]}>{symbol}</Div>
    </Flex>
  )
}

export default SpacedTokenAmount
