import React from 'react'
import { styled } from '@mui/material/styles'
import Textarea, { TextareaAutosizeProps } from '@mui/material/TextareaAutosize'

export const CustomTextArea = styled(Textarea)<TextareaAutosizeProps>(({ theme }) => ({
  background: '#fff',
  borderRadius: '1rem',
  fontSize: '1rem',
  padding: '1rem',
  border: '0',
  '&:focus-visible': {
    border: '0',
    outline: '0'
  },
  '&:hover': {
    border: '0',
  }
}))
