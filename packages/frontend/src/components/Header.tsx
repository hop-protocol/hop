import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(() => ({
  root: {
    height: '10.0rem',
    padding: '0 4.2rem'
  }
}))

const Header: FC = () => {
  const styles = useStyles()

  return (
    <Box className={styles.root} display="flex" alignItems="center">
      <Box display="flex" flexDirection="row" flex={1} justifyContent="flex-start">
        <Typography variant="h5" color="textSecondary">
          Placeholder
        </Typography>
      </Box>
      <Box display="flex" flexDirection="row" flex={1} justifyContent="center">
        <Typography variant="h6" color="textSecondary">
          Send Pool Stake
        </Typography>
      </Box>
      <Box display="flex" flexDirection="row" flex={1} justifyContent="flex-end">
        <Typography variant="h6" color="textSecondary">
          Connect Wallet
        </Typography>
      </Box>
    </Box>
  )
}

export default Header