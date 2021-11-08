import React, { useMemo, FC, ChangeEvent, useEffect } from 'react'
import { BigNumber, utils } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Skeleton from '@material-ui/lab/Skeleton'
import { Token } from '@hop-protocol/sdk'
import LargeTextField from 'src/components/LargeTextField'
import FlatSelect from 'src/components/selects/FlatSelect'
import Network from 'src/models/Network'
import { toTokenDisplay } from 'src/utils'
import { useApp } from 'src/contexts/AppContext'
import { ZERO_ADDRESS } from 'src/constants'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import { useNativeTokenMaxValue } from 'src/hooks'

const useStyles = makeStyles(theme => ({
  root: {
    width: '51.6rem',
    boxSizing: 'border-box',
    [theme.breakpoints.down('xs')]: {
      width: 'auto',
    },
  },
  topRow: {
    marginBottom: '1.8rem',
  },
  networkSelectionBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultLabel: {
    height: '3.8rem',
    marginLeft: '1.2rem',
  },
  networkLabel: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '0.4rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  networkIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '4rem',
    height: '4rem',
  },
  networkIcon: {
    display: 'flex',
    height: '2.2rem',
    margin: '0.7rem',
  },
  balance: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  maxButton: {
    border: 'none',
    background: '#f8f8f9',
    borderRadius: '1rem',
    padding: '0.5rem 1rem',
    fontSize: '1.2rem',
    marginRight: '1rem',
    cursor: 'pointer',
  },
}))

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
  const styles = useStyles()

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
          <FlatSelect
            value={selectedNetwork?.slug || 'default'}
            onChange={event => {
              const network = networkOptions.find(_network => _network.slug === event.target.value)
              onNetworkChange(network)
            }}
          >
            <MenuItem value="default">
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                className={styles.defaultLabel}
              >
                <Typography variant="subtitle2" className={styles.networkLabel}>
                  Select Network
                </Typography>
              </Box>
            </MenuItem>
            {networkOptions.map(network => (
              <MenuItem value={network.slug} key={network.slug}>
                <Box className={styles.networkSelectionBox}>
                  <Box className={styles.networkIconContainer}>
                    <img src={network.imageUrl} className={styles.networkIcon} alt={network.name} />
                  </Box>
                  <Typography variant="subtitle2" className={styles.networkLabel}>
                    {network.name}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </FlatSelect>
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
