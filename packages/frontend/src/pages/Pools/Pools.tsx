import React, { FC, ChangeEvent, useEffect } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from 'src/components/buttons/Button'
import Box from '@material-ui/core/Box'
import MenuItem from '@material-ui/core/MenuItem'
import { useApp } from 'src/contexts/AppContext'
import Alert from 'src/components/alert/Alert'
import AmountSelectorCard from 'src/components/AmountSelectorCard'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import SelectOption from 'src/components/selects/SelectOption'
import { usePools } from 'src/pages/Pools/PoolsContext'
import SendButton from 'src/pages/Pools/SendButton'
import {
  commafy,
  findMatchingBridge,
  sanitizeNumericalString,
  toPercentDisplay,
  toTokenDisplay,
} from 'src/utils'
import TokenWrapper from 'src/components/TokenWrapper'
import DetailRow from 'src/components/DetailRow'
import { useNeedsTokenForFee } from 'src/hooks'
import { Div, Flex } from 'src/components/ui'
import { ButtonsWrapper } from 'src/components/buttons/ButtonsWrapper'
import { RaisedNetworkSelector } from 'src/components/NetworkSelector/RaisedNetworkSelector'

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: '4.2rem',
  },
  plusDivider: {
    textAlign: 'center',
    width: '100%',
    height: '2.4rem',
    margin: '2.2rem',
    fontSize: '2rem',
    opacity: '0.5',
  },
  sendButton: {
    marginTop: '6.4rem',
    width: '30.0rem',
  },
  tokenSelector: {
    marginBottom: '4.4rem',
  },
  textSpacing: {
    padding: '0 1rem',
  },
  formBox: {
    marginBottom: '3.4rem',
  },
  flexBox: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  removeLiquidityButton: {
    marginTop: '2rem',
  },
  details: {
    width: '100%',
    marginBottom: '3.4rem',
    [theme.breakpoints.down('xs')]: {},
  },
  detailsDropdown: {
    width: '100%',
    marginTop: '2rem',
    '&[open] summary span::before': {
      content: '"▾"',
    },
  },
  detailsDropdownSummary: {
    listStyle: 'none',
    display: 'block',
    fontWeight: 'normal',
    '&::marker': {
      display: 'none',
    },
  },
  detailsDropdownLabel: {
    position: 'relative',
    cursor: 'pointer',
    width: 'auto',
    '& > span': {
      position: 'relative',
      display: 'inline-flex',
      justifyItems: 'center',
      alignItems: 'center',
    },
    '& > span::before': {
      display: 'block',
      content: '"▸"',
      position: 'absolute',
      top: '0',
      right: '-1.5rem',
    },
  },
}))

