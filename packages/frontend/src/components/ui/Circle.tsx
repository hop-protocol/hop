import styled from 'styled-components/macro'
import Box, { BoxProps } from '@material-ui/core/Box'

export const Circle = styled(Box)<BoxProps>`
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 50%;
`
