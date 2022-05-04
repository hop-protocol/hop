import * as React from 'react'
import { composedStyleFns, ComposedStyleProps } from 'src/utils'
import Typography from '@material-ui/core/Typography'
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
  border-radius: 1em;

  ${composedStyleFns}
`

function Input(props: InputProps) {
  const { boxShadow, label, ...rest } = props
  if (label) {
    return (
      <Div fullWidth borderRadius="1em" p=" 0.75em" {...rest}>
        <Div px="0.75em" my={2} {...rest}>
          <Typography variant="body1" component="div">
            {label}
          </Typography>
        </Div>
        <StyledInput {...rest} />
      </Div>
    )
  }
  return <StyledInput {...props} />
}

export default Input
