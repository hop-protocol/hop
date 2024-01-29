import Box, { BoxProps } from '@material-ui/core/Box'
import styled from 'styled-components/macro'

export const Circle = styled(Box)<BoxProps>`
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 50%;
`
