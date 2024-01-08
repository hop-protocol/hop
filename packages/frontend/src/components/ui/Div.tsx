import React from 'react'
import styled from 'styled-components/macro'
import { ComposedStyleProps, composedStyleFns } from 'src/utils'

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

export const Div: React.FC<DivProps> = styled.div<DivProps>`
  box-sizing: border-box;

  ${({ bold }) => bold && 'font-weight: bold;'}
  ${({ pointer }) => pointer && 'cursor: pointer;'}
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}

  transition: background 0.15s ease-out, color 0.15s ease-out;

  ${composedStyleFns}
`
