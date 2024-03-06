import Box from '@mui/material/Box'
import React, { ChangeEvent } from 'react'
import TokenWrapper from 'src/components/TokenWrapper'
import Typography from '@mui/material/Typography'
import { Alert } from 'src/components/Alert'
import { BalanceText } from 'src/pages/Pools/components/BalanceText'
import { BigNumber } from 'ethers'
import { Button } from 'src/components/Button'
import { InfoTooltip } from 'src/components/InfoTooltip'
import { InputField } from 'src/pages/Pools/components/InputField'
import { formatUnits } from 'ethers/lib/utils'
import { normalizeTokenSymbol } from 'src/utils/normalizeTokenSymbol'
import { sanitizeNumericalString } from 'src/utils'

type Props = {
  addLiquidity: any
  balance0Bn: BigNumber
  balance0Formatted: string
  balance1Bn: BigNumber
  balance1Formatted: string
  depositAmountTotalDisplayFormatted: string
  enoughBalance: boolean
  isDepositing: boolean
  isTokenDeprecated: boolean
  priceImpactFormatted: string
  selectedNetwork: any
  setToken0Amount: any
  setToken1Amount: any
  token0Amount: string
  token0ImageUrl: string
  token0Symbol: string
  token1Amount: string
  token1ImageUrl: string
  token1Symbol: string
  tokenDecimals: number
  walletConnected: boolean
}

export function DepositForm(props: Props) {
  const {
    addLiquidity,
    balance0Bn,
    balance0Formatted,
    balance1Bn,
    balance1Formatted,
    depositAmountTotalDisplayFormatted,
    enoughBalance,
    isDepositing,
    isTokenDeprecated,
    priceImpactFormatted,
    selectedNetwork,
    setToken0Amount,
    setToken1Amount,
    token0Amount,
    token0ImageUrl,
    token0Symbol,
    token1Amount,
    token1ImageUrl,
    token1Symbol,
    tokenDecimals,
    walletConnected,
  } = props

  function handleToken0Change (value: string) {
    const token0Value = sanitizeNumericalString(value)
    if (!token0Value) {
      setToken0Amount('')
      return
    }

    setToken0Amount(token0Value)
  }

  function handleToken1Change (value: string) {
    const token1Value = sanitizeNumericalString(value)
    if (!token1Value) {
      setToken1Amount('')
      return
    }

    setToken1Amount(token1Value)
  }

  function handleClick (event: ChangeEvent<object>) {
    event.preventDefault()
    addLiquidity()
  }

  function handleBalance0Max (value: BigNumber) {
    try {
      setToken0Amount(formatUnits(value, tokenDecimals))
    } catch (err) {
    }
  }

  function handleBalance1Max (value: BigNumber) {
    try {
      setToken1Amount(formatUnits(value, tokenDecimals))
    } catch (err) {
    }
  }

  const formDisabled = false
  const isEmptyAmount = (!(Number(token0Amount) || Number(token1Amount)))
  const sendDisabled = formDisabled || isEmptyAmount || !enoughBalance
  let sendButtonText = walletConnected ? 'Preview' : 'Connect Wallet'
  if (!enoughBalance) {
    sendButtonText = 'Insufficient Balance'
  }

  if (isTokenDeprecated) {
    return (
      <Box mb={4}>
        <Alert severity="warning" text={(normalizeTokenSymbol(token0Symbol) ? ("The " + normalizeTokenSymbol(token0Symbol)) : "This") + " bridge is deprecated. Only withdrawals from the AMM are supported."} />
      </Box>
    )
  } else {
    return (
      <Box>
        <Box mb={4}>
          <Box mb={1}>
            {/*
            <Typography variant="body2" color="secondary">
              <MuiLink><strong>Wrap/Unwrap token</strong></MuiLink>
            </Typography>
            */}
            <TokenWrapper network={selectedNetwork} />
          </Box>
          <Box mb={1} display="flex" justifyContent="flex-end">
            <BalanceText label="Balance" balanceFormatted={balance0Formatted} balanceBn={balance0Bn} onClick={handleBalance0Max} />
          </Box>
          <Box mb={1}>
            <InputField
              tokenSymbol={token0Symbol}
              tokenImageUrl={token0ImageUrl}
              value={token0Amount}
              onChange={handleToken0Change}
              disabled={formDisabled}
            />
          </Box>
          <Box display="flex" justifyContent="center">
            <Typography variant="h6" color="secondary">
            +
            </Typography>
          </Box>
          <Box mb={1} display="flex" justifyContent="flex-end">
            <BalanceText label="Balance" balanceFormatted={balance1Formatted} balanceBn={balance1Bn} onClick={handleBalance1Max} />
          </Box>
          <Box mb={1}>
            <InputField
              tokenSymbol={token1Symbol}
              tokenImageUrl={token1ImageUrl}
              value={token1Amount}
              onChange={handleToken1Change}
              disabled={formDisabled}
            />
          </Box>
        </Box>
        <Box margin="0 auto" width="90%">
          <Box mb={1} display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="subtitle2" color="secondary">
                <Box display="flex" alignItems="center">
                  Price Impact <InfoTooltip title="Depositing underpooled assets will give you bonus LP tokens. Depositing overpooled assets will give you less LP tokens." />
                </Box>
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="secondary">
                {priceImpactFormatted}
              </Typography>
            </Box>
          </Box>
          <Box mb={1} display="flex" alignItems="center" justifyContent="space-between">
            <Box mb={1}>
              <Typography variant="h6">
                <Box display="flex" alignItems="center">
                  Total <InfoTooltip title="Total value of deposit in USD" />
                </Box>
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography variant="h6">
                {depositAmountTotalDisplayFormatted}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <Button large highlighted fullWidth onClick={handleClick} disabled={sendDisabled} loading={isDepositing}>
            {sendButtonText}
          </Button>
        </Box>
      </Box>
    )
  }
}
