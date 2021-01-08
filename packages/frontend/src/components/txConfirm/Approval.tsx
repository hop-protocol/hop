import React, { useState, ChangeEvent } from 'react'
import Button from 'src/components/buttons/Button'
import { makeStyles } from '@material-ui/core/styles'
import Token from 'src/models/Token'
import Typography from '@material-ui/core/Typography'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center'
  },
  title: {
    marginBottom: '2rem'
  },
  approveAll: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: '2rem'
  },
  action: {},
  sendButton: {}
}))

interface Props {
  amount: string
  token: Token
  onConfirm: (confirmed: boolean, params?: any) => void
}

const Approval = (props: Props) => {
  const { amount, token, onConfirm } = props
  const styles = useStyles()
  const [sending, setSending] = useState<boolean>(false)
  const [approveAll, setApproveAll] = useState<boolean>(true)

  const handleSubmit = async () => {
    try {
      setSending(true)
      onConfirm(true, approveAll)
    } catch (err) {
      console.log(err)
    }
    setSending(false)
  }

  const handleApproveAll = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setApproveAll(checked)
  }

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography variant="h5" color="textPrimary">
          Approve {!approveAll ? amount : ''} {token.symbol}
        </Typography>
      </div>
      <div className={styles.approveAll}>
        <FormControlLabel
          control={
            <Checkbox
              checked={approveAll}
              onChange={handleApproveAll}
              color="primary"
            />
          }
          label="Approve all"
        />
      </div>
      <div className={styles.action}>
        <Button
          className={styles.sendButton}
          onClick={handleSubmit}
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
