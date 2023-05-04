import { makeStyles } from '@material-ui/core/styles'

export const useSendStyles = makeStyles((theme: any) => ({
  header: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    transition: 'all 0.15s ease-out',
  },
  sendSelect: {
    marginBottom: '42px',
  },
  sendLabel: {
    marginRight: '18px',
  },
  downArrow: {
    margin: '8px',
    height: '24px',
    width: '24px',
  },
  switchDirectionButton: {
    padding: 0,
    minWidth: 0,
    margin: '10px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '12px',
    width: '460px',
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
    marginTop: '10px',
  },
  semiBold: {
    fontWeight: 600,
  },
  extraBold: {
    fontWeight: 700,
  },
  destinationTxFeeAndAmount: {
    margin: '0 12px 0 12px',
    [theme.breakpoints.down('xs')]: {
      margin: '0',
    },
  },
  detailsDropdown: {
    width: '440px',
    marginTop: '20px',
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
    paddingRight: '40px',
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
      right: '-16px',
    },
  },
  customRecipient: {
    width: '440px',
    marginTop: '10px',
    boxSizing: 'border-box',
    borderRadius: '16px',
    // boxShadow: theme.boxShadow.inner,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  customRecipientLabel: {
    textAlign: 'right',
  },
  buttons: {
    marginTop: theme.padding.light,
  },
  button: {
    margin: `0 ${theme.padding.light}`,
    minWidth: '180px',
    transition: 'all 0.15s ease-out, box-shadow 0.15s ease-out',
  },
  smartContractWalletWarning: {
    marginTop: theme.padding.light,
  },
  pausedWarning: {
    marginTop: theme.padding.light,
  },
  tablebg: {
    marginBottom: '42px',
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.grey.A100}`,
    borderRadius: '20px',
    padding: '16px',
  },
}))
