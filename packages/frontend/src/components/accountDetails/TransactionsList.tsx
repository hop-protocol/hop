import React from 'react'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Transaction from 'src/models/Transaction'
import TxStatus from 'src/components/txStatus'
import Check from '@material-ui/icons/Check'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Div, Flex } from '../ui'
import useTxHistory from 'src/contexts/AppContext/useTxHistory'
import useTransactionStatus from 'src/hooks/useTransactionStatus'

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
  leftColumn: {
    display: 'flex',
    alignItems: 'center',
    width: '60%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  rightColumn: {
    display: 'flex',
    alignItems: 'center',
    width: '40%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
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
  const { destCompleted } = useTransactionStatus(tx, tx.networkName)

  return (
    <Flex justifyBetween mb=".5rem" alignCenter>
      <div className={styles.leftColumn}>
        <Link href={tx.explorerLink} target="_blank" rel="noopener noreferrer">
          <span className={styles.network}>{tx.networkName}:</span> {tx.truncatedHash} ↗
        </Link>
      </div>
      <Flex alignCenter justifyAround>
        <Flex justifyCenter width="50%">
          <TxStatus tx={tx} variant="mini" />
        </Flex>

        <Flex justifyCenter width="50%">
          <Flex column alignCenter fontSize="20px">
            {destCompleted ? (
              <>
                <Check className={styles.completed} />
                <Flex mt={2} fontSize={0}>
                  <Link
                    color="inherit"
                    href={tx.destExplorerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Complete
                  </Link>
                </Flex>
              </>
            ) : (
              <>
                <CircularProgress size={20} thickness={5} />
                <Flex mt={2} fontSize={0}>
                  <Link
                    color="inherit"
                    href={tx.destExplorerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pending
                  </Link>
                </Flex>
              </>
            )}
          </Flex>
        </Flex>
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
          <Div>Source</Div>
          <Div>Destination</Div>
        </Flex>
      </Flex>

      {transactions?.map((tx: Transaction) => {
        return <TransactionRow key={tx.hash} tx={tx} styles={styles} />
      })}
    </>
  )
}

export default TransactionsList
