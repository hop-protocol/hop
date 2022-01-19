import React from 'react'
import { Circle } from 'react-feather'
import { composedStyleFns, ComposedStyleProps, SquareDimensions, squareDimensions } from 'src/utils'
import styled from 'styled-components/macro'
import { color, layout, space } from 'styled-system'

interface StyledIconProps {
  src?: string
  width?: any
  alt?: string
  color?: string
}

const StyledIcon = styled.img<ComposedStyleProps & SquareDimensions>`
  ${composedStyleFns}
  ${squareDimensions}
`

const Icon = ({ src, width, alt, color }: ComposedStyleProps & StyledIconProps) => {
  if (!src) return null

  return (
    <StyledIcon src={src} width={width || 24} alt={alt || `${src.slice(4)} icon`} color={color} />
  )
}

Icon.Circle = styled(Circle)<any>`
  ${({ size }) => size || '16px'};
  ${space};
  ${layout};
  ${color};
`

export default Icon
