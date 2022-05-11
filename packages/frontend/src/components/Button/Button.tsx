import React from 'react'
import { composedStyleFns, ComposedStyleProps } from 'src/utils'
import styled from 'styled-components/macro'
import { StyledButton } from '../buttons/StyledButton'

export function Button(props) {
  return <StyledButton {...props} />
}
