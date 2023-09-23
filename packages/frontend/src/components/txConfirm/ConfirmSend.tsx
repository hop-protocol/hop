import React from 'react'
import Button from 'src/components/buttons/Button'
import Alert from 'src/components/alert/Alert'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { commafy, NetworkTokenEntity } from 'src/utils'
import Address from 'src/models/Address'
import Box from '@material-ui/core/Box'
import { useSendingTransaction } from './useSendingTransaction'
import { useTransferTimeEstimate } from 'src/hooks/useTransferTimeEstimate'
import pluralize from 'pluralize'

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


interface Props {
  customRecipient?: string
  source: NetworkTokenEntity
  dest: Partial<NetworkTokenEntity>
  onConfirm: (confirmed: boolean) => void
  estimatedReceived: string
  isGnosisSafeWallet?: boolean
}

const ConfirmSend = (props: Props) => {
  const { customRecipient, source, dest, onConfirm, estimatedReceived, isGnosisSafeWallet = false } = props
  const styles = useStyles()

  const { sending, handleSubmit } = useSendingTransaction({
    onConfirm,
    source,
  })

  const { fixedTimeEstimate, medianTimeEstimate } = useTransferTimeEstimate(
    source?.network?.slug,
    dest?.network?.slug
  )

  console.log({ fixedTimeEstimate, medianTimeEstimate })

  let warning = ''
  if (customRecipient && !dest?.network?.isLayer1) {
    warning =
      'If the recipient is an exchange, then there is possibility of loss funds if the token swap fails.'
  }

  const showDeadlineWarning = !!isGnosisSafeWallet

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography variant="h6" color="textSecondary">
          Send{' '}
          <strong>
            {commafy(source.amount, 5)} {source.token.symbol}
          </strong>
          <br />
          {source.network.name} to {dest?.network?.name}
        </Typography>

        <br />

        <Grid container justifyContent="center" spacing={6}>
          <Grid item>
            <Typography variant="subtitle2" color="textSecondary">
              Estimated Received
            </Typography>
            <Typography variant="subtitle2" color="textPrimary">
              {estimatedReceived}
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="subtitle2" color="textSecondary">
              Estimated Wait
            </Typography>
            <Typography variant="subtitle2" color="textPrimary">
              {(medianTimeEstimate !== null ? medianTimeEstimate : fixedTimeEstimate) + ' ' + pluralize('minute', medianTimeEstimate)}
            </Typography>
          </Grid>
        </Grid>
        {!!customRecipient && (
          <>
            <Typography variant="body1" color="textPrimary" className={styles.customRecipient}>
              Recipient: {new Address(customRecipient).truncate()}
            </Typography>
          </>
        )}
        {!!warning && <Alert severity="warning" text={warning} className={styles.warning} />}
      </div>
      {showDeadlineWarning && (
        <Box mb={2}>
          <Alert severity="warning" text="The swap deadline will expire in 7 days. If this is a Gnosis Safe transaction, make sure to execute it within the deadline." className={styles.warning} />
        </Box>
      )}
      <Box mb={2} display="flex" flexDirection="column" alignItems="center" textAlign="center">
        <Box style={{ maxWidth: '200px' }}>
        <Typography variant="body2" color="textSecondary">
          Please make sure your wallet is connected to the <strong>{source.network.name}</strong> network.
        </Typography>
        </Box>
      </Box>
      <div className={styles.action}>
        <Button
          className={styles.sendButton}
          onClick={handleSubmit}
          loading={sending}
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
