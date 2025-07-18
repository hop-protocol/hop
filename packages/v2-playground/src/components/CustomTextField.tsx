import { styled } from '@mui/material/styles'
import TextField, { TextFieldProps } from '@mui/material/TextField'

export const CustomTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: '0.5rem',
  '> div > fieldset': {
    borderRadius: '0.5rem',
    borderColor: theme.palette.divider,
    borderWidth: '1px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
  },
  '&:hover > div > fieldset': {
    borderColor: `${theme.palette.primary.main}80 !important`,
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderWidth: '2px',
    boxShadow: `0 0 0 1px ${theme.palette.primary.main}30`,
  },
  '& .MuiOutlinedInput-input': {
    padding: '0.75rem 1rem',
  },
  '& .MuiInputLabel-outlined': {
    transform: 'translate(1rem, 0.75rem) scale(1)',
  },
  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
    transform: 'translate(1rem, -0.5rem) scale(0.75)',
  },
}))
