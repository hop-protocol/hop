import React from 'react'
import { composedStyleFns, ComposedStyleProps } from 'src/utils'
import styled from 'styled-components/macro'
import { StyledButton } from '../buttons/StyledButton'

const Butt = styled.button<ComposedStyleProps>`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
  ${composedStyleFns}
`

export function Button(props) {
  return <StyledButton {...props} />
}
