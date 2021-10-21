import React from 'react'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Transaction from 'src/models/Transaction'
import { Div, Flex } from '../ui'
import useTxHistory from 'src/contexts/AppContext/useTxHistory'
import useTransactionStatus from 'src/hooks/useTransactionStatus'
import TransactionStatus from './TransactionStatus'

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    fontSize: '1.8rem',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  network: {
    display: 'inline-block',
    marginRight: '0.5rem',
  },
  clearButton: {
    fontSize: '1.2rem',
  },
  recentsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  completed: {
    color: '#B32EFF',
    zIndex: 1,
    height: 22,
    fontSize: '4em',
    '& $line': {
      borderColor: '#B32EFF',
    },
  },
}))

function TransactionRow({ tx, styles }: { tx: Transaction; styles: any }) {
  const { completed, destCompleted } = useTransactionStatus(tx, tx.networkName)

  return (
    <Flex justifyBetween mb=".5rem" alignCenter>
      <Flex alignCenter width="50%">
        <Link href={tx.explorerLink} target="_blank" rel="noopener noreferrer">
          <span className={styles.network}>{tx.networkName}:</span> {tx.truncatedHash} ↗
        </Link>
      </Flex>

      <Flex justifyAround alignCenter width="50%">
        <TransactionStatus
          complete={completed}
          link={tx.explorerLink}
          destNetworkName={tx.destNetworkName}
          styles={styles}
        />

        <TransactionStatus
          complete={destCompleted}
          link={tx.destExplorerLink}
          destNetworkName={tx.destNetworkName}
          destTx
          styles={styles}
        />
      </Flex>
    </Flex>
  )
}

function TransactionsList(props: any) {
  const styles = useStyles()
  const { transactions, clear } = useTxHistory(props.transactions)

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

      {transactions?.map((tx: Transaction) => {
        return <TransactionRow key={tx.hash} tx={tx} styles={styles} />
      })}
    </>
  )
}

export default TransactionsList
