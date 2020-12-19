import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Check from '@material-ui/icons/Check'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import Transaction from 'src/models/Transaction'
import { useApp } from 'src/contexts/AppContext'
import Modal from 'src/components/modal/Modal'

const useStyles = makeStyles(() => ({
  header: {
    marginBottom: '2rem',
    fontSize: '1.8rem'
  },
  box: {},
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  statusIcon: {},
  network: {
    minWidth: '75px',
    display: 'inline-block',
    textAlign: 'right',
    marginRight: '0.5rem'
  }
}))

const TransactionsList = (props: any) => {
  const { transactions } = props
  const styles = useStyles()

  return (
    <>
      <Typography variant="h3" className={styles.header}>
        Recent transactions
      </Typography>
      {transactions
        .sort((a: any, b: any) => b.timestamp - a.timestamp)
        ?.map((tx: Transaction) => {
          return (
            <div key={tx.hash} className={styles.row}>
              <Link
                href={tx.explorerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.network}>{tx.networkName}:</span>{' '}
                {tx.truncatedHash} ↗
              </Link>
              <div className={styles.statusIcon}>
                {tx.pending ? (
                  <CircularProgress size={12} />
                ) : (
                  <Check color="primary" />
                )}
              </div>
            </div>
          )
        })}
    </>
  )
}

const AccountDetails = () => {
  const styles = useStyles()
  const app = useApp()
  const { accountDetails } = app
  const transactions = app.txHistory?.transactions

  if (!accountDetails?.open) {
    return null
  }

  const handleClose = () => {
    accountDetails.show(false)
  }

  return (
    <Modal onClose={handleClose}>
      <Box className={styles.box}>
        {transactions?.length ? (
          <TransactionsList transactions={transactions} />
        ) : (
          <Typography variant="body1">
            Your transactions will appear here...
          </Typography>
        )}
      </Box>
    </Modal>
  )
}

export default AccountDetails
