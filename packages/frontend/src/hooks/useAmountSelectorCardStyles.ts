import { makeStyles } from '@material-ui/core/styles'

export const useAmountSelectorCardStyles = makeStyles(theme => ({
  root: {
    maxWidth: '440px',
    boxSizing: 'border-box',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    // boxShadow: theme.boxShadow.inner,
    transition: 'all 0.15s ease-out',
  },
  topRow: {
    marginBottom: '12px',
  },
  networkSelectionBox: {
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.15s ease-out',
  },
  networkLabel: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  networkIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
  },
  networkIcon: {
    display: 'flex',
    height: '22px',
    margin: '8px',
  },
  balance: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  maxButton: {
    border: 'none',
    backgroundColor: 'rgba(179, 46, 255, 0.2)',
    color: theme.palette.primary.main,
    borderRadius: '8px',
    padding: '6px 10px',
    fontSize: '12px',
    marginRight: '10px',
    cursor: 'pointer',
    fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  container: {
    flexWrap: 'nowrap',
  },
  networkContainer: {},
  inputContainer: {},
}))
