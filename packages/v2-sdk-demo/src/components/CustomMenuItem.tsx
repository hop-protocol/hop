import { styled } from '@mui/material/styles'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'

export const CustomMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderColor: 'transparent',
    borderRadius: '0',
    WebkitFontSmoothing: 'antialiased',
    listStyle: 'none',
    border: '0',
    cursor: 'pointer',
    margin: '0',
    outline: '0',
    userSelect: 'none',
    verticalAlign: 'middle',
    WebkitAppearance: 'none',
    WebkitTapHighlightColor: 'transparent',
    display: 'flex',
    position: 'relative',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'flex-start',
    textDecoration: 'none',
    paddingLeft: '16px',
    paddingRight: '16px',
    width: 'auto',
    overflow: 'hidden',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'all 0.15s ease-out',
    fontFamily: 'Nunito,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    fontWeight: '700',
    lineHeight: '1.5',
    paddingTop: '6px',
    whiteSpace: 'nowrap',
    paddingBottom: '6px',
    minHeight: 'auto',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.04)'
    },
    '&.Mui-selected': {
        backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(144, 202, 249, 0.16)'
            : 'rgba(25, 118, 210, 0.08)',
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(144, 202, 249, 0.24)'
                : 'rgba(25, 118, 210, 0.12)'
        }
    }
}))
