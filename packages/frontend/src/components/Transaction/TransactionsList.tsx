import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import React from 'react'
import Transaction from 'src/models/Transaction'
import TransactionRow from 'src/components/Transaction/TransactionRow'
import Typography from '@material-ui/core/Typography'
import { useApp } from 'src/contexts/AppContext'
import { useTxStatusStyles } from 'src/components/Transaction/useTxStatusStyles'

function TransactionsList(props: any) {
  const styles = useTxStatusStyles()
  const { txHistory } = useApp()
  const { transactions, clear, removeTransaction } = txHistory

  if (!transactions || transactions.length === 0) {
    return <Typography variant="body1">Your recent transactions will appear here...</Typography>
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3" className={styles.header}>
          Recent transactions
        </Typography>
        <Button className={styles.clearButton} onClick={clear}>
          (clear all)
        </Button>
      </Box>
      {transactions?.map((tx: Transaction) => (
        <TransactionRow key={tx.hash} tx={tx} styles={styles} rmTx={removeTransaction} />
      ))}
    </>
  )
}

export default TransactionsList
