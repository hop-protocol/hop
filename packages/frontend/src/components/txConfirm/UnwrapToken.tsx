import React from 'react'
import { Button } from 'src/components/Button'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import { commafy, NetworkTokenEntity } from 'src/utils'
import { useSendingTransaction } from 'src/components/txConfirm/useSendingTransaction'

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
