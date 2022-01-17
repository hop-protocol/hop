import * as React from 'react'
import { composedStyleFns, ComposedStyleProps } from 'src/utils'
import styled from 'styled-components/macro'

interface DivBaseProps {
  children?: any
  onClick?: (e: any) => void
  onMouseLeave?: (e: any) => void
  ref?: any
  disabled?: boolean
  pointer?: boolean
  bold?: boolean
  id?: string
  style?: any
  fullWidth?: boolean
}

export type DivProps = ComposedStyleProps & DivBaseProps

const Div: React.FC<DivProps> = styled.div<DivProps>`
  box-sizing: border-box;

  ${({ bold }) => bold && 'font-weight: bold;'}
  ${({ pointer }) => pointer && 'cursor: pointer;'}
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}

  transition: background 0.15s ease-out;

  ${composedStyleFns}
`

export default Div
