import React from 'react'
import Link, { LinkProps } from '@material-ui/core/Link'
import styled from 'styled-components/macro'
import {
  space,
  color,
  layout,
  typography,
  flexbox,
  border,
  background,
  shadow,
  position,
  FlexboxProps,
  SpaceProps,
  ColorProps,
  LayoutProps,
  TypographyProps,
  BorderProps,
  BackgroundProps,
  ShadowProps,
  PositionProps,
} from 'styled-system'

type StyledLinkProps = LinkProps &
  SpaceProps &
  ColorProps &
  LayoutProps &
  TypographyProps &
  FlexboxProps &
  BorderProps &
  BackgroundProps &
  ShadowProps &
  PositionProps

const StylishLink = styled(Link)<StyledLinkProps & { target: string; rel: string }>`
  &:focus {
    opacity: 1;
    color: #968fa8;
  }
  &:hover {
    opacity: 1;
    color: #968fa8;
  }
  ${space}
  ${color};
  ${layout};
  ${typography};
  ${border};
  ${background};
  ${shadow};
  ${position};
  ${flexbox};
`

export function StyledLink(props: any) {
  return <StylishLink target="_blank" rel="noopener noreferrer" {...props} />
}
