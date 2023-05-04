import React from 'react'
import { composedStyleFns, ComposedStyleProps } from 'src/utils'
import styled from 'styled-components/macro'
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
  fullWidth?: boolean
}

type StylishButtonProps = ComposedStyleProps & StyleProps

export const StyledButton = styled(Button)<StylishButtonProps>`
  text-transform: 'none';
  transition: 'all 0.15s ease-out';
  white-space: nowrap;

  ${({ large }: any) => {
    if (large) {
      return `
        font-size: 20px;
        padding: 8px 42px;
        height: 55px;
        `
    }
    return `
        font-size: 16px;
        padding: 8px 28px;
        height: 40px;
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
  ${({ fullWidth, theme }: any) => fullWidth && `width: 100%`}

  ${composedStyleFns};
`
