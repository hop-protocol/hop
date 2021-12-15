import React from 'react'
import { Circle } from 'react-feather'
import styled from 'styled-components/macro'
import { color, layout, space, SpaceProps, LayoutProps, ColorProps } from 'styled-system'

const StyledIcon = styled.img`
  ${space}
  ${layout}
  ${color}
`

const Icon = ({
  src,
  width,
  alt,
  color,
}: SpaceProps &
  LayoutProps &
  ColorProps & { src?: string; width?: any; alt?: string; color?: string }) => {
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
