import React, { FC, useEffect, useState } from 'react'
import Button from 'src/components/buttons/Button'
import { makeStyles } from '@material-ui/core/styles'
import MuiSlider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import { Token } from '@hop-protocol/sdk'
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

interface Props {
  token: Token
  amount: string
  onConfirm: (confirmed: boolean, amountPercent?: number) => void
}

const WithdrawStake = (props: Props) => {
  const { token, amount, onConfirm } = props
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
  const tokenAmount = (Number(amount) * (amountPercent / 100))
  const formattedAmount = commafy(tokenAmount.toFixed(5), 5)
  const withdrawAndClaim = amountPercent === 100

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography variant="h5" color="textPrimary">
          Withdraw
        </Typography>
        <Typography
          variant="body2"
          color="textPrimary"
          className={styles.amounts}
        >
          {formattedAmount} {token.symbol}
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
          {
            withdrawAndClaim
              ? 'Withdraw & Claim'
              : 'Withdraw'
          }
        </Button>
      </div>
    </div>
  )
}

export default WithdrawStake
