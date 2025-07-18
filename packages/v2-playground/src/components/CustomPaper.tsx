import { styled } from '@mui/material/styles'
import Paper, { PaperProps } from '@mui/material/Paper'

export const CustomPaper = styled(Paper)<PaperProps>(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    padding: theme.spacing(2),
    overflow: 'auto',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    border: `1px solid ${theme.palette.divider}`,
    boxSizing: 'border-box',
    transition: theme.transitions.create(['box-shadow', 'background-color'], {
        duration: theme.transitions.duration.short
    }),
    '&:hover': {
        boxShadow: theme.shadows[2],
    },
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(3),
    },
    '& pre, & code': {
        maxWidth: '100%',
        overflowX: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
    },
    '& img': {
        maxWidth: '100%',
        height: 'auto'
    },
    '& table': {
        width: '100%',
        display: 'block',
        overflowX: 'auto'
    }
}))
