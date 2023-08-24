import React from 'react'
import Link, { LinkProps } from '@material-ui/core/Link'
import styled from 'styled-components/macro'
import { composedStyleFns, ComposedStyleProps } from 'src/utils'

type StyledLinkProps = LinkProps & ComposedStyleProps

const StylishLink = styled(Link)<StyledLinkProps & { target: string; rel: string }>`
  &:focus {
    opacity: 1;
    color: #968fa8;
  }
  &:hover {
    opacity: 1;
    color: #968fa8;
  }
  ${composedStyleFns};
`

export function StyledLink(props: StyledLinkProps) {
  return <StylishLink target="_blank" rel="noopener noreferrer" {...props} />
}
