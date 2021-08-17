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
  network: Network
  token: Token
  amount: string
}

interface Props {
  token0: TokenEntity
  token1: TokenEntity
  onConfirm: (confirmed: boolean) => void
}

const AddLiquidity = (props: Props) => {
  const { token0, token1, onConfirm } = props
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
          Add Liquidity
        </Typography>
        <Typography variant="h6" color="textPrimary">
          {commafy(token0.amount, 5)} {token0.token.symbol} +{' '}
          {commafy(token1.amount, 5)} {token1.token.symbol}
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
          Add liquidity
        </Button>
      </div>
    </div>
  )
}

export default AddLiquidity
