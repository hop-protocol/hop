import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Transaction from 'src/models/Transaction'
import { Flex } from 'src/components/ui'
import { useApp } from 'src/contexts/AppContext'
import { useTxStatusStyles } from 'src/components/Transaction/useTxStatusStyles'
import TransactionRow from 'src/components/Transaction/TransactionRow'

function TransactionsList(props: any) {
  const styles = useTxStatusStyles()
  const { txHistory } = useApp()
  const { transactions, clear, removeTransaction } = txHistory

  if (!transactions || transactions.length === 0) {
    return <Typography variant="body1">Your recent transactions will appear here...</Typography>
  }

  return (
    <>
      <Flex justifyBetween alignCenter>
        <Typography variant="h3" className={styles.header}>
          Recent transactions
        </Typography>
        <Button className={styles.clearButton} onClick={clear}>
          (clear all)
        </Button>
      </Flex>
      {transactions?.map((tx: Transaction) => (
        <TransactionRow key={tx.hash} tx={tx} styles={styles} rmTx={removeTransaction} />
      ))}
    </>
  )
}

export default TransactionsList