const Pools: FC = () => {
  const styles = useStyles()
  const { bridges, selectedBridge, setSelectedBridge } = useApp()
  const {
    apr,
    canonicalBalance,
    canonicalToken,
    error,
    fee,
    hopBalance,
    hopToken,
    loadingCanonicalBalance,
    loadingHopBalance,
    networks,
    poolReserves,
    poolSharePercentage,
    priceImpact,
    removeLiquidity,
    removing,
    reserveTotalsUsd,
    selectedNetwork,
    selectBothNetworks,
    setError,
    setToken0Amount,
    setToken1Amount,
    setWarning,
    token0Amount,
    token0Deposited,
    token1Amount,
    token1Deposited,
    tokenSumDeposited,
    unsupportedAsset,
    userPoolBalance,
    userPoolBalanceFormatted,
    userPoolTokenPercentage,
    virtualPrice,
    warning,
  } = usePools()

  const handleBridgeChange = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value as string
    const bridge = findMatchingBridge(bridges, tokenSymbol)
    if (bridge) {
      setSelectedBridge(bridge)
    }
  }

  const handleToken0Change = async (value: string) => {
    const token0Value = sanitizeNumericalString(value)
    if (!token0Value) {
      setToken0Amount('')
      return
    }

    setToken0Amount(token0Value)
  }

  const handleToken1Change = async (value: string) => {
    const token1Value = sanitizeNumericalString(value)
    if (!token1Value) {
      setToken1Amount('')
      return
    }

    setToken1Amount(token1Value)
  }

  const handleRemoveLiquidityClick = (event: any) => {
    event.preventDefault()
    removeLiquidity()
  }

  const hasBalance = userPoolBalance?.gt(0)
  const canonicalTokenSymbol = canonicalToken?.symbol || ''
  const hopTokenSymbol = hopToken?.symbol || ''

  const reserve0 = toTokenDisplay(poolReserves?.[0], canonicalToken?.decimals)
  const reserve1 = toTokenDisplay(poolReserves?.[1], canonicalToken?.decimals)
  const reserve0Formatted = `${commafy(reserve0, 0) || '-'} ${canonicalTokenSymbol}`
  const reserve1Formatted = `${commafy(reserve1, 0) || '-'} ${hopTokenSymbol}`
  const feeFormatted = `${fee ? Number((fee * 100).toFixed(2)) : '-'}%`
  const aprFormatted = toPercentDisplay(apr)
  const priceImpactLabel = Number(priceImpact) > 0 ? 'Bonus' : 'Price Impact'
  const priceImpactFormatted = priceImpact ? `${Number((priceImpact * 100).toFixed(4))}%` : ''
  const poolSharePercentageFormatted = poolSharePercentage ? `${commafy(poolSharePercentage)}%` : ''
  const virtualPriceFormatted = virtualPrice ? `${Number(virtualPrice.toFixed(4))}` : ''
  const reserveTotalsUsdFormatted = `$${reserveTotalsUsd ? commafy(reserveTotalsUsd, 2) : '-'}`

  const needsTokenForFee = useNeedsTokenForFee(selectedNetwork)
  const token0DepositedFormatted = token0Deposited
    ? commafy(Number(formatUnits(token0Deposited, canonicalToken?.decimals)), 5)
    : ''
  const token1DepositedFormatted = token1Deposited
    ? commafy(Number(formatUnits(token1Deposited, hopToken?.decimals)), 5)
    : ''
  const tokenSumDepositedFormatted = tokenSumDeposited
    ? commafy(Number(formatUnits(tokenSumDeposited, hopToken?.decimals)), 5)
    : ''

  useEffect(() => {
    if (needsTokenForFee && selectedNetwork) {
      setWarning(
        `Add ${selectedNetwork.nativeTokenSymbol} to your account on ${selectedNetwork.name} for the transaction fee.`
      )
    } else {
      setWarning('')
    }
  }, [needsTokenForFee, selectedNetwork])

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="h4" className={styles.title}>
          Add Liquidity
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" className={styles.tokenSelector}>
        <RaisedSelect value={selectedBridge?.getTokenSymbol()} onChange={handleBridgeChange}>
          {bridges.map(bridge => (
            <MenuItem value={bridge.getTokenSymbol()} key={bridge.getTokenSymbol()}>
              <SelectOption
                value={bridge.getTokenSymbol()}
                icon={bridge.getTokenImage()}
                label={bridge.getTokenSymbol()}
              />
            </MenuItem>
          ))}
        </RaisedSelect>
        <Typography variant="body1" component="span" className={styles.textSpacing}>
          on
        </Typography>
        <RaisedNetworkSelector
          selectedNetwork={selectedNetwork}
          onSelect={selectBothNetworks}
          availableNetworks={networks}
        />
      </Box>

      {unsupportedAsset ? (
        <>
          <Typography variant="subtitle1" color="textSecondary" component="div">
            {error}
          </Typography>
        </>
      ) : (
        <Flex alignCenter column>
          <Flex mb="3.4rem" alignCenter justifyCenter column>
            <TokenWrapper network={selectedNetwork} />

            <Flex alignCenter fullWidth mt={3}>
              <AmountSelectorCard
                value={token0Amount}
                token={canonicalToken}
                label="Input"
                onChange={handleToken0Change}
                title={`${selectedNetwork?.name} ${canonicalTokenSymbol}`}
                balance={canonicalBalance}
                loadingBalance={loadingCanonicalBalance}
              />
            </Flex>

            <Flex alignCenter fullWidth>
              <div className={styles.plusDivider}>+</div>
            </Flex>

            <Flex alignCenter fullWidth>
              <AmountSelectorCard
                value={token1Amount}
                token={hopToken}
                label="Input"
                onChange={handleToken1Change}
                title={hopToken?.name}
                balance={hopBalance}
                loadingBalance={loadingHopBalance}
              />
            </Flex>
          </Flex>

          <Flex column fullWidth>
            <DetailRow
              title={priceImpactLabel}
              tooltip="Depositing underpooled assets will give you bonus LP tokens. Depositing overpooled assets will give you less LP tokens."
              value={`${priceImpactFormatted}`}
            />
            <DetailRow title={'Share of pool'} value={poolSharePercentageFormatted} />
          </Flex>

          {hasBalance && (
            <Flex column fullWidth mt={3}>
              <Box alignItems="center" className={styles.flexBox}>
                <Typography variant="subtitle1" color="textSecondary" component="div">
                  Your Position
                </Typography>
              </Box>
              <DetailRow title={`LP Tokens`} value={`${commafy(userPoolBalanceFormatted, 5)}`} />
              {userPoolTokenPercentage && (
                <DetailRow title={'Pool share'} value={`${commafy(userPoolTokenPercentage)}%`} />
              )}
              {token0Deposited && (
                <DetailRow title={canonicalTokenSymbol} value={token0DepositedFormatted} />
              )}
              {token1Deposited && (
                <DetailRow title={hopTokenSymbol} value={token1DepositedFormatted} />
              )}
              {tokenSumDeposited && (
                <DetailRow
                  title={`${canonicalTokenSymbol}+${hopTokenSymbol}`}
                  value={tokenSumDepositedFormatted}
                />
              )}
            </Flex>
          )}
          <details open className={styles.detailsDropdown}>
            <summary className={styles.detailsDropdownSummary}>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                component="div"
                className={styles.detailsDropdownLabel}
              >
                <span>Pool Stats</span>
              </Typography>
            </summary>

            <Flex column fullWidth>
              <DetailRow
                title="APR"
                tooltip="Annual Percentage Rate (APR) from earning fees, based on 24hr trading volume"
                value={`${aprFormatted}`}
              />
              <DetailRow
                title="Reserves"
                tooltip={`AMM pool reserve totals, consisting of total ${canonicalTokenSymbol} + ${hopTokenSymbol}`}
                value={`${reserve0Formatted} / ${reserve1Formatted}`}
              />
              <DetailRow
                title="TVL"
                tooltip="Total value locked in USD"
                value={`${reserveTotalsUsdFormatted}`}
              />
              <DetailRow
                title="Virtual Price"
                tooltip="The virtual price, to help calculate profit. Virtual price is calculated as `pool_reserves / lp_supply`"
                value={`${virtualPriceFormatted}`}
              />
              <DetailRow
                title="Fee"
                tooltip={`Each trade has a ${feeFormatted} fee that goes to liquidity providers`}
                value={`${feeFormatted}`}
              />
            </Flex>
          </details>

          <Alert severity="warning">{warning}</Alert>
          <Alert severity="error" onClose={() => setError(null)} text={error} />

          <ButtonsWrapper>
            <Div mt={4}>
              <SendButton />

              {hasBalance && (
                <Button
                  className={styles.removeLiquidityButton}
                  onClick={handleRemoveLiquidityClick}
                  loading={removing}
                  large
                  fullWidth
                >
                  Remove Liquidity
                </Button>
              )}
            </Div>
          </ButtonsWrapper>
        </Flex>
      )}
    </Box>
  )
}

export default Pools
