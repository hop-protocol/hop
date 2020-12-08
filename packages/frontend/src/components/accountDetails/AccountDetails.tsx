import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import Transaction from 'src/models/Transaction'
import { useApp } from 'src/contexts/AppContext'

const useStyles = makeStyles(() => ({
  root: {
    width: '500px',
    minHeight: '500px',
    position: 'fixed',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1
  },
  card: {
    backgroundColor: '#fff'
  },
  box: {}
}))

const TransactionsList = (props: any) => {
  const { transactions } = props
  return (
    <>
      <div>Recent transactions</div>
      {transactions?.map((tx: Transaction) => {
        return (
          <div key={tx.hash}>
            <Link
              href={tx.explorerLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tx.truncatedHash} ↗
            </Link>
          </div>
        )
      })}
    </>
  )
}

const AccountDetails = () => {
  const styles = useStyles()
  const { transactions, accountDetails } = useApp()

  if (!accountDetails?.open) {
    return null
  }

  const handleClose = () => {
    accountDetails.show(false)
  }

  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <Box className={styles.box}>
          {transactions?.length ? (
            <TransactionsList transactions={transactions} />
          ) : (
            <div>Your transactions will appear here...</div>
          )}
          <Grid container justify="flex-end">
            <Button onClick={handleClose}>close</Button>
          </Grid>
        </Box>
      </Card>
    </div>
  )
}

export default AccountDetails
