import React, { FC, ChangeEvent } from 'react'
import { BigNumber } from 'ethers'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import MuiButton from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import MenuItem from '@material-ui/core/MenuItem'
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
    networks,
    tokens,
    hopToken,
    selectedToken,
    setSelectedToken,
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
    // setToken0Balance,
    // setToken1Balance,
    error,
    setError,
    removeLiquidity
  } = usePools()

  const handleTokenSelect = (event: ChangeEvent<{ value: unknown }>) => {
    const tokenSymbol = event.target.value as string
    const newSelectedToken = tokens.find(token => token.symbol === tokenSymbol)
    if (newSelectedToken) {
      setSelectedToken(newSelectedToken)
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
      setToken1Amount('')
      return
    }

    setToken0Amount(token0Value)
    if (token1Rate) {
      const token1Value = Number(token0Value) * Number(token1Rate)
      setToken1Amount(token1Value.toFixed(2))
    }
  }

  const handleToken1Change = async (value: string) => {
    const token1Value = normalizeNumberInput(value)
    if (!token1Value) {
      setToken0Amount('')
      setToken1Amount('')
      return
    }

    setToken1Amount(token1Value)
    if (token1Rate) {
      const token0Value = Number(token1Value) / Number(token1Rate)
      setToken0Amount(token0Value.toFixed(2))
    }
  }

  // const handleToken0BalanceChange = (balance: number) => {
  //   setToken0Balance(balance)
  // }

  // const handleToken1BalanceChange = (balance: number) => {
  //   setToken1Balance(balance)
  // }

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
          value={selectedToken?.symbol}
          onChange={handleTokenSelect}
        >
          {tokens.map(token => (
            <MenuItem value={token.symbol} key={token.symbol}>
              <SelectOption
                value={token.symbol}
                icon={token.imageUrl}
                label={token.symbol}
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
          token={selectedToken}
          label="Input"
          onChange={handleToken0Change}
          title={`${selectedNetwork?.name} ${selectedToken?.symbol}`}
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
          title={`Hop ${selectedToken?.symbol}`}
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
              {hopToken?.symbol} per {selectedToken?.symbol}
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
              {selectedToken?.symbol} per {hopToken?.symbol}
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
                  {selectedToken?.symbol}/{hopToken?.symbol}
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
                  {selectedToken?.symbol}:
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
