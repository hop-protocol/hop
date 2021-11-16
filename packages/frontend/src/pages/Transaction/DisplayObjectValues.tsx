import React from 'react'
import { Div, Flex } from 'src/components/ui'

export function DisplayObjectValues({ params, title }) {
  return (
    <Div my={2}>
      <Div bold my={2}>
        {title}
      </Div>

      {Object.keys(params).map(param => (
        <Flex key={param} justifyBetween mb={2}>
          <Div mr={4}>{param}:</Div>
          <Div>{params[param]}</Div>
        </Flex>
      ))}
    </Div>
  )
}
