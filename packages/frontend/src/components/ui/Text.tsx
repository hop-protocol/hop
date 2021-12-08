import styled from 'styled-components/macro'
import { Div } from '.'

export const Text = styled<any>(Div)`
  text-align: center;
  ${({ mono }: any) => mono && 'font-family: monospace;'}
`
