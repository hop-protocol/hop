import React from 'react'
import styled from 'styled-components/macro'
import { Circle } from 'react-feather'
import { composedStyleFns, ComposedStyleProps, SquareDimensions, squareDimensions } from 'src/utils'
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

const Icon = ({ src, width = [12, 18], alt, color, ...props }: ComposedStyleProps & StyledIconProps & any) => {
  if (!src) return null

  return (
    <StyledIcon
      src={src}
      width={width || 24}
      alt={alt || `${src.slice(4)} icon`}
      color={color}
      {...props}
    />
  )
}

Icon.Circle = styled(Circle)<any>`
  ${({ size }) => size || '16px'};
  ${space};
  ${layout};
  ${color};
`

export default Icon
