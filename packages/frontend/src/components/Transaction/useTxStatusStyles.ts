import { Theme, makeStyles } from '@material-ui/core/styles'

export const useTxStatusStyles = makeStyles((theme: Theme) => ({
  header: {
    fontSize: '18px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  network: {
    display: 'inline-block',
    marginRight: '6px',
  },
  clearButton: {
    fontSize: '12px',
    borderRadius: '12px',
    boxShadow: 'none',
  },
  recentsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  completed: {
    color: '#089E71',
    zIndex: 1,
    height: 22,
    fontSize: '4em',
    '& $line': {
      borderColor: '#089E71',
    },
  },
  txStatusInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txStatusCloseButton: {
    marginTop: '10px',
  },
  topLabel: {
    opacity: '0.5',
  },
  methodName: {
    opacity: '0.5',
  },
}))
