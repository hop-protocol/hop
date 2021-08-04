import React, { FC, ChangeEvent } from 'react'
import { BigNumber } from 'ethers'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import MuiButton from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import MenuItem from '@material-ui/core/MenuItem'
import { useApp } from 'src/contexts/AppContext'
import Alert from 'src/components/alert/Alert'
import AmountSelectorCard from 'src/components/AmountSelectorCard'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import SelectOption from 'src/components/selects/SelectOption'
import { usePools } from 'src/pages/Pools/PoolsContext'
import SendButton from 'src/pages/Pools/SendButton'
import { commafy, normalizeNumberInput } from 'src/utils'

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: '4.2rem'
  },
  plusDivider: {
    textAlign: 'center',
    width: '100%',
    height: '2.4rem',
    margin: '2.2rem',
    fontSize: '2rem',
    opacity: '0.5'
  },
  pricesBox: {
    width: '51.6rem',
    marginTop: '4.2rem',
    marginBottom: '4.2rem',
    [theme.breakpoints.down('xs')]: {
      width: '95%'
    }
  },
  priceBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  pricesCard: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  sendButton: {
    marginTop: '6.4rem',
    width: '30.0rem'
  },
  tokenSelector: {
    marginBottom: '4.4rem'
  },
  textSpacing: {
    padding: '0 1rem'
  },
  poolPositionBox: {
    width: '45.6rem',
    marginBottom: '5.4rem',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      width: '85%'
    }
  },
  poolPositionCard: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  poolPosition: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  removeLiquidityButton: {
    marginTop: '2rem',
    fontSize: '1.5rem',
    opacity: 0.5
  }
}))

const Pools: FC = () => {
  const styles = useStyles()
  const {
    bridges,
    selectedBridge,
    setSelectedBridge
  } = useApp()
  const {
    networks,
    canonicalToken,
    hopToken,
    selectedNetwork,
    setSelectedNetwork,
    token0Amount,
    setToken0Amount,
    token1Amount,
    setToken1Amount,
    poolSharePercentage,
    token0Price,
    token1Price,
    token1Rate,
    userPoolBalance,
    userPoolTokenPercentage,
    token0Deposited,
    token1Deposited,
    canonicalBalance,
    hopBalance,
    loadingCanonicalBalance,
    loadingHopBalance,
    error,
    setError,
    removeLiquidity
  } = usePools()

  const handleBridgeChange = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value as string
    const bridge = bridges.find(bridge => bridge.getTokenSymbol() === tokenSymbol)
    if (bridge) {
      setSelectedBridge(bridge)
    }
  }

  const handleNetworkSelect = (event: ChangeEvent<{ value: unknown }>) => {
    const networkName = event.target.value
    const newSelectedNetwork = networks.find(
      network => network.slug === networkName
    )
    if (newSelectedNetwork) {
      setSelectedNetwork(newSelectedNetwork)
    }
  }

  const handleToken0Change = async (value: string) => {
    const token0Value = normalizeNumberInput(value)
    if (!token0Value) {
      setToken0Amount('')
      return
    }

    setToken0Amount(token0Value)
  }

  const handleToken1Change = async (value: string) => {
    const token1Value = normalizeNumberInput(value)
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

  const hasBalance = !!Number(userPoolBalance)

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="h4" className={styles.title}>
          Add Liquidity
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" className={styles.tokenSelector}>
        <RaisedSelect
          value={selectedBridge?.getTokenSymbol()}
          onChange={handleBridgeChange}
        >
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
        <Typography
          variant="body1"
          component="span"
          className={styles.textSpacing}
        >
          on
        </Typography>
        <RaisedSelect
          value={selectedNetwork?.slug}
          onChange={handleNetworkSelect}
        >
          {networks.map(network => (
            <MenuItem value={network.slug} key={network.slug}>
              <SelectOption
                value={network.slug}
                icon={network.imageUrl}
                label={network.name}
              />
            </MenuItem>
          ))}
        </RaisedSelect>
      </Box>
      <Box display="flex" alignItems="center">
        <AmountSelectorCard
          value={token0Amount}
          token={canonicalToken}
          label="Input"
          onChange={handleToken0Change}
          title={`${selectedNetwork?.name} ${canonicalToken?.symbol}`}
          balance={canonicalBalance}
          loadingBalance={loadingCanonicalBalance}
        />
      </Box>
      <Box display="flex" alignItems="center">
        <div className={styles.plusDivider}>+</div>
      </Box>
      <Box display="flex" alignItems="center">
        <AmountSelectorCard
          value={token1Amount}
          token={hopToken}
          label="Input"
          onChange={handleToken1Change}
          title={hopToken?.name}
          balance={hopBalance}
          loadingBalance={loadingHopBalance}
        />
      </Box>
      <Box alignItems="center" className={styles.pricesBox}>
        <Card className={styles.pricesCard}>
          <Box alignItems="center" className={styles.priceBox}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              component="div"
            >
              {commafy(token0Price, 5)}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              component="div"
            >
              {hopToken?.symbol} per {canonicalToken?.symbol}
            </Typography>
          </Box>
          <Box alignItems="center" className={styles.priceBox}>
            <Typography variant="subtitle1" color="textSecondary">
              {commafy(token1Price, 5)}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              component="div"
            >
              {canonicalToken?.symbol} per {hopToken?.symbol}
            </Typography>
          </Box>
          {poolSharePercentage && (
            <Box alignItems="center" className={styles.priceBox}>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                component="div"
              >
                {commafy(poolSharePercentage)}%
              </Typography>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                component="div"
              >
                Share of pool
              </Typography>
            </Box>
          )}
        </Card>
      </Box>
      {hasBalance && (
        <Box alignItems="center" className={styles.poolPositionBox}>
          <Card className={styles.poolPositionCard}>
            <Box alignItems="center" className={styles.poolPosition}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                component="div"
              >
                Your position
              </Typography>
            </Box>
            {hasBalance && (
              <Box alignItems="center" className={styles.poolPosition}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  component="div"
                >
                  {canonicalToken?.symbol}/{hopToken?.symbol}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  component="div"
                >
                  {commafy(userPoolBalance, 5)}
                </Typography>
              </Box>
            )}
            {userPoolTokenPercentage && (
              <Box alignItems="center" className={styles.poolPosition}>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  component="div"
                >
                  Your pool share:
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  component="div"
                >
                  {commafy(userPoolTokenPercentage)}%
                </Typography>
              </Box>
            )}
            {token0Deposited && (
              <Box alignItems="center" className={styles.poolPosition}>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  component="div"
                >
                  {canonicalToken?.symbol}:
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  component="div"
                >
                  {commafy(token0Deposited, 5)}
                </Typography>
              </Box>
            )}
            {token1Deposited && (
              <Box alignItems="center" className={styles.poolPosition}>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  component="div"
                >
                  {hopToken?.symbol}:
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  component="div"
                >
                  {commafy(token1Deposited, 5)}
                </Typography>
              </Box>
            )}
          </Card>
        </Box>
      )}
      <Alert severity="error" onClose={() => setError(null)} text={error} />
      <SendButton />
      {hasBalance && (
        <MuiButton
          className={styles.removeLiquidityButton}
          onClick={handleRemoveLiquidityClick}
        >
          Remove Liquidity
        </MuiButton>
      )}
    </Box>
  )
}

export default Pools
