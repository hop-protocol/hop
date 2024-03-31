import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  backLink: {
    cursor: 'pointer',
    textDecoration: 'none'
  },
  backLinkIcon: {
    fontSize: '5rem !important',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  balanceLink: {
    cursor: 'pointer',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  imageContainer: {
    position: 'relative'
  },
  tokenImage: {
    width: '54px'
  },
  chainImage: {
    width: '28px',
    position: 'absolute',
    top: '-5px',
    left: '-5px'
  },
  topBox: {
    background: theme.palette.mode === 'dark' ? '#0000003d' : '#fff',
    borderRadius: '2rem',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      marginBottom: '1rem',
      marginLeft: 0,
      width: '90%'
    },
    '@media (min-width:600px) and (max-width:700px)': {
      flexDirection: 'column',
    },
  },
  topBoxes: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
  },
  poolStats: {
    boxShadow: theme.boxShadow.inner,
    borderRadius: '3rem'
  },
  poolStatBoxes: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
  },
  poolDetails: {
    boxShadow: theme.boxShadow.inner,
    borderRadius: '3rem',
    [theme.breakpoints.down('xs')]: {
      padding: 0
    },
  },
  poolDetailsBoxes: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
  },
  poolDetailsBox: {
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      width: '100% !important'
    },
  },
  tabs: {
    marginTop: '0.8rem',
    [theme.breakpoints.down('xs')]: {
      marginTop: 0,
      margin: '0 auto'
    },
  },
  tab: {
    fontSize: '2rem'
  },
  stakingAprChainImage: {
    width: '20px',
  },
  stakingTabsContainer: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
  },
  stakingTabButtonBox: {
    padding: '0.5rem 2.5rem',
    '&[data-selected="true"]': {
      borderRadius: '3rem',
      boxShadow: theme.palette.mode === 'dark' ? '-6px 6px 12px 0px #121212, -5px -5px 14px 0px #00000026 inset, -6px 6px 12px 0px #26262666 inset' : '5px -5px 12px 0px #FFFFFF, -6px 6px 12px 0px #D8D5DC, -5px -5px 14px 0px #FFFFFF26 inset, -6px 6px 12px 0px #E9E5E866 inset',
    }
  },
  stakingTabImage: {
    width: '18px'
  },
  notStakedMessage: {
    background: 'rgba(179, 46, 255, 0.1)',
    borderRadius: '0.5rem',
    maxWidth: '100px',
    cursor: 'pointer',
    '@media (min-width:600px) and (max-width:700px)': {
      marginLeft: '0',
    },
  },
  notStakedMessageColor: {
    color: '#B32EFF'
  },
  bolt: {
    '& path': {
      fill: theme.palette.mode === 'dark' ? '#fff' : '#000'
    }
  }
}))
