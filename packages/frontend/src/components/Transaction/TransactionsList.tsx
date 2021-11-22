import React, { useEffect } from 'react'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Transaction from 'src/models/Transaction'
import { Div, Flex } from '../ui'
import useTxHistory from 'src/contexts/AppContext/useTxHistory'
import useTransactionStatus from 'src/hooks/useTransactionStatus'
import TransactionStatus from './TransactionStatus'
import { useTxStatusStyles } from './useTxStatusStyles'
import { isOlderThanOneHour } from 'src/utils'

function TransactionRow({ tx, styles, rmTx }: { tx: Transaction; styles: any; rmTx: any }) {
  const {
    completed,
    destCompleted,
    confirmations,
    networkConfirmations,
    replaced,
  } = useTransactionStatus(tx, tx.networkName)

  useEffect(() => {
    if (replaced) {
      if (isOlderThanOneHour(replaced.timestampMs)) {
        return rmTx(replaced)
      }
    }
  }, [replaced])

  return (
    <Flex justifyBetween mb=".5rem" alignCenter>
      <Flex alignCenter width="50%">
        <Link href={tx.explorerLink} target="_blank" rel="noopener noreferrer">
          <span className={styles.network}>{tx.networkName}:</span> {tx.truncatedHash} ↗
        </Link>
      </Flex>

      <Flex justifyAround alignCenter width="50%">
        <TransactionStatus
          txConfirmed={completed}
          link={tx.explorerLink}
          destNetworkName={tx.destNetworkName}
          styles={styles}
          confirmations={confirmations}
          networkWaitConfirmations={networkConfirmations}
        />

        <TransactionStatus
          srcConfirmed={completed}
          txConfirmed={destCompleted}
          link={tx.destExplorerLink}
          destNetworkName={tx.destNetworkName}
          networkName={tx.networkName}
          destTx
          styles={styles}
        />
      </Flex>
    </Flex>
  )
}

function TransactionsList(props: any) {
  const styles = useTxStatusStyles()
  const { transactions, clear, removeTransaction } = useTxHistory(props.transactions)

  if (!transactions || transactions.length === 0) {
    return <Typography variant="body1">Your transactions will appear here...</Typography>
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

      <Flex justifyEnd alignCenter my={1}>
        <Flex width="50%" justifyAround>
          <Div textAlign="center" width="5em">
            Source
          </Div>
          <Div textAlign="center" width="5em">
            Destination
          </Div>
        </Flex>
      </Flex>

      {transactions?.map((tx: Transaction) => (
        <TransactionRow key={tx.hash} tx={tx} styles={styles} rmTx={removeTransaction} />
      ))}
    </>
  )
}

export default TransactionsList
