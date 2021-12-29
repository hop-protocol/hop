import React from 'react'
import styled from 'styled-components/macro'

const Wrapper = styled.div`
  & svg {
    max-height: 24px;
  }
  & path {
    fill: ${({ color }) => color ?? 'black'};
    stroke: none;
  }
`

export function SvgImg(props) {
  const { component: SvgComponent, color } = props
  return (
    <Wrapper color={color}>
      <SvgComponent />
    </Wrapper>
  )
}
