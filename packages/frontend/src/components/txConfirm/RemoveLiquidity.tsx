import React, { FC, useEffect, useState } from 'react'
import Button from 'src/components/buttons/Button'
import { makeStyles } from '@material-ui/core/styles'
import MuiSlider from '@material-ui/core/Slider'
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
  amounts: {
    fontSize: '2rem'
  },
  action: {},
  sendButton: {},
  sliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: '2rem'
  },
  slider: {
    width: '100%',
    maxWidth: '260px',
    margin: '0 auto'
  }
}))

type SliderProps = {
  onChange?: (value: number) => void
}

const Slider: FC<SliderProps> = (props: SliderProps) => {
  const styles = useStyles()
  const [value, setValue] = useState<number>(0)
  const handleChange = (event: any, _value: number | number[]) => {
    setValue(_value as number)
  }

  useEffect(() => {
    if (props.onChange) {
      props.onChange(value)
    }
  }, [value])

  return (
    <div className={styles.sliderContainer}>
      <Typography variant="body1" color="textPrimary">
        Amount
      </Typography>
      <Typography variant="h4" color="textPrimary">
        {value}%
      </Typography>
      <div className={styles.slider}>
        <MuiSlider
          value={value}
          valueLabelDisplay="auto"
          step={5}
          marks
          min={0}
          max={100}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

interface TokenEntity {
  network: Network
  token: Token
  amount: string
}

interface Props {
  token0: TokenEntity
  token1: TokenEntity
  onConfirm: (confirmed: boolean, amountPercent?: number) => void
}

const RemoveLiquidity = (props: Props) => {
  const { token0, token1, onConfirm } = props
  const styles = useStyles()
  const [sending, setSending] = useState<boolean>(false)
  const [amountPercent, setAmountPercent] = useState<number>(0)

  const handleSubmit = async () => {
    try {
      setSending(true)
      onConfirm(true, amountPercent)
    } catch (err) {
      logger.error(err)
    }
    setSending(false)
  }

  const disabled = amountPercent === 0
  const token0Amount = commafy(
    (Number(token0.amount) * (amountPercent / 100)).toFixed(5)
    , 5)
  const token1Amount = commafy(
    (Number(token1.amount) * (amountPercent / 100)).toFixed(5)
    , 5)

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography variant="h5" color="textPrimary">
          Remove Liquidity
        </Typography>
        <Typography
          variant="body2"
          color="textPrimary"
          className={styles.amounts}
        >
          {token0Amount} {token0.token.symbol} + {token1Amount}{' '}
          {token1.token.symbol}
        </Typography>
      </div>
      <Slider
        onChange={value => {
          setAmountPercent(value)
        }}
      />
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
