import styled from 'styled-components/macro'
import { ComposedStyleProps, composedStyleFns } from 'src/utils'
import { Div, DivProps } from 'src/components/ui/Div'

interface TextProps {
  primary?: boolean
  secondary?: boolean
  mono?: boolean
  textOverflow?: string
  className?: any
}

export const Text = styled(Div)<DivProps & ComposedStyleProps & TextProps>`
  text-align: center;
  ${({ mono }: any) => mono && 'font-family: Source Code Pro;'}
  color: ${({ theme, secondary, primary }) => {
    if (secondary) return theme.colors.text.secondary
    if (primary) return theme.colors.text.primary
  }};

  transition: all 0.15s ease-out;

  ${composedStyleFns}
`
