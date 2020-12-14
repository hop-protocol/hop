import React, { useState } from 'react'
import Button from 'src/components/buttons/Button'
import { makeStyles } from '@material-ui/core/styles'
import Token from 'src/models/Token'
import Typography from '@material-ui/core/Typography'

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
  action: {},
  sendButton: {}
}))

interface Party {
  token: Token
  amount: string
}

interface Props {
  source: Party
  dest: Party
  onConfirm: (confirmed: boolean) => void
}

const Convert = (props: Props) => {
  const { source, dest, onConfirm } = props
  const styles = useStyles()
  const [sending, setSending] = useState<boolean>(false)

  const handleSubmit = async () => {
    try {
      setSending(true)
      await onConfirm(true)
    } catch (err) {
      console.log(err)
    }
    setSending(false)
  }

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography variant="h5" color="textPrimary">
          Convert {source.amount} {source.token.symbol} for {dest.amount}{' '}
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

export default Convert
