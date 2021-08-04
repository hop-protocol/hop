import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from 'src/components/buttons/Button'
import { useApp } from 'src/contexts/AppContext'
import Transaction from 'src/models/Transaction'
import { useWeb3Context } from 'src/contexts/Web3Context'

const useStyles = makeStyles(theme => ({
  root: {},
  button: {},
  pendingButton: {
    backgroundColor: 'rgba(179, 46, 255, 0.12)'
  },
  spinner: {
    marginLeft: '1rem'
  }
}))

const TxPill = () => {
  const app = useApp()
  const { accountDetails } = app
  const { address } = useWeb3Context()
  const transactions = app?.txHistory?.transactions
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
      ) : (
        <Button flat onClick={handleClick}>
          {address?.truncate()}
        </Button>
      )}
    </div>
  )
}

export default TxPill
