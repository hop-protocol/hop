import React, { useState, ChangeEvent } from 'react'
import Button from 'src/components/buttons/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
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
  tagline: {
    marginTop: '1rem',
  },
  approveAll: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: '2rem',
  },
  action: {},
  sendButton: {},
}))

interface Props {
  amount: string
  tagline?: string
  tokenSymbol: string
  onConfirm: (confirmed: boolean, params?: any) => void
  source: NetworkTokenEntity
}

const Approval = (props: Props) => {
  const { amount, tokenSymbol, onConfirm, tagline, source } = props
  const styles = useStyles()
  const [approveAll, setApproveAll] = useState<boolean>(true)
  const showApproveAll = !!amount

  const { sending, handleSubmit } = useSendingTransaction({ onConfirm, source })

  const handleApproveAll = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setApproveAll(checked)
  }

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography variant="h5" color="textPrimary">
          Approve {commafy(!approveAll ? amount : '')} {tokenSymbol}
        </Typography>
        {tagline ? (
          <Typography variant="body1" color="textPrimary" className={styles.tagline}>
            {tagline}
          </Typography>
        ) : null}
      </div>
      {showApproveAll ? (
        <div className={styles.approveAll}>
          <FormControlLabel
            control={
              <Checkbox
                checked={approveAll}
                onChange={handleApproveAll}
                disabled={amount === 'ALL'}
                color="primary"
              />
            }
            label="Approve all"
          />
        </div>
      ) : null}
      <div className={styles.action}>
        <Button
          className={styles.sendButton}
          onClick={() => handleSubmit(approveAll)}
          loading={sending}
          large
          highlighted
        >
          Approve
        </Button>
      </div>
    </div>
  )
}

export default Approval
