import React from 'react'
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

interface ABaseProps {
  href?: string
  target?: string
  rel?: string
  children?: any
  onClick?: (e: any) => void
  onMouseLeave?: (e: any) => void
  ref?: any
  disabled?: boolean
  bold?: boolean
  id?: string
  style?: any
}

type AProps = SpaceProps &
  ColorProps &
  LayoutProps &
  TypographyProps &
  FlexboxProps &
  BorderProps &
  BackgroundProps &
  ShadowProps &
  PositionProps &
  ABaseProps

const A: React.FC<AProps> = styled.a`
  ${({ bold }: any) => bold && 'font-weight: bold;'}
  cursor: pointer;
  text-decoration: none;
  color: inherit;

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

export default A
