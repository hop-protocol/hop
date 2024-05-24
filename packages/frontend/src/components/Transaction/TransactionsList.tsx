import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React from 'react'
import Transaction from '#models/Transaction.js'
import TransactionRow from '#components/Transaction/TransactionRow.js'
import Typography from '@mui/material/Typography'
import { useApp } from '#contexts/AppContext/index.js'
import { useTxStatusStyles } from '#components/Transaction/useTxStatusStyles.js'

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
