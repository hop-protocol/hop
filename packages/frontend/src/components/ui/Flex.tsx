import * as React from 'react'
import { composedStyleFns, ComposedStyleProps } from 'src/utils'
import styled from 'styled-components/macro'

interface FlexBaseProps {
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
  fullWidth?: boolean
  $wrap?: boolean
}

export type FlexProps = FlexBaseProps & ComposedStyleProps & CustomFlexProps

const Flex: React.FC<FlexProps> = styled.div<FlexProps>`
  box-sizing: border-box;
  display: flex;
  flex-wrap: ${props => {
    if (props.$wrap) return 'wrap'
    return 'nowrap'
  }};
  justify-content: ${props => {
    if (props.justifyContent) return props.justifyContent
    if (props.justifyCenter) return 'center'
    else if (props.justifyAround) return 'space-around'
    else if (props.justifyBetween) return 'space-between'
    else if (props.justifyEnd) return 'flex-end'
    return 'flex-start'
  }};
  align-items: ${props => {
    if (props.alignItems) return props.alignItems
    else if (props.alignEnd) return 'flex-end'
    if (props.alignCenter) return 'center'
    return 'flex-start'
  }};
  flex-direction: ${props => (props.column ? 'column' : 'row')};

  ${({ bold }) => bold && 'font-weight: bold;'}
  ${({ pointer }) => pointer && 'cursor: pointer;'}
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}

  &:hover {
    ${({ hover }) => {
      if (hover) {
        return `background: #6969691a`
      }
    }};
  }

  transition: all 0.15s ease-out;

  ${composedStyleFns}
`

export default Flex
