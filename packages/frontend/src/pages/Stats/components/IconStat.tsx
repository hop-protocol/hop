import React from 'react'
import { Div, Flex, Icon } from 'src/components/ui'

interface Props {
  src: any
  data: string | string[]
  width?: number | number[]
}

export function IconStat(props: Props) {
  const { src, data, width = [12, 18] } = props

  return (
    <Flex alignCenter fullWidth>
      <Icon src={src} width={width} />
      <Div ml={1}>{data}</Div>
    </Flex>
  )
}
