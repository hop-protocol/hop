import React from 'react'
import Button from 'src/components/buttons/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { commafy, NetworkTokenEntity } from 'src/utils'
import { useSendingTransaction } from './useSendingTransaction'
import Alert from 'src/components/alert/Alert'
import Address from 'src/models/Address'

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
  action: {},
  sendButton: {},
  warning: {
    marginTop: '2rem',
  },
}))

interface Props {
  source: NetworkTokenEntity
  dest: NetworkTokenEntity
  onConfirm: (confirmed: boolean) => void
  customRecipient?: string
}

const ConfirmConvert = (props: Props) => {
  const { source, dest, onConfirm, customRecipient } = props
  const styles = useStyles()

  const { sending, handleSubmit } = useSendingTransaction({ onConfirm, source })

  let warning = ''
  if (customRecipient && !dest?.network?.isLayer1) {
    warning =
      'If the recipient is an exchange, then there is possibility of loss funds if the token swap fails.'
  }

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography variant="h5" color="textPrimary">
          Convert {commafy(source.amount, 5)} {source.token.symbol} for {commafy(dest.amount, 5)}{' '}
          {dest.token.symbol}
        </Typography>
      </div>
      <div>
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
