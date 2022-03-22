import React, { useEffect, useState, ChangeEvent } from 'react'
import Button from 'src/components/buttons/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import AmountSelectorCard from 'src/components/AmountSelectorCard'
import logger from 'src/logger'
import { commafy, NetworkTokenEntity } from 'src/utils'
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { Slider } from 'src/components/slider'
import MenuItem from '@material-ui/core/MenuItem'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import SelectOption from 'src/components/selects/SelectOption'
import DetailRow from 'src/components/InfoTooltip/DetailRow'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
  title: {
    marginBottom: '2rem',
  },
  selection: {
    marginBottom: '2rem',
  },
  proportionalAmount: {
    marginBottom: '1rem',
  },
  amountInput: {
    marginTop: '1rem',
    marginBottom: '2rem',
  },
  action: {},
  sendButton: {},
  details: {
    width: '20rem',
    margin: '0 auto 3rem auto',
  },
}))

type TokenEntity = NetworkTokenEntity & {
  max: BigNumber
}

interface Result {
  proportional?: boolean
  tokenIndex?: number
  amountPercent?: number
  amount?: BigNumber
}

interface Props {
  token0: TokenEntity
  token1: TokenEntity
  onConfirm: (confirmed: boolean, result: Result) => void
  calculatePriceImpact: (result: Result) => number
}

const RemoveLiquidity = (props: Props) => {
  const { token0, token1, onConfirm, calculatePriceImpact } = props
  const styles = useStyles()
  const [sending, setSending] = useState<boolean>(false)
  const selections: any[] = [
    { label: 'All tokens', value: -1 },
    { label: token0.token.symbol, value: 0, icon: (token0.token as any).image },
    { label: token1.token.symbol, value: 1, icon: (token1.token as any).image },
  ]
  const [selection, setSelection] = useState<any>(selections[0])
  const [proportional, setProportional] = useState<boolean>(true)
  const [amount, setAmount] = useState<string>('')
  const [amountBN, setAmountBN] = useState<BigNumber>(BigNumber.from(0))
  const [amountSliderValue, setAmountSliderValue] = useState<number>(0)
  const [displayAmount, setDisplayAmount] = useState<string>('')
  const [amountPercent, setAmountPercent] = useState<number>(100)
  const [tokenIndex, setTokenIndex] = useState<number>(0)
  const [priceImpact, setPriceImpact] = useState<number | undefined>()
  const selectedToken = tokenIndex ? token1.token : token0.token
  const maxBalance = tokenIndex ? token1.max : token0.max
  const tokenDecimals = token0.token.decimals
  const disabled = proportional ? !amountPercent : amountBN.lte(0) || amountBN.gt(maxBalance)

  const handleSubmit = async () => {
    try {
      setSending(true)
      onConfirm(true, {
        proportional,
        tokenIndex,
        amountPercent,
        amount: amountBN,
      })
    } catch (err) {
      logger.error(err)
    }
    setSending(false)
  }

  const updateDisplayAmount = (percent: number = amountPercent) => {
    const _amount0 = Number(formatUnits(token0.amount, tokenDecimals))
    const _amount1 = Number(formatUnits(token1.amount, tokenDecimals))
    const amount0 = commafy((_amount0 * (percent / 100)).toFixed(5), 5)
    const amount1 = commafy((_amount1 * (percent / 100)).toFixed(5), 5)
    const display = `${amount0} ${token0.token.symbol} + ${amount1} ${token1.token.symbol}`
    setDisplayAmount(display)
  }

  const handleProportionSliderChange = async (percent: number) => {
    setAmountPercent(percent)
    updateDisplayAmount(percent)
  }

  const handleAmountSliderChange = (percent: number) => {
    const _balance = Number(formatUnits(maxBalance, tokenDecimals))
    const _amount = (_balance ?? 0) * (percent / 100)
    setAmount(_amount.toFixed(5))
    if (percent === 100) {
      setAmountBN(maxBalance)
    }
  }

  const handleSelection = (event: ChangeEvent<{ value: unknown }>) => {
    const value = Number(event.target.value)
    const _selection = selections.find(item => item.value === value)
    const _proportional = value === -1
    setSelection(_selection)
    setProportional(_proportional)
    if (value > -1) {
      setTokenIndex(value)
    }
  }

  const handleAmountChange = (_amount: string) => {
    const value = Number(_amount)
    const _balance = Number(formatUnits(maxBalance, tokenDecimals))
    const sliderValue = 100 / (_balance / value)
    setAmount(_amount)
    setAmountSliderValue(sliderValue)
  }

  useEffect(() => {
    updateDisplayAmount()
  }, [])

  useEffect(() => {
    setAmountBN(parseUnits((amount || 0).toString(), tokenDecimals))
  }, [amount])

  useEffect(() => {
    let isSubscribed = true
    const update = async () => {
      try {
        const _priceImpact = await calculatePriceImpact({
          proportional,
          amountPercent,
          tokenIndex,
          amount: amountBN,
        })
        if (isSubscribed) {
          setPriceImpact(_priceImpact)
        }
      } catch (err) {
        console.log(err)
        if (isSubscribed) {
          setPriceImpact(undefined)
        }
      }
    }

    update().catch(console.error)
    return () => {
      isSubscribed = false
    }
  }, [amountBN, proportional, amountPercent, tokenIndex])

  const priceImpactLabel = Number(priceImpact) > 0 ? 'Bonus' : 'Price Impact'
  const priceImpactFormatted = priceImpact ? `${Number((priceImpact * 100).toFixed(4))}%` : ''

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Typography variant="h5" color="textPrimary">
          Remove Liquidity
        </Typography>
      </div>
      <div className={styles.selection}>
        <RaisedSelect value={selection.value} onChange={handleSelection}>
          {selections.map((item: any) => (
            <MenuItem value={item.value} key={item.label}>
              <SelectOption value={item.label} icon={item.icon} label={item.label} />
            </MenuItem>
          ))}
        </RaisedSelect>
      </div>
      {proportional ? (
        <div>
          <Typography variant="subtitle2" color="textPrimary">
            Proportional withdraw
          </Typography>
          <div className={styles.proportionalAmount}>{displayAmount}</div>
          <Slider onChange={handleProportionSliderChange} defaultValue={100} />
        </div>
      ) : (
        <div>
          <Typography variant="subtitle2" color="textPrimary">
            Withdraw only {selectedToken.symbol}
          </Typography>
          <div className={styles.amountInput}>
            <AmountSelectorCard
              label={`${selectedToken.symbol} to withdraw`}
              balance={maxBalance}
              balanceLabel={'Available:'}
              value={amount}
              token={selectedToken as any}
              onChange={handleAmountChange}
              decimalPlaces={5}
            />
          </div>
          <Slider onChange={handleAmountSliderChange} defaultValue={0} value={amountSliderValue} />
          <div className={styles.details}>
            <DetailRow
              title={priceImpactLabel}
              tooltip="Withdrawing overpooled assets will give you bonus tokens. Withdrawaing underpooled assets will give you less tokens."
              value={`${priceImpactFormatted}`}
            />
          </div>
        </div>
      )}
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
