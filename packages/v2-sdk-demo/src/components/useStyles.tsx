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
    [theme.breakpoints.down('md')]: {
    }
  }
}))
