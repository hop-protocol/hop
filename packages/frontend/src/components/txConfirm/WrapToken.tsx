import React from 'react'
import Button from 'src/components/buttons/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { commafy, NetworkTokenEntity } from 'src/utils'
import { useSendingTransaction } from './useSendingTransaction'

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

const WrapToken = (props: Props) => {
  const { token, onConfirm } = props
  const styles = useStyles()

  const { sending, handleSubmit } = useSendingTransaction({ onConfirm, token })

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography variant="h5" color="textPrimary">
          Wrap Token
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
          Wrap
        </Button>
      </div>
    </div>
  )
}

export default WrapToken
