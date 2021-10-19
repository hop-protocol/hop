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
  DivBaseProps & { cursor?: string; bold?: boolean; id?: string; style?: any }

const Div: React.FC<DivProps> = styled.div`
  box-sizing: border-box;

  ${({ bold }: any) => bold && 'font-weight: bold;'}
  ${({ cursor }: any) => cursor && 'cursor: pointer;'}

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
