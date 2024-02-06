import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Network from 'src/models/Network'
import React, { ChangeEvent, FC, useMemo } from 'react'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import logger from 'src/logger'
import { BigNumber } from 'ethers'
import { LargeTextField } from 'src/components/LargeTextField'
import { NetworkSelector } from 'src/components/NetworkSelector'
import { Token } from '@hop-protocol/sdk'
import { formatUnits } from 'ethers/lib/utils'
import { toTokenDisplay } from 'src/utils'
import { useAmountSelectorCardStyles, useEstimateTxCost } from 'src/hooks'

type Props = {
  value?: string
  label: string
  token?: Token
  onChange?: (value: string) => void
  fromNetwork?: Network
  toNetwork?: Network
  selectedNetwork?: Network
  networkOptions: Network[]
  onNetworkChange: (network?: Network) => void
  balance?: BigNumber
  loadingBalance?: boolean
  loadingValue?: boolean
  disableInput?: boolean
  deadline?: any
  setWarning?: (message: string) => void
  maxButtonFixedAmountToSubtract?: BigNumber
}

const SendAmountSelectorCard: FC<Props> = props => {
  const {
    value = '',
    label,
    token,
    onChange,
    fromNetwork,
    selectedNetwork,
    toNetwork,
    networkOptions,
    onNetworkChange,
    balance,
    loadingBalance = false,
    loadingValue = false,
    disableInput = false,
    deadline,
    setWarning,
    maxButtonFixedAmountToSubtract
  } = props
  const styles = useAmountSelectorCardStyles()

  const { estimateSend } = useEstimateTxCost(selectedNetwork)

  const balanceLabel = useMemo(() => {
    return toTokenDisplay(balance, token?.decimals)
  }, [balance])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (onChange) {
      onChange(value)
    }
  }

  const handleMaxClick = async () => {
    if (!(onChange && balance && token && fromNetwork && deadline)) {
      return
    }

    let nativeTokenMaxGasCost = BigNumber.from(0)

    if (token.isNativeToken) {
      if (!toNetwork && setWarning) {
        return setWarning('Please set a destination network to determine max value')
      }

      const options = {
        balance,
        token,
        fromNetwork,
        toNetwork,
        deadline,
      }

      try {
        const estimatedGasCost = await estimateSend(options)
        if (estimatedGasCost) {
          nativeTokenMaxGasCost = estimatedGasCost
        }
      } catch (error) {
        logger.error(error)
      }
    }

    let totalAmount = balance.sub(nativeTokenMaxGasCost).sub(maxButtonFixedAmountToSubtract ?? 0)
    if (totalAmount.lt(0)) {
      totalAmount = BigNumber.from(0)
    }

    const maxValue = formatUnits(totalAmount, token.decimals)
    onChange(maxValue)
  }

  return (
    <Card className={styles.root}>
      <Box width="100%" display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
        {loadingBalance ? (
          <Skeleton variant="text" width="15.0rem"></Skeleton>
        ) : balance ? (
          <div className={styles.balance}>
            {balance.gt(0) && !disableInput ? (
              <button
                className={styles.maxButton}
                onClick={handleMaxClick}
                title="Max amount you can send while still having enough to cover fees"
              >
                MAX
              </button>
            ) : null}
            <Typography variant="subtitle2" color="textSecondary" align="right">
              Balance: {balanceLabel}
            </Typography>
          </div>
        ) : null}
      </Box>

      <Box width="100%" display="flex" justifyContent="space-between" alignItems="center" className={styles.mobileFlexColumn}>
        <Box width="45%" overflow="hidden" className={styles.mobileFlexColumn}>
          <NetworkSelector network={selectedNetwork} setNetwork={onNetworkChange} />
        </Box>
        <Box width="55%" className={styles.mobileFlexColumn}>
          <LargeTextField
            value={value}
            onChange={handleInputChange}
            placeholder="0.0"
            units={token?.symbol}
            disabled={disableInput}
            loadingValue={loadingValue}
          />
        </Box>
      </Box>
    </Card>
  )
}

export default SendAmountSelectorCard
