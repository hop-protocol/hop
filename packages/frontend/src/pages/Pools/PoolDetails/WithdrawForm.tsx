import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import MuiLink from '@mui/material/Link'
import RaisedSelect from '#components/selects/RaisedSelect.js'
import React, { ChangeEvent, useEffect, useState } from 'react'
import SelectOption from '#components/selects/SelectOption.js'
import Typography from '@mui/material/Typography'
import { BalanceText } from '#pages/Pools/components/BalanceText.js'
import { BigNumber, utils } from 'ethers'
import { Button } from '#components/Button/index.js'
import { InfoTooltip } from '#components/InfoTooltip/index.js'
import { InputField } from '#pages/Pools/components/InputField.js'
import { SelectChangeEvent } from '@mui/material/Select'
import { Slider } from '#components/slider/index.js'
import { TokenIcon } from '#pages/Pools/components/TokenIcon.js'
import { commafy, formatTokenDecimalString, sanitizeNumericalString } from '#utils/index.js'

type Props = {
  calculatePriceImpact: any
  goToTab: any
  hasBalance: boolean
  isWithdrawing: boolean
  removeLiquidity: any
  token0AmountBn: BigNumber
  token0ImageUrl: string
  token0MaxBn: BigNumber
  token0Symbol: string
  token1AmountBn: BigNumber
  token1ImageUrl: string
  token1MaxBn: BigNumber
  token1Symbol: string
  tokenDecimals: number
  walletConnected: boolean
  isTokenDeprecated: boolean
}

