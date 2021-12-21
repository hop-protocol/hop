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
  margin,
  FlexboxProps,
  SpaceProps,
  ColorProps,
  LayoutProps,
  TypographyProps,
  BorderProps,
  BackgroundProps,
  ShadowProps,
  PositionProps,
  MarginProps,
} from 'styled-system'

interface FlexBaseProps {
  wrap?: boolean | string
  column?: boolean
  justifyCenter?: boolean
  justifyEnd?: boolean
  justifyBetween?: boolean
  justifyAround?: boolean
  alignCenter?: boolean
  alignEnd?: boolean
  alignStart?: boolean
}

interface CustomFlexProps {
  children?: any
  onClick?: (e: any) => void
  onMouseLeave?: (e: any) => void
  ref?: any
  disabled?: boolean
  pointer?: boolean
  id?: string
  style?: any
  bold?: boolean
  hover?: boolean
}

export type FlexProps = BackgroundProps &
  BorderProps &
  ColorProps &
  FlexboxProps &
  LayoutProps &
  PositionProps &
  ShadowProps &
  TypographyProps &
  SpaceProps &
  FlexBaseProps &
  MarginProps &
  CustomFlexProps

const Flex: React.FC<FlexProps> = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: ${(props: any) => {
    if (props.wrapReverse) return 'wrap-reverse'
    else if (props.wrap) return 'wrap'
    return 'nowrap'
  }};
  justify-content: ${(props: any) => {
    if (props.justifyContent) return props.justifyContent
    if (props.justifyCenter) return 'center'
    else if (props.justifyAround) return 'space-around'
    else if (props.justifyBetween) return 'space-between'
    else if (props.justifyEnd) return 'flex-end'
    return 'flex-start'
  }};
  align-items: ${(props: any) => {
    if (props.alignItems) return props.alignItems
    else if (props.alignStretch) return 'stretch'
    else if (props.alignEnd) return 'flex-end'
    if (props.alignCenter) return 'center'
    else if (props.alignBaseline) return 'baseline'
    return 'flex-start'
  }};
  flex-direction: ${(props: any) => (props.column ? 'column' : 'row')};

  ${({ bold }: any) => bold && 'font-weight: bold;'}
  ${({ pointer }: any) => pointer && 'cursor: pointer;'}

  &:hover {
    ${({ hover }: any) => {
      if (hover) {
        return `background: #6969691a`
      }
    }};
  }

  ${space};
  ${color};
  ${layout};
  ${typography};
  ${border};
  ${background};
  ${shadow};
  ${position};
  ${flexbox};
  ${margin};
`

export default Flex
