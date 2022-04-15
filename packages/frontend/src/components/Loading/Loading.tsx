import React from 'react'
import { useTheme } from '@material-ui/core'
import { squareDimensions } from 'src/utils'
import styled, { keyframes, css } from 'styled-components/macro'
import { background, color } from 'styled-system'
import { Flex } from '../ui'

export function logStyleProps(props) {
  console.log('style props:', props)
  return props
}

const rotation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const Center = styled.div<any>`
  ${squareDimensions};
  ${background};
  ${color};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.palette.background.default};
`

const LoadingWrapper: any = styled.div<any>`
  box-sizing: border-box;
  ${squareDimensions};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  ${({ load }: any) => {
    if (load) {
      return `
        background-image: linear-gradient(to right, #e336ff, #ffd7b1)
      `
    }
    return `
      background-color: grey;
    `
  }};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  animation: ${({ load }) =>
    load
      ? css`
          ${rotation} 0.5s infinite
        `
      : 'none'};
`

interface LoadingProps {
  size?: number
  load?: boolean
}

function Loading({ size = 24, load = true }: LoadingProps) {
  const theme = useTheme()

  return (
    <Flex justifyCenter alignCenter>
      <LoadingWrapper load={load}>
        <Center size={size - 6} theme={theme} />
      </LoadingWrapper>
    </Flex>
  )
}

export default Loading
