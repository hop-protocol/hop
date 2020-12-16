import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from 'src/components/buttons/Button'
import { useApp } from 'src/contexts/AppContext'
import Transaction from 'src/models/Transaction'

const useStyles = makeStyles(() => ({
  root: {
    marginRight: '1rem'
  },
  button: {},
  pendingButton: {
    backgroundColor: '#bfedff'
  },
  spinner: {
    marginLeft: '1rem'
  }
}))

const TxPill = () => {
  const app = useApp()
  const { accountDetails } = app
  const transactions = app?.transactions?.transactions
  const styles = useStyles()

  const handleClick = () => {
    accountDetails?.show(true)
  }

  const pendingTxs = transactions?.filter((tx: Transaction) => {
    return tx.pending
  })

  return (
    <div className={styles.root}>
      {pendingTxs?.length ? (
        <Button className={styles.pendingButton} flat onClick={handleClick}>
          {pendingTxs.length} Pending{' '}
          <CircularProgress size={18} className={styles.spinner} />
        </Button>
      ) : transactions?.length ? (
        <Button className={styles.button} flat onClick={handleClick}>
          Recent transactions
        </Button>
      ) : null}
    </div>
  )
}

export default TxPill
