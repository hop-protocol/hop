import React from 'react'
import Button from 'src/components/buttons/Button'
import { makeStyles } from '@material-ui/core/styles'
import Token from 'src/models/Token'
import Typography from '@material-ui/core/Typography'
import { commafy } from 'src/utils'
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

interface TokenEntity {
  token: Token
  amount: string
}

interface Props {
  source: TokenEntity
  dest: TokenEntity
  onConfirm: (confirmed: boolean) => void
}

const ConfirmConvert = (props: Props) => {
  const { source, dest, onConfirm } = props
  const styles = useStyles()

  const { sending, handleSubmit } = useSendingTransaction({ onConfirm })

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography variant="h5" color="textPrimary">
          Convert {commafy(source.amount, 5)} {source.token.symbol} for {commafy(dest.amount, 5)}{' '}
          {dest.token.symbol}
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
          Convert
        </Button>
      </div>
    </div>
  )
}

export default ConfirmConvert
