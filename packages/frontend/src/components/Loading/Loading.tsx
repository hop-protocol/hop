import React from 'react'
import { useTheme } from '@material-ui/core'
import { squareDimensions } from 'src/utils'
import styled, { keyframes, css } from 'styled-components/macro'
import { background, color } from 'styled-system'
import { Flex } from 'src/components/ui'

export function logStyleProps(props: any) {
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

const reverseRotation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
`

const Center = styled.div<any>`
  ${squareDimensions};
  ${background};
  ${color};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.palette.background.default};
  ${({ imgSrc }) => imgSrc && `background: no-repeat center/100% url(${imgSrc})`};

  animation: ${({ load }) =>
    load
      ? css`
          ${reverseRotation} 0.5s infinite
        `
      : 'none'};
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
  animation: ${({ load }) =>
    load
      ? css`
          ${rotation} 0.5s infinite
        `
      : 'none'};
`

export function Loading({ size = 24, load = true, imgSrc }: any) {
  const theme = useTheme()

  return (
    <Flex justifyCenter alignCenter>
      <LoadingWrapper load={load}>
        <Center size={size - 6} theme={theme} imgSrc={imgSrc} load={load} />
      </LoadingWrapper>
    </Flex>
  )
}

