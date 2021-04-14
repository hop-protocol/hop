import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(() => ({
  selfDelegateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  textContainer: {
    marginTop: '1rem',
    marginBottom: '1rem'
  }
}))

type DelegateModalTransactionProps = {
  numVotes: string
}

const DelegateModalTransaction: FC<DelegateModalTransactionProps> = props => {
  const { numVotes } = props
  const styles = useStyles()

  return (
    <Box className={styles.selfDelegateContainer}>
      <CircularProgress />
      <Typography variant="h6" className={styles.textContainer}>
        Unlocking votes
      </Typography>
      <Typography variant="h6" className={styles.textContainer}>
        {numVotes}
      </Typography>
      <Typography variant="body1" className={styles.textContainer}>
        Confirm this transaction in your wallet
      </Typography>
    </Box>
  )
}

export default DelegateModalTransaction
