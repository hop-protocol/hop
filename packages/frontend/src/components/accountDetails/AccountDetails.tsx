import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import Transaction from 'src/models/Transaction'
import { useApp } from 'src/contexts/AppContext'
import Modal from 'src/components/accountDetails/Modal'

const useStyles = makeStyles(() => ({
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
    <Modal onClose={handleClose}>
      <Box className={styles.box}>
        {transactions?.length ? (
          <TransactionsList transactions={transactions} />
        ) : (
          <div>Your transactions will appear here...</div>
        )}
      </Box>
    </Modal>
  )
}

export default AccountDetails
