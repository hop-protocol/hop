import styled from 'styled-components/macro'
import { typography } from 'styled-system'
import { Div } from '.'

export const Text = styled<any>(Div)`
  text-align: center;
  ${({ mono }: any) => mono && 'font-family: Source Code Pro;'}
  ${typography};
  color: ${({ theme, secondary }) => secondary && theme.colors.text.secondary};

  transition: all 0.15s ease-out;
`
