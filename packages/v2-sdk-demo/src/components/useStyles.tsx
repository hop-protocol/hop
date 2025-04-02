import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme: any) => ({
  container: {
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    }
  },
  formContainer: {
    minWidth: '400px',
    maxWidth: '400px',
    [theme.breakpoints.down('md')]: {
      minWidth: '0',
      maxWidth: '100%',
      marginRight: '0'
    }
  },
  syntaxContainer: {
    position: 'relative',
    padding: theme.spacing(2),
    marginTop: theme.spacing(4),
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(0, 0, 0, 0.2)' 
      : 'rgba(245, 247, 250, 0.7)',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: `0 3px 12px ${theme.palette.mode === 'dark' 
      ? 'rgba(0, 0, 0, 0.2)' 
      : 'rgba(0, 0, 0, 0.08)'}`,
    transition: theme.transitions.create(['box-shadow', 'border-color', 'background-color'], {
      duration: theme.transitions.duration.short
    }),
    '&:hover': {
      boxShadow: `0 6px 16px ${theme.palette.mode === 'dark' 
        ? 'rgba(0, 0, 0, 0.3)' 
        : 'rgba(0, 0, 0, 0.12)'}`,
      borderColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.15)' 
        : theme.palette.primary.light
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '4px',
      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius
    },
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(3),
      padding: theme.spacing(1.5)
    }
  }
}))
