import React from 'react'
import { styled } from '@mui/material/styles'
import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton'
// import Button, { ButtonProps } from '@mui/material/Button'

export const HighlightedButton = styled(LoadingButton)<LoadingButtonProps>(({ theme }) => ({
    '--w3o-background-color': '#fdf7f9',
    '--w3o-foreground-color': '#ffffff',
    '--w3o-text-color': '#4a4a4a',
    '--w3o-border-color': 'transparent',
    '--w3o-border-radius': '2px',
    WebkitFontSmoothing: 'antialiased',
    whiteSpace: 'nowrap',
    border: '0',
    cursor: 'pointer',
    display: 'inline-flex',
    outline: '0',
    position: 'relative',
    alignItems: 'center',
    userSelect: 'none',
    verticalAlign: 'middle',
    justifyContent: 'center',
    textDecoration: 'none',
    WebkitAppearance: 'none',
    WebkitTapHighlightColor: 'transparent',
    margin: 'inherit',
    minWidth: '64px',
    boxSizing: 'border-box',
    fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    fontWeight: '700',
    color: 'white',
    padding: '0.8rem 2.8rem',
    fontSize: '1rem',
    background: 'linear-gradient(99.85deg, rgb(179, 46, 255) -18.29%, rgb(242, 164, 152) 109.86%)',
    boxShadow: 'rgb(255, 255, 255) 10px -10px 30px, rgba(216, 213, 220, 0.8) -10px 10px 30px',
    transition: 'background-color 0.15s ease-out 0s, box-shadow 0.15s ease-out 0s',
    borderRadius: '3rem',
    textTransform: 'none',
    letterSpacing: '0',
    lineHeight: '1',
    '&:hover': {
        boxShadow: 'rgb(255, 255, 255) 10px -10px 30px, rgba(216, 213, 220, 0.8) -10px 10px 30px'
    },
    '&:disabled': {
      background: '#FDF7F9',
      color: '#6660777f'
    },
}))
