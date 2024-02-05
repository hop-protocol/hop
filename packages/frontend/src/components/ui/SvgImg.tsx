import React from 'react'
import styled from 'styled-components'
import { ComposedStyleProps, SquareDimensions, composedStyleFns, squareDimensions } from 'src/utils'

type SvgImgProps = ComposedStyleProps & SquareDimensions

const Wrapper = styled('div')<any>`
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
      {typeof SvgComponent === 'function' ? <SvgComponent /> : SvgComponent}
    </Wrapper>
  )
}
