import * as React from 'react'
import styled from 'styled-components/macro'
import { color, layout, space } from 'styled-system'

const StyledIcon = styled.img`
  ${space}
  ${layout}
  ${color}
`

const Icon = ({ src, width, alt }: { src: string; width?: number; alt?: string }) => {
  return <StyledIcon src={src} width={width || 24} alt={alt || `${src.slice(4)} icon`} />
}

export default Icon
