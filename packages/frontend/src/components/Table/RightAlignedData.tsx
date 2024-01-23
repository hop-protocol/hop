import React from 'react'
import { commafy } from 'src/utils'
import Box from '@mui/material/Box'

export function CellWrapper({ cell, end, style, children }: any) {
  return (
    <Box display="flex" alignItems="center" justifyContent={end ? 'flex-end' : 'center'} {...cell.getCellProps()} style={style}>
      {children}
    </Box>
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
