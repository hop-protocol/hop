import React from 'react'
import { composedStyleFns, ComposedStyleProps, squareDimensions } from 'src/utils'
import styled from 'styled-components/macro'

type SvgImgProps = ComposedStyleProps & { size?: string | number }

const Wrapper = styled.div<SvgImgProps>`
  ${squareDimensions}

  & svg {
    max-height: 24px;
    max-width: 24px;
  }

  & path {
    fill: ${({ color }) => color ?? 'black'};
    stroke: none;
  }

  ${composedStyleFns}
`

export function SvgImg(props: SvgImgProps & { component: any; children?: any; color?: string }) {
  const { component: SvgComponent, ...rest } = props
  return (
    <Wrapper {...rest}>
      <SvgComponent />
    </Wrapper>
  )
}
