import React from 'react'
import { styled } from '@mui/material/styles'
import TextField, { TextFieldProps } from '@mui/material/TextField'

export const CustomTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  background: '#fff',
  borderRadius: '1rem',
  '> div > fieldset': {
    borderRadius: '1rem',
    borderColor: 'transparent',
  },
  '&:hover > div > fieldset': {
    borderColor: 'transparent !important',
  },
}))
