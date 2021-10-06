import React from 'react'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Transaction from 'src/models/Transaction'
import TxStatus from 'src/components/txStatus'
import Flex from '../ui/Flex'
import useTxHistory from 'src/contexts/AppContext/useTxHistory'
import Check from '@material-ui/icons/Check'
import CircularProgress from '@material-ui/core/CircularProgress'
import Zoom from '@material-ui/core/Zoom'
import { Div } from '../ui'

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
    '& $line': {
      borderColor: '#B32EFF',
    },
  },
}))

function TransactionsList() {
  const styles = useStyles()
  const { clear, transactions } = useTxHistory()
  console.log(`transactions:`, transactions)

  const handleTransactionsClear = () => {
    clear()
  }

  if (transactions.length === 0) {
    return <Typography variant="body1">Your transactions will appear here...</Typography>
  }

  return (
    <>
      <div className={styles.recentsHeader}>
        <Typography variant="h3" className={styles.header}>
          Recent transactions
        </Typography>
        <Button className={styles.clearButton} onClick={handleTransactionsClear}>
          (clear all)
        </Button>
      </div>

      {transactions?.map((tx: Transaction) => {
        return (
          <div key={tx.hash} className={styles.row}>
            <div className={styles.leftColumn}>
              <Link href={tx.explorerLink} target="_blank" rel="noopener noreferrer">
                <span className={styles.network}>{tx.networkName}:</span> {tx.truncatedHash} ↗
              </Link>
            </div>
            <Flex alignCenter>
              <TxStatus tx={tx} variant="mini" />

              {tx.pendingDestinationConfirmation ? (
                <>
                  <CircularProgress size={24} thickness={5} />
                </>
              ) : (
                <Div>
                  <Check className={styles.completed} />
                  <Div>Completed</Div>
                </Div>
              )}
            </Flex>
          </div>
        )
      })}
    </>
  )
}

export default TransactionsList
