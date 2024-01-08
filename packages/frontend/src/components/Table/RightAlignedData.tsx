import React from 'react'
import { Flex } from 'src/components/ui'
import { commafy } from 'src/utils'

export function CellWrapper({ cell, end, style, children }: any) {
  return (
    <Flex alignCenter justifyContent={end ? 'flex-end' : 'center'} {...cell.getCellProps()} style={style}>
      {children}
    </Flex>
  )
}

export function RightAlignedValue({ cell, children }: any) {
  return (
    <CellWrapper cell={cell} end>
      {commafy(cell.value)}
      {children}
    </CellWrapper>
  )
}
