import { Theme, makeStyles } from '@material-ui/core/styles'

export const useTxStatusStyles = makeStyles((theme: Theme) => ({
  header: {
    fontSize: '1.8rem',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  network: {
    display: 'inline-block',
    marginRight: '0.5rem',
  },
  clearButton: {
    fontSize: '1.2rem',
  },
  recentsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  completed: {
    color: '#B32EFF',
    zIndex: 1,
    height: 22,
    fontSize: '4em',
    '& $line': {
      borderColor: '#B32EFF',
    },
  },
  txStatusInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txStatusCloseButton: {
    marginTop: '1rem',
  },
}))
