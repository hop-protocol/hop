import React from 'react'
import Typography from '@mui/material/Typography'
import { Button } from '#components/Button/index.js'
import { NetworkTokenEntity, commafy } from '#utils/index.js'
import { makeStyles } from '@mui/styles'
import { useSendingTransaction } from '#components/txConfirm/useSendingTransaction.js'

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
  action: {},
  sendButton: {},
}))

interface Props {
  token0: NetworkTokenEntity
  token1: NetworkTokenEntity
  onConfirm: (confirmed: boolean) => void
  source: NetworkTokenEntity
}

const AddLiquidity = (props: Props) => {
  const { token0, token1, onConfirm, source } = props
  const styles = useStyles()

  const { sending, handleSubmit } = useSendingTransaction({ onConfirm, source })

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography variant="h5" color="textPrimary">
          Add Liquidity
        </Typography>
        <Typography variant="h6" color="textPrimary">
          {commafy(token0.amount, 5)} {token0.token.symbol} + {commafy(token1.amount, 5)}{' '}
          {token1.token.symbol}
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
