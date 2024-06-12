import Box from '@mui/material/Box'
import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { background, color } from 'styled-system'
import { squareDimensions } from '#utils/index.js'
import { useTheme } from '@mui/styles'

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

  animation: ${({ load }: any) =>
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
  animation: ${({ load }: any) =>
    load
      ? css`
          ${rotation} 0.5s infinite
        `
      : 'none'};
`

export function Loading({ size = 24, load = true, imgSrc }: { size?: number; load?: boolean; imgSrc?: string }) {
  const theme = useTheme()

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <LoadingWrapper load={load ? `${load}`: false}>
        <Center size={size - 6} theme={theme} imgSrc={imgSrc} load={load ? `${load}` : false} />
      </LoadingWrapper>
    </Box>
  )
}

