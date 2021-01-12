import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from 'src/components/buttons/Button'
import { useWeb3Context } from 'src/contexts/Web3Context'
import HeaderRoutes from 'src/components/Header/HeaderRoutes'
import TxPill from 'src/components/Header/TxPill'

const useStyles = makeStyles(() => ({
  root: {
    height: '10.0rem',
    padding: '0 4.2rem'
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
        <Typography variant="h5" color="textSecondary">
          🐰 Hop
        </Typography>
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
