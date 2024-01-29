import React, { useState } from 'react'
import styled from 'styled-components/macro'
import { Circle } from 'react-feather'
import { ComposedStyleProps, SquareDimensions, composedStyleFns, squareDimensions } from 'src/utils'
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

export const Icon = ({ src, width = [12, 18], alt, color, ...props }: ComposedStyleProps & StyledIconProps & any) => {
  const [error, setError] = useState(false)
  if (!src || error) {
    return null
  }

  return (
    <StyledIcon
      src={src}
      width={width || 24}
      alt={alt ?? `${src.slice(4)} icon`}
      color={color}
      onError={() => {
        setError(true)
      }}
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
