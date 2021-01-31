import React, { FC } from 'react'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from 'src/components/buttons/Button'
import { useWeb3Context } from 'src/contexts/Web3Context'
import HeaderRoutes from 'src/components/Header/HeaderRoutes'
import TxPill from 'src/components/Header/TxPill'
import HopLogoFullColor from 'src/assets/logos/hop-logo-full-color.svg'

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
  hopLogo: {
    marginTop: '-1.0rem',
    width: '19.1rem'
  }
}))

const Header: FC = () => {
  const styles = useStyles()
  const { address, requestWallet } = useWeb3Context()

  return (
    <Box className={styles.root} display="flex" alignItems="center">
      <Box
        display="flex"
        flexDirection="row"
        flex={1}
        justifyContent="flex-start"
      >
        <h1>
          <img className={styles.hopLogo} src={HopLogoFullColor} alt="Hop" />
        </h1>
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
