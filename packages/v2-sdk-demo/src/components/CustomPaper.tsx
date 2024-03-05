import React from 'react'
import { styled } from '@mui/material/styles'
import Paper, { PaperProps } from '@mui/material/Paper'

export const CustomPaper = styled(Paper)<PaperProps>(({ theme }) => ({
    backgroundColor: '#fdf7f9',
    foregroundColor: '#ffffff',
    textColor: '#4a4a4a',
    borderColor: 'transparent',
    color: '#0F0524',
    padding: '2.8rem',
    overflow: 'hidden',
    borderRadius: '3.0rem',
    boxShadow: 'inset 4px -4px 3px #FFFFFF, inset 8px -8px 60px -5px #F1E9EC, inset -7px 7px 5px -4px rgba(174, 174, 192, 0.4)',
    boxSizing: 'border-box',
    transition: 'all 0.15s ease-out'
}))
