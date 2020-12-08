import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from 'src/components/buttons/Button'
import { useApp } from 'src/contexts/AppContext'

const useStyles = makeStyles(() => ({
  root: {
    marginRight: '1rem'
  },
  button: {
    backgroundColor: '#bfedff'
  }
}))

const TxPill = () => {
  const { transactions, accountDetails } = useApp()
  const styles = useStyles()

  const handleClick = () => {
    accountDetails?.show(true)
  }

  return (
    <div className={styles.root}>
      {transactions?.length ? (
        <Button className={styles.button} flat onClick={handleClick}>
          {transactions.length} Pending
        </Button>
      ) : null}
    </div>
  )
}

export default TxPill
