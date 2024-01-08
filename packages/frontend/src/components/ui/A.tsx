import React from 'react'
import styled from 'styled-components/macro'
import {
  BackgroundProps,
  BorderProps,
  ColorProps,
  FlexboxProps,
  LayoutProps,
  PositionProps,
  ShadowProps,
  SpaceProps,
  TypographyProps,
  background,
  border,
  color,
  flexbox,
  layout,
  position,
  shadow,
  space,
  typography,
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

export const A: React.FC<AProps> = styled.a`
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
