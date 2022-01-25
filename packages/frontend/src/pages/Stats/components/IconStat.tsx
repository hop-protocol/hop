import React from 'react'
import { Div, Flex, Icon } from 'src/components/ui'

interface Props {
  src: any
  data: string
  width?: number
}

export function IconStat(props: Props) {
  const { src, data, width = 20 } = props

  return (
    <Flex alignCenter>
      <Icon src={src} width={width} />
      <Div ml={1}>{data}</Div>
    </Flex>
  )
}
