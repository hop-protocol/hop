import React from 'react'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components/macro'
import { ComposedStyleProps, composedStyleFns } from 'src/utils'
import { Div } from 'src/components/ui/Div'

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

export function Input(props: InputProps) {
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
