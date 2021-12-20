import { makeStyles } from '@material-ui/core/styles'

export const useSendStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    justifyContent: 'center',
    width: '46.0rem',
    position: 'relative',
    transition: 'all 0.15s ease-out',
  },
  sendSelect: {
    marginBottom: '4.2rem',
  },
  sendLabel: {
    marginRight: '1.8rem',
  },
  downArrow: {
    margin: '0.8rem',
    height: '2.4rem',
    width: '2.4rem',
  },
  switchDirectionButton: {
    padding: 0,
    minWidth: 0,
    margin: '1.0rem',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '12rem',
    width: '46.0rem',
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  detailRow: {},
  detailLabel: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  txStatusInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txStatusCloseButton: {
    marginTop: '1rem',
  },
  semiBold: {
    fontWeight: 600,
  },
  extraBold: {
    fontWeight: 800,
  },
  destinationTxFeeAndAmount: {
    marginTop: '2.4rem',
  },
  detailsDropdown: {
    width: '51.6rem',
    marginTop: '2rem',
    '&[open] summary span::before': {
      content: '"▾"',
    },
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  detailsDropdownSummary: {
    listStyle: 'none',
    display: 'block',
    textAlign: 'right',
    fontWeight: 'normal',
    paddingRight: '4rem',
    '&::marker': {
      display: 'none',
    },
  },
  detailsDropdownLabel: {
    position: 'relative',
    cursor: 'pointer',
    '& > span': {
      position: 'relative',
      display: 'inline-flex',
      justifyItems: 'center',
      alignItems: 'center',
    },
    '& > span::before': {
      display: 'block',
      content: '"▸"',
      position: 'absolute',
      top: '0',
      right: '-1.5rem',
    },
  },
  customRecipient: {
    width: '51.6rem',
    marginTop: '1rem',
    boxSizing: 'border-box',
    borderRadius: '3rem',
    boxShadow: theme.boxShadow.inner,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  customRecipientLabel: {
    textAlign: 'right',
    marginBottom: '1.5rem',
  },
  buttons: {
    marginTop: theme.padding.light,
  },
  button: {
    margin: `0 ${theme.padding.light}`,
    minWidth: '17.5rem',
  },
}))
