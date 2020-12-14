import React, { FC, ChangeEvent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import MenuItem from '@material-ui/core/MenuItem'
import AmountSelectorCard from 'src/pages/Pools/AmountSelectorCard'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import { usePools } from 'src/pages/Pools/PoolsContext'
import SendButton from 'src/pages/Pools/SendButton'

const useStyles = makeStyles(() => ({
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
    marginBottom: '4.2rem'
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
    display: 'flex',
    flexDirection: 'column'
  },
  poolPositionCard: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  poolPosition: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}))

const Pools: FC = () => {
  const styles = useStyles()
  let {
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
    token1Deposited
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

  const handleToken0Change = async (event: ChangeEvent<{ value: unknown }>) => {
    const token0Value = event.target.value as string
    if (!token0Value) {
      setToken0Amount('')
      setToken1Amount('')
      return
    }

    setToken0Amount(token0Value)
    const token1Value = Number(token0Value) * Number(token1Rate)
    setToken1Amount(token1Value.toFixed(2))
  }

  const handleToken1Change = async (event: ChangeEvent<{ value: unknown }>) => {
    const token1Value = event.target.value as string
    if (!token1Value) {
      setToken0Amount('')
      setToken1Amount('')
      return
    }

    setToken1Amount(token1Value)
    const token0Value = Number(token1Value) / Number(token1Rate)
    setToken0Amount(token0Value.toFixed(2))
  }

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
              {token.symbol}
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
              {network.name}
            </MenuItem>
          ))}
        </RaisedSelect>
      </Box>
      <Box display="flex" alignItems="center">
        <AmountSelectorCard
          label="Input"
          title={`${selectedNetwork?.name} ${selectedToken?.symbol}`}
          token={selectedToken}
          value={token0Amount}
          onChange={handleToken0Change}
          selectedNetwork={selectedNetwork}
        />
      </Box>
      <Box display="flex" alignItems="center">
        <div className={styles.plusDivider}>+</div>
      </Box>
      <Box display="flex" alignItems="center">
        <AmountSelectorCard
          label="Input"
          title={`Hop ${selectedToken?.symbol}`}
          token={hopToken}
          value={token1Amount}
          onChange={handleToken1Change}
          selectedNetwork={selectedNetwork}
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
              {token0Price}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              component="div"
            >
              {hopToken?.symbol} per{' '}
              <small>{selectedNetwork?.slug.substr(0, 3)}</small>
              {selectedToken?.symbol}
            </Typography>
          </Box>
          <Box alignItems="center" className={styles.priceBox}>
            <Typography variant="subtitle1" color="textSecondary">
              {token1Price}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              component="div"
            >
              <small>{selectedNetwork?.slug.substr(0, 3)}</small>
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
                {poolSharePercentage}%
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
      {userPoolBalance && (
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
            {userPoolBalance && (
              <Box alignItems="center" className={styles.poolPosition}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  component="div"
                >
                  <small>{selectedNetwork?.slug.substr(0, 3)}</small>
                  {selectedToken?.symbol}/{hopToken?.symbol}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  component="div"
                >
                  {userPoolBalance}
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
                  {userPoolTokenPercentage}%
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
                  {token0Deposited}
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
                  {token1Deposited}
                </Typography>
              </Box>
            )}
          </Card>
        </Box>
      )}
      <SendButton />
    </Box>
  )
}

export default Pools
