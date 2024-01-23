import React from 'react'
import styled from 'styled-components'
import Box from '@mui/material/Box'

export const OverflowText = styled(Box)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: 'Source Code Pro';
`

export interface EthAddressProps {
  width?: string | number
  value?: string
  children?: any
  full?: boolean
  length?: number
  textAlign?: 'left' | 'center' | 'right'
}

export function EthAddress(props: EthAddressProps) {
  const { width = '100%', value = '', full, length = 4, children, textAlign = 'left' } = props

  const displayedAddress = React.useMemo(() => {
    if (full || !value) return value
    return `${value.slice(0, 2 + length)}...${value.slice(0 - length)}`
  }, [value, full, length])

  return (
    <Box width={width} textAlign={textAlign}>
      <OverflowText>{displayedAddress || children}</OverflowText>
    </Box>
  )
}
