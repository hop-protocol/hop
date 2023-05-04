import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  backLink: {
    cursor: 'pointer',
    textDecoration: 'none'
  },
  backLinkIcon: {
    fontSize: '50px',
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
    background: theme.palette.type === 'dark' ? '#0000003d' : '#fff',
    borderRadius: '12px',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      marginBottom: '10px',
      marginLeft: 0,
      width: '90%'
    },
  },
  topBoxes: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
  },
  poolStats: {
    boxShadow: theme.boxShadow.inner,
    transition: 'all 0.15s ease-out',
    borderRadius: '16px'
  },
  poolStatBoxes: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
  },
  poolDetails: {
    boxShadow: theme.boxShadow.inner,
    transition: 'all 0.15s ease-out',
    borderRadius: '16px',
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
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
  },
  tabs: {
    marginTop: '8px',
    [theme.breakpoints.down('xs')]: {
      marginTop: 0,
      margin: '0 auto'
    },
  },
  tab: {
    fontSize: '20px'
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
    padding: '6px 24px',
    '&[data-selected="true"]': {
      borderRadius: '16px',
      boxShadow: theme.palette.type === 'dark' ? '-6px 6px 12px 0px #121212, -5px -5px 14px 0px #00000026 inset, -6px 6px 12px 0px #26262666 inset' : '5px -5px 12px 0px #FFFFFF, -6px 6px 12px 0px #D8D5DC, -5px -5px 14px 0px #FFFFFF26 inset, -6px 6px 12px 0px #E9E5E866 inset',
    }
  },
  stakingTabImage: {
    width: '18px'
  },
  notStakedMessage: {
    background: 'rgba(179, 46, 255, 0.1)',
    borderRadius: '6px',
    maxWidth: '100px',
    cursor: 'pointer'
  },
  notStakedMessageColor: {
    color: '#B32EFF'
  },
  bolt: {
    '& path': {
      fill: theme.palette.type === 'dark' ? '#fff' : '#000'
    }
  }
}))
