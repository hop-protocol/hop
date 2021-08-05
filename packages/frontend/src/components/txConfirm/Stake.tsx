import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Token } from '@hop-protocol/sdk'
import Button from 'src/components/buttons/Button'
import logger from 'src/logger'
import { commafy } from 'src/utils'

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

interface Props {
  amount: string,
  token: Token,
  onConfirm: (confirmed: boolean) => void
}

const Stake = (props: Props) => {
  const { amount, token, onConfirm } = props
  const styles = useStyles()
  const [sending, setSending] = useState<boolean>(false)

  const handleSubmit = async () => {
    try {
      setSending(true)
      onConfirm(true)
    } catch (err) {
      logger.error(err)
    }
    setSending(false)
  }

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography variant="h5" color="textPrimary">
          Stake {commafy(amount, 5)} {token.symbol}
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
          Stake
        </Button>
      </div>
    </div>
  )
}

export default Stake
