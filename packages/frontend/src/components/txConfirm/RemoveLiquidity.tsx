import React, { FC, useEffect, useState, ChangeEvent } from 'react'
import Button from 'src/components/buttons/Button'
import { makeStyles } from '@material-ui/core/styles'
import MuiSlider from '@material-ui/core/Slider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import LargeTextField from 'src/components/LargeTextField'
import AmountSelectorCard from 'src/components/AmountSelectorCard'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import logger from 'src/logger'
import { amountToBN, commafy } from 'src/utils'

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
  inputs: {
    marginBottom: '2rem'
  },
  amountInput: {
    marginBottom: '2rem'
  },
  action: {},
  sendButton: {},
}))

interface TokenEntity {
  network: Network
  token: Token
  amount: string
}

interface Amounts {
  tokenAmount0: string
  tokenAmount1: string
}

interface Props {
  token0: TokenEntity
  token1: TokenEntity
  onConfirm: (confirmed: boolean, amounts: Amounts) => void
}

const RemoveLiquidity = (props: Props) => {
  const { token0, token1, onConfirm } = props
  const styles = useStyles()
  const [sending, setSending] = useState<boolean>(false)
  const [tokenAmount0, setTokenAmount0] = useState<string>('')
  const [tokenAmount1, setTokenAmount1] = useState<string>('')

  const handleSubmit = async () => {
    try {
      setSending(true)
      onConfirm(true, {
        tokenAmount0,
        tokenAmount1,
      })
    } catch (err) {
      logger.error(err)
    }
    setSending(false)
  }

  const totalTokenAmount0 = commafy((Number(token0.amount)).toFixed(5), 5)
  const totalTokenAmount1 = commafy((Number(token1.amount)).toFixed(5), 5)
  const disabled = !(tokenAmount0 || tokenAmount1) || (Number(tokenAmount0) > Number(token0.amount)) || (Number(tokenAmount1) > Number(token1.amount))

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography variant="h5" color="textPrimary">
          Remove Liquidity
        </Typography>
      </div>
      <div className={styles.inputs}>
        <div className={styles.amountInput}>
          <AmountSelectorCard
            label={`${token0.token.symbol} to withdraw`}
            balance={amountToBN(totalTokenAmount0, token0.token.decimals)}
            balanceLabel={'Available:'}
            value={tokenAmount0}
            token={token0.token as any}
            onChange={setTokenAmount0}
            decimalPlaces={2}
          />
        </div>
        <div className={styles.amountInput}>
          <AmountSelectorCard
            label={`${token1.token.symbol} to withdraw`}
            balance={amountToBN(totalTokenAmount1, token1.token.decimals)}
            balanceLabel={'Available:'}
            value={tokenAmount1}
            token={token1.token as any}
            onChange={setTokenAmount1}
            decimalPlaces={2}
          />
        </div>
      </div>
      <div className={styles.action}>
        <Button
          disabled={disabled}
          className={styles.sendButton}
          onClick={handleSubmit}
          loading={sending}
          large
          highlighted
        >
          Remove liquidity
        </Button>
      </div>
    </div>
  )
}

export default RemoveLiquidity
