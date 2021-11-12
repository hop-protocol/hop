import React from 'react'
import Button from 'src/components/buttons/Button'
import Alert from 'src/components/alert/Alert'
import { makeStyles } from '@material-ui/core/styles'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import Typography from '@material-ui/core/Typography'
import { commafy } from 'src/utils'
import Address from 'src/models/Address'
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
  customRecipient: {
    marginTop: '2rem',
  },
  warning: {
    marginTop: '2rem',
  },
  action: {},
  sendButton: {},
}))

interface TokenEntity {
  token: Token
  network: Network
  amount: string
}

interface Props {
  customRecipient?: string
  source: TokenEntity
  dest: Partial<TokenEntity>
  onConfirm: (confirmed: boolean) => void
}

const ConfirmSend = (props: Props) => {
  const { customRecipient, source, dest, onConfirm } = props
  const styles = useStyles()

  const { sending, handleSubmit } = useSendingTransaction({ onConfirm })

  let warning = ''
  if (customRecipient && !dest?.network?.isLayer1) {
    warning =
      'If the recipient is an exchange, then there is possibility of loss funds if the token swap fails.'
  }

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography variant="h5" color="textPrimary">
          Send {commafy(source.amount, 5)} {source.token.symbol} from {source.network.name} to{' '}
          {dest?.network?.name}
        </Typography>
        {!!customRecipient && (
          <>
            <Typography variant="body1" color="textPrimary" className={styles.customRecipient}>
              Recipient: {new Address(customRecipient).truncate()}
            </Typography>
          </>
        )}
        {!!warning && <Alert severity="warning" text={warning} className={styles.warning} />}
      </div>
      <div className={styles.action}>
        <Button
          className={styles.sendButton}
          onClick={handleSubmit}
          loading={sending}
          disabled={sending}
          large
          highlighted
        >
          Send
        </Button>
      </div>
    </div>
  )
}

export default ConfirmSend
