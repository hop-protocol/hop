import { styled } from '@mui/material/styles'
import Select, { SelectProps } from '@mui/material/Select'

export const CustomSelect = styled(Select)<SelectProps>(({ theme }) => ({
    '-webkit-font-smoothing': 'antialiased',
    font: 'inherit',
    width: 'auto',
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
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.palette.mode === 'dark' 
      ? '0px 3px 8px rgba(0, 0, 0, 0.3)' 
      : '-6px 6px 12px #D8D5DC',
    fontWeight: '700',
    lineHeight: '1',
    borderRadius: '0.5rem',
    paddingRight: '2.8rem',
    alignItems: 'center',
    border: `1px solid ${theme.palette.divider}`,
    '& .MuiSelect-select': {
      padding: '10px 14px',
    },
    '&:hover': {
      borderColor: `${theme.palette.primary.main}80`,
      boxShadow: `0 0 0 1px ${theme.palette.primary.main}30`,
    },
    '&.Mui-focused': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 1px ${theme.palette.primary.main}30`,
    },
    '> div': {
      display: 'flex',
      alignItems: 'center',
    },
    '> fieldset': {
      borderColor: 'transparent',
    },
    '&:hover > fieldset': {
      borderColor: 'transparent !important',
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.mode === 'dark' 
        ? theme.palette.primary.light 
        : theme.palette.primary.main,
    }
}))
