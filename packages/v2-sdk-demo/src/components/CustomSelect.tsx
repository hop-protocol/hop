import React from 'react'
import { styled } from '@mui/material/styles'
import Select, { SelectProps } from '@mui/material/Select'

export const CustomSelect = styled(Select)<SelectProps>(({ theme }) => ({
    '--w3o-background-color': '#fdf7f9',
    '--w3o-foreground-color': '#ffffff',
    '--w3o-text-color': '#4a4a4a',
    '--w3o-border-color': 'transparent',
    '--w3o-border-radius': '2px',
    '-webkit-font-smoothing': 'antialiased',
    font: 'inherit',
    width: 'auto',
    border: '0',
    margin: '0',
    display: 'flex',
    boxSizing: 'content-box',
    animationName: 'mui-auto-fill-cancel',
    letterSpacing: 'inherit',
    animationDuration: '10ms',
    '-webkit-tap-highlight-color': 'transparent',
    transition: 'all 0.15s ease-out',
    cursor: 'pointer',
    userSelect: 'none',
    '-webkit-appearance': 'none',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    padding: '0px 2.8rem 0px 0px',
    fontSize: '1rem',
    minWidth: '0',
    minHeight: '0',
    // background: 'linear-gradient(101.98deg, rgb(179, 46, 255) -23.47%, rgb(225, 133, 179) 125.55%)',
    // color: 'rgb(255, 255, 255)',
    backgroundColor: '#FDF7F9',
    boxShadow: '-6px 6px 12px #D8D5DC',
    fontWeight: '700',
    lineHeight: '1',
    borderRadius: '2.3rem',
    paddingRight: '2.8rem',
    alignItems: 'center',
    '> div': {
      display: 'flex',
      alignItems: 'center',
    },
    '> fieldset': {
      borderColor: 'transparent',
    },
    '&:hover > fieldset': {
      borderColor: 'transparent !important',
    }
}))
