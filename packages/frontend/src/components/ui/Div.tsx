import * as React from 'react'
import styled from 'styled-components/macro'
import {
  space,
  color,
  layout,
  typography,
  flexbox,
  border,
  background,
  shadow,
  position,
  FlexboxProps,
  SpaceProps,
  ColorProps,
  LayoutProps,
  TypographyProps,
  BorderProps,
  BackgroundProps,
  ShadowProps,
  PositionProps,
} from 'styled-system'

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

type DivProps = SpaceProps &
  ColorProps &
  LayoutProps &
  TypographyProps &
  FlexboxProps &
  BorderProps &
  BackgroundProps &
  ShadowProps &
  PositionProps &
  DivBaseProps

const Div: React.FC<DivProps> = styled.div<DivProps>`
  box-sizing: border-box;

  ${({ bold }) => bold && 'font-weight: bold;'}
  ${({ pointer }) => pointer && 'cursor: pointer;'}
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}

  transition: background 0.15s ease-out;

  ${space};
  ${color};
  ${layout};
  ${typography};
  ${border};
  ${background};
  ${shadow};
  ${position};
  ${flexbox};
`

export default Div
