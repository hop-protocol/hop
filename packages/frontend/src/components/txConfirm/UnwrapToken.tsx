import React from 'react'
import Typography from '@mui/material/Typography'
import { Button } from '#components/Button/index.js'
import { NetworkTokenEntity, commafy } from '#utils/index.js'
import { makeStyles } from '@mui/styles'
import { useSendingTransaction } from '#components/txConfirm/useSendingTransaction.js'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
  title: {
    marginBottom: '2rem',
  },
  action: {},
  sendButton: {},
}))

interface Props {
  token: NetworkTokenEntity
  onConfirm: (confirmed: boolean) => void
}

const UnwrapToken = (props: Props) => {
  const { token, onConfirm } = props
  const styles = useStyles()

  const { sending, handleSubmit } = useSendingTransaction({ onConfirm, token })

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography variant="h5" color="textPrimary">
          Unwrap Token
        </Typography>
        <Typography variant="h6" color="textPrimary">
          {commafy(token.amount, 5)} {token.token.symbol}
        </Typography>
      </div>
      <div className={styles.action}>
        <Button
          className={styles.sendButton}
          onClick={handleSubmit}
          loading={sending}
          large
          highlighted
        >
          Unwrap
        </Button>
      </div>
    </div>
  )
}

export default UnwrapToken
