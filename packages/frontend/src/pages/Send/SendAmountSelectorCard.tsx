import React, { useMemo, FC, ChangeEvent } from 'react'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'
import { Token } from '@hop-protocol/sdk'
import LargeTextField from 'src/components/LargeTextField'
import Network from 'src/models/Network'
import { toTokenDisplay } from 'src/utils'
import logger from 'src/logger'
import { useAmountSelectorCardStyles, useNativeTokenMaxValue } from 'src/hooks'
import { NetworkSelector } from 'src/components/NetworkSelector'

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
  } = props
  const styles = useAmountSelectorCardStyles()

  const { estimateSend } = useNativeTokenMaxValue(selectedNetwork)

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

    const totalAmount = balance.sub(nativeTokenMaxGasCost)

    const maxValue = formatUnits(totalAmount, token.decimals)
    onChange(maxValue)
  }

  return (
    <Card className={styles.root}>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        className={styles.topRow}
      >
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
        {loadingBalance ? (
          <Skeleton variant="text" width="15.0rem"></Skeleton>
        ) : balance ? (
          <div className={styles.balance}>
            {balance.gt(0) && !disableInput ? (
              <button className={styles.maxButton} onClick={handleMaxClick}>
                MAX
              </button>
            ) : null}
            <Typography variant="subtitle2" color="textSecondary">
              Balance: {balanceLabel}
            </Typography>
          </div>
        ) : null}
      </Box>
      <Grid container alignItems="center">
        <Grid item xs={5}>
          <NetworkSelector network={selectedNetwork} setNetwork={onNetworkChange} />
        </Grid>
        <Grid item xs={7}>
          <LargeTextField
            value={value}
            onChange={handleInputChange}
            placeholder="0.0"
            units={token?.symbol}
            disabled={disableInput}
            loadingValue={loadingValue}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default SendAmountSelectorCard
