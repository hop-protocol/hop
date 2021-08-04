import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from 'src/components/buttons/Button'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import HeaderRoutes from 'src/components/header/HeaderRoutes'
import TxPill from 'src/components/header/TxPill'
import HopLogoFullColor from 'src/assets/logos/hop-logo-full-color.svg'
import { isMainnet } from 'src/config'
import Settings from 'src/pages/Send/Settings'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: '10.0rem',
    padding: '0 4.2rem',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      paddingTop: '2rem',
      marginBottom: '4rem'
    }
  },
  title: {
    position: 'relative'
  },
  hopLogo: {
    marginTop: '-1.0rem',
    width: '19.1rem'
  },
  label: {
    fontSize: '1rem',
    position: 'absolute',
    bottom: '-0.2rem',
    right: '0',
    opacity: '0.2'
  }
}))

const Header: FC = () => {
  const styles = useStyles()
  const { address, requestWallet } = useWeb3Context()
  const { l1Network } = useApp()

  return (
    <Box className={styles.root} display="flex" alignItems="center">
      <Box
        display="flex"
        flexDirection="row"
        flex={1}
        justifyContent="flex-start"
      >
        <Link to="/">
          <h1 className={styles.title}>
            <img className={styles.hopLogo} src={HopLogoFullColor} alt="Hop" />
            {!isMainnet ? (
              <span className={styles.label}>{l1Network?.name}</span>
            ) : null}
          </h1>
        </Link>
      </Box>
      <Box display="flex" flexDirection="row" flex={1} justifyContent="center">
        <HeaderRoutes />
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        flex={1}
        justifyContent="flex-end"
      >
        <Settings />
        {address ? (
          <TxPill />
        ) : (
          <Button highlighted onClick={requestWallet}>
            Connect a Wallet
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default Header
