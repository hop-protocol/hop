import { styled } from '@mui/material/styles'
import TextareaAutosize, { TextareaAutosizeProps } from '@mui/material/TextareaAutosize'

export const CustomTextArea = styled(TextareaAutosize)<TextareaAutosizeProps>(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '0.5rem',
  border: `1px solid ${theme.palette.divider}`,
  padding: '0.75rem 1rem',
  fontFamily: theme.typography.fontFamily,
  fontSize: '1rem',
  color: theme.palette.text.primary,
  resize: 'vertical',
  minHeight: '100px',
  width: '100%',
  transition: theme.transitions.create(['border-color', 'box-shadow']),
  
  '&:hover': {
    borderColor: `${theme.palette.primary.main}80`,
  },
  
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
    borderWidth: '2px',
    boxShadow: `0 0 0 1px ${theme.palette.primary.main}30`,
  },
}))
