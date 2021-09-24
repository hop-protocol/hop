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
  PositionProps
} from 'styled-system'

interface BoxBaseProps {
  children?: any
  onClick?: (e: any) => void
  onMouseLeave?: (e: any) => void
  ref?: any
  disabled?: boolean
}

type BoxProps = SpaceProps &
  ColorProps &
  LayoutProps &
  TypographyProps &
  FlexboxProps &
  BorderProps &
  BackgroundProps &
  ShadowProps &
  PositionProps &
  BoxBaseProps & { cursor?: string; bold?: boolean; id?: string }

interface FlexBaseProps {
  id?: string
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

type FlexProps = BoxProps &
  FlexBaseProps &
  FlexboxProps & { style?: any; bold?: boolean; wrap?: boolean | string }

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

export default Flex