export function WithdrawForm(props: any) {
  const {
    calculatePriceImpact,
    goToTab,
    hasBalance,
    isWithdrawing,
    removeLiquidity,
    token0AmountBn,
    token0ImageUrl,
    token0MaxBn,
    token0Symbol,
    token1AmountBn,
    token1ImageUrl,
    token1MaxBn,
    token1Symbol,
    tokenDecimals,
    walletConnected,
    isTokenDeprecated
  } = props

  const selections: any[] = [
    { label: 'All tokens', value: -1 },
    { label: token0Symbol, value: 0, icon: token0ImageUrl },
    { label: token1Symbol, value: 1, icon: token1ImageUrl },
  ]

  const [selection, setSelection] = useState<any>(selections[0])
  const [proportional, setProportional] = useState<boolean>(true)
  const [tokenIndex, setTokenIndex] = useState<number>(0)
  const [displayAmount, setDisplayAmount] = useState<string>('')
  const [amountPercent, setAmountPercent] = useState<number>(100)
  const [proportionalAmount0, setProportionalAmount0] = useState<string>('')
  const [proportionalAmount1, setProportionalAmount1] = useState<string>('')
  const selectedTokenSymbol = tokenIndex ? token1Symbol : token0Symbol
  const [amount, setAmount] = useState<string>('')
  const [amountBN, setAmountBN] = useState<BigNumber>(BigNumber.from(0))
  const maxBalance = tokenIndex ? token1MaxBn : token0MaxBn
  const [amountSliderValue, setAmountSliderValue] = useState<number>(0)
  const [priceImpact, setPriceImpact] = useState<number | undefined>()

  useEffect(() => {
    if (tokenDecimals === undefined) {
      return
    }
    const value = Number(amount)
    const _balance = Number(utils.formatUnits(maxBalance, tokenDecimals))
    const sliderValue = 100 / (_balance / value)
    setAmountSliderValue(sliderValue)
  }, [amount, tokenDecimals])

  useEffect(() => {
    updateDisplayAmount()
  }, [])

  useEffect(() => {
    if (tokenDecimals === undefined) {
      return
    }
    try {
      setAmountBN(utils.parseUnits((amount || 0).toString(), tokenDecimals))
    } catch (err) {
    }
  }, [amount, tokenDecimals])

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

  function handleSelection (event: SelectChangeEvent<unknown>) {
    const value = Number(event.target.value as string)
    const _selection = selections.find(item => item.value === value)
    const _proportional = value === -1
    setSelection(_selection)
    setProportional(_proportional)
    if (value > -1) {
      setTokenIndex(value)
    }
  }

  function updateDisplayAmount (percent: number = amountPercent) {
    if (!token0AmountBn) {
      return
    }
    if (!token1AmountBn) {
      return
    }
    if (tokenDecimals === undefined) {
      return
    }
    const _amount0 = Number(utils.formatUnits(token0AmountBn, tokenDecimals))
    const _amount1 = Number(utils.formatUnits(token1AmountBn, tokenDecimals))
    const _amount0Percent = _amount0 * percent / 100
    const _amount1Percent = _amount1 * percent / 100
    const amount0 = commafy(_amount0Percent.toFixed(5), 5)
    const amount1 = commafy(_amount1Percent.toFixed(5), 5)
    const display = `${amount0} ${token0Symbol} + ${amount1} ${token1Symbol}`
    setDisplayAmount(display)
    setProportionalAmount0(_amount0Percent.toString())
    setProportionalAmount1(_amount1Percent.toString())
  }

  async function handleProportionSliderChange (percent: number) {
    setAmountPercent(percent)
    updateDisplayAmount(percent)
  }

  function handleAmountSliderChange (percent: number) {
    if (tokenDecimals === undefined) {
      return
    }
    const _balance = Number(utils.formatUnits(maxBalance, tokenDecimals))
    const _amount = (_balance ?? 0) * (percent / 100)
    setAmount(_amount.toFixed(5))
    if (percent === 100) {
      setAmountBN(maxBalance)
    }
  }

  function handleMaxClick (_value: BigNumber) {
    if (tokenDecimals === undefined) {
      return
    }
    setAmount(utils.formatUnits(_value.toString(), tokenDecimals))
    setAmountBN(_value)
  }

  function handleSubmitClick (event: ChangeEvent<object>) {
    event.preventDefault()
    const amounts = { proportional, tokenIndex, amountPercent, amount: amountBN, priceImpactFormatted, proportionalAmount0, proportionalAmount1 }
    removeLiquidity(amounts)
  }

  function handleUnstakeClick (event: ChangeEvent<object>) {
    event.preventDefault()
    goToTab('stake')
  }

  function handleInputAmountChange (value: string) {
    try {
      setAmount(sanitizeNumericalString(value))
    } catch (err: any) {
      console.error(err)
    }
  }

  const priceImpactFormatted = priceImpact ? `${Number((priceImpact * 100).toFixed(4))}%` : ''
  const formDisabled = !hasBalance
  const isEmptyAmount = (proportional ? !(amountPercent && (token0MaxBn?.gt(0) || token1MaxBn.gt(0))) : (amountBN.lte(0) || amountBN.gt(maxBalance)))
  const sendDisabled = formDisabled || isEmptyAmount
  const sendButtonText = walletConnected ? 'Preview' : 'Connect Wallet'

  if (!hasBalance) {
    return (
      <Box>
        <Box mb={2}>
          {walletConnected ? (
            <Typography variant="body1">
              You don't have any LP tokens tokens to withdraw.
            </Typography>
          ) : (
            <Typography variant="body1">
              Connect wallet to deposit
            </Typography>
          )}
        </Box>
        {!isTokenDeprecated && (
          <Box>
            <Button onClick={() => goToTab('deposit')}>
              <Typography variant="body1">
                Deposit
              </Typography>
            </Button>
          </Box>
        )}
      </Box>
    )
  }

  const maxBalanceFormatted = tokenDecimals !== null ? `${formatTokenDecimalString(maxBalance, tokenDecimals, 4)}` : ''

  return (
    <Box>
      <Box mb={2} display="flex" justifyContent="center">
        <Typography variant="body1">
          <em>To withdraw staked tokens, first unstake on the <MuiLink href="" onClick={handleUnstakeClick}>stake tab</MuiLink>.</em>
        </Typography>
      </Box>

      <Box mb={3} display="flex" justifyContent="center">
        <RaisedSelect value={selection.value} onChange={handleSelection}>
          {selections.map((item: any) => (
            <MenuItem value={item.value} key={item.label}>
              <SelectOption value={item.label} icon={
                <TokenIcon src={item.icon} alt={item.label} />
              } label={item.label} />
            </MenuItem>
          ))}
        </RaisedSelect>
      </Box>

      {proportional ? (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Typography variant="subtitle2" color="textPrimary">
            Proportional withdraw
          </Typography>
          <Box mb={1}>
            <Typography variant="body1">
              {displayAmount}
            </Typography>
          </Box>
          <Box width="100%" textAlign="center">
            <Slider onChange={handleProportionSliderChange} defaultValue={100} />
          </Box>
        </Box>
      ) : (
        <Box>
          <Box mb={1} display="flex" alignItems="center" justifyContent="center">
            <Typography variant="body1" color="textPrimary">
              Withdraw the amount to {selectedTokenSymbol}
            </Typography>
          </Box>
          <Box mb={1} display="flex" justifyContent="flex-end">
            <BalanceText label="Balance" balanceFormatted={maxBalanceFormatted} balanceBn={maxBalance} onClick={handleMaxClick} />
          </Box>
          <Box mb={1}>
            <InputField
              tokenSymbol={selectedTokenSymbol}
              tokenImageUrl={token0ImageUrl}
              value={amount}
              onChange={handleInputAmountChange}
              disabled={formDisabled}
            />
          </Box>
          <Box width="100%" textAlign="center">
            <Slider onChange={handleAmountSliderChange} defaultValue={0} value={amountSliderValue} />
          </Box>
        </Box>
      )}

      <Box margin="0 auto" width="90%">
        <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle2" color="secondary">
              <Box display="flex" alignItems="center">
                Price Impact <InfoTooltip title="Withdrawing overpooled assets will give you bonus tokens. Withdrawing underpooled assets will give you less tokens." />
              </Box>
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="secondary">
              {priceImpactFormatted}
            </Typography>
          </Box>
        </Box>
      <Box>
        <Button large highlighted fullWidth onClick={handleSubmitClick} disabled={sendDisabled} loading={isWithdrawing}>
          {sendButtonText}
        </Button>
      </Box>
    </Box>
    </Box>
  )
}
