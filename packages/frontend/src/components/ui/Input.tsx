import * as React from 'react'
import { composedStyleFns, ComposedStyleProps } from 'src/utils'
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
import { Div } from '.'

interface InputBaseProps {
  children?: any
  ref?: any
  disabled?: boolean
  onChange?: (e) => void
  placeholder?: string
  value?: any
  bold?: boolean
  id?: string
  style?: any
  label?: string
  mono?: boolean
}

type InputProps = InputBaseProps & ComposedStyleProps

const StyledInput: React.FC<InputProps> = styled.input`
  box-sizing: border-box;

  ${({ bold }: any) => bold && 'font-weight: bold;'}
  font-family: 'Nunito';
  ${({ mono }: any) => mono && 'font-family: "Source Code Pro";'}
  font-size: 1em;
  padding: 0.75em;
  width: 100%;
  border: none;

  ${composedStyleFns}
`

function Input(props: InputProps) {
  const { boxShadow, label, ...rest } = props
  if (label) {
    return (
      <Div fullWidth borderRadius="1em" p=" 0.75em" {...rest}>
        <Div fontSize={1} px="0.75em" my={2} {...rest}>
          {label}
        </Div>
        <StyledInput {...rest} />
      </Div>
    )
  }
  return <StyledInput borderRadius="1em" {...props} />
}

export default Input
