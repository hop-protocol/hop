import React from 'react'
import { commafy } from 'src/utils'
import { Flex } from 'src/components/ui'

export function CellWrapper({ cell, end, children }: any) {
  return (
    <Flex alignCenter justifyContent={end ? 'flex-end' : 'center'} {...cell.getCellProps()}>
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
