import React from 'react'
import styled from 'styled-components/macro'
import { Div } from '.'

export const OverflowText = styled(Div)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: 'Source Code Pro';
  transition: all 0.15s ease-out;
`

export interface EthAddressProps {
  width?: string | number
  value: string
  children?: any
  full?: boolean
  length?: number
}

export function EthAddress(props: EthAddressProps) {
  const { width = '100%', value, full, length = 4, children } = props

  const displayedAddress = React.useMemo(() => {
    if (full || !value) return value
    return `${value.slice(0, 2 + length)}...${value.slice(0 - length)}`
  }, [value, full, length])

  return (
    <Div width={width}>
      <OverflowText>{displayedAddress || children}</OverflowText>
    </Div>
  )
}
