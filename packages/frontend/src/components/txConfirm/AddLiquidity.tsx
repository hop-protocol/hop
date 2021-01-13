import React, { useState } from 'react'
import Button from 'src/components/buttons/Button'
import { makeStyles } from '@material-ui/core/styles'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
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
  network: Network
  token: Token
  amount: string
}

interface Props {
  token0: Party
  token1: Party
  onConfirm: (confirmed: boolean) => void
}

const Swap = (props: Props) => {
  const { token0, token1, onConfirm } = props
  const styles = useStyles()
  const [sending, setSending] = useState<boolean>(false)

  const handleSubmit = async () => {
    try {
      setSending(true)
      onConfirm(true)
    } catch (err) {
      console.log(err)
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
          {token0.amount} {token0.token.networkSymbol(token0.network)} +{' '}
          {token1.amount} {token1.token.networkSymbol(token1.network)}
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

export default Swap
