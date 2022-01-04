import React from 'react'
import styled from 'styled-components/macro'
import {
  background,
  BackgroundProps,
  border,
  BorderProps,
  color,
  ColorProps,
  layout,
  LayoutProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system'
import Button from './Button'

interface StyleProps {
  highlighted?: boolean
  large?: boolean
  flat?: boolean
  size?: number | string
  borderRadius?: any
  children?: any
  onClick?: any
  loading?: boolean
  disabled?: boolean
  secondary?: boolean
}

type StylishProps = SpaceProps &
  ShadowProps &
  BorderProps &
  StyleProps &
  TypographyProps &
  ColorProps &
  BackgroundProps &
  LayoutProps

export const StyledButton = styled(Button)<StylishProps>`
  text-transform: 'none';
  transition: 'all 0.15s ease-out';
  ${({ large }: any) => {
    if (large) {
      return `
        font-size: 2.2rem;
        padding: 0.8rem 4.2rem;
        height: 5.5rem;
        `
    }
    return `
        font-size: 1.5rem;
        padding: 0.8rem 2.8rem;
        height: 4.0rem;
      `
  }};
  ${({ disabled }: any) => {
    if (disabled) {
      return `
        transition: all 0.15s ease-out;
        color: #FDF7F9;
        background: none;
      `
    }
  }};
  ${({ highlighted, theme }: any) => (highlighted ? `color: white};` : theme.colors.primary.main)};
  ${({ secondary, theme }: any) => secondary && `color: ${theme.colors.secondary.main}`}
  ${typography}
  ${space};
  ${layout};
  ${shadow};
  ${border}
  ${color};
  ${background};
`
