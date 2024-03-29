import { makeStyles } from '@mui/styles'

export const useAmountSelectorCardStyles = makeStyles((theme: any) => ({
  root: {
    maxWidth: '51.6rem',
    boxSizing: 'border-box',
    boxShadow: `${theme.boxShadow?.inner} !important`,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  topRow: {
    marginBottom: '1.8rem',
  },
  networkSelectionBox: {
    display: 'flex',
    alignItems: 'center',
  },
  networkLabel: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '0.4rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  networkIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '4rem',
    height: '4rem',
  },
  networkIcon: {
    display: 'flex',
    height: '2.2rem',
    margin: '0.7rem',
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
    borderRadius: '1rem',
    padding: '0.5rem 1rem',
    fontSize: '1.2rem',
    marginRight: '1rem',
    cursor: 'pointer',
    fontFamily: 'Nunito',
    fontWeight: 'bold',
  },
  container: {
    flexWrap: 'nowrap',
  },
  networkContainer: {},
  inputContainer: {},
  mobileFlexColumn: {
    '@media (max-width: 420px)': {
      display: 'flex',
      alignItems: 'flex-end !important',
      flexDirection: 'column',
      width: '100% !important',
      marginBottom: '1rem'
    }
  }
}))
