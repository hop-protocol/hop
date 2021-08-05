import React, { useState } from 'react'
import Button from 'src/components/buttons/Button'
import { makeStyles } from '@material-ui/core/styles'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import Typography from '@material-ui/core/Typography'
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

interface TokenEntity {
  token: Token
  network: Network
  amount: string
}

interface Props {
  source: TokenEntity
  dest: Partial<TokenEntity>
  onConfirm: (confirmed: boolean) => void
}

const Send = (props: Props) => {
  const { source, dest, onConfirm } = props
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
          Send {commafy(source.amount, 5)} {source.token.symbol} from{' '}
          {source.network.name} to {dest?.network?.name}
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
          Send
        </Button>
      </div>
    </div>
  )
}

export default Send
