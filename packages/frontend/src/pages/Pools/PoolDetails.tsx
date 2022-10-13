import React, { useState, ChangeEvent } from 'react'
import { usePool } from './PoolsContext'
import Box from '@material-ui/core/Box'
import { useParams } from 'react-router'
import { PoolRow } from './PoolRow'
import Alert from 'src/components/alert/Alert'
import Button from 'src/components/buttons/Button'
import { useThemeMode } from 'src/theme/ThemeProvider'
import { Link, useLocation, useHistory } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import MuiLink from '@material-ui/core/Link'
import ArrowLeft from '@material-ui/icons/ChevronLeft'
import LaunchIcon from '@material-ui/icons/Launch'
import { DinoGame } from './DinoGame'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Skeleton from '@material-ui/lab/Skeleton'
import { InputField } from './InputField'
import InfoTooltip from 'src/components/InfoTooltip'
import {
  commafy,
  findMatchingBridge,
  sanitizeNumericalString,
  toPercentDisplay,
  toTokenDisplay,
} from 'src/utils'

export const useStyles = makeStyles(theme => ({
  backLink: {
    cursor: 'pointer',
    textDecoration: 'none'
  },
  imageContainer: {
    position: 'relative'
  },
  tokenImage: {
    width: '54px'
  },
  chainImage: {
    width: '28px',
    position: 'absolute',
    top: '-5px',
    left: '-5px'
  },
  topBox: {
    background: theme.palette.type === 'dark' ? '#0000003d' : '#fff',
    borderRadius: '3rem',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      marginBottom: '1rem',
      marginLeft: 0,
      width: '90%'
    },
  },
  topBoxes: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
  },
  poolStats: {
    boxShadow: theme.boxShadow.inner,
    transition: 'all 0.15s ease-out',
    borderRadius: '3rem'
  },
  poolStatBoxes: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
  },
  poolDetails: {
    boxShadow: theme.boxShadow.inner,
    transition: 'all 0.15s ease-out',
    borderRadius: '3rem',
    [theme.breakpoints.down('xs')]: {
      padding: 0
    },
  },
  poolDetailsBoxes: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
  },
  poolDetailsBox: {
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
  },
}))

function PoolEmptyState() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
      <Box>
        <DinoGame />
      </Box>
      <Box p={2}>
        <Box display="flex" justifyContent="center">
          <Typography variant="h5">
            Add liquidity to earn
          </Typography>
        </Box>
      </Box>
      <Box pl={2} pr={2} mb={2} display="flex" justifyContent="center" textAlign="center">
        <Typography variant="body1">
            You can deposit a single asset or both assets in any ratio you like. The pool will automatically handle the conversion for you.
        </Typography>
      </Box>
      <Box mb={2} display="flex" justifyContent="center">
        <Typography variant="body1">
          <MuiLink target="_blank" rel="noopener noreferrer" href="https://help.hop.exchange/hc/en-us/articles/4406095303565-What-do-I-need-in-order-to-provide-liquidity-on-Hop-" >
            <Box display="flex" justifyContent="center" alignItems="center">
              Learn more <Box ml={1} display="flex" justifyContent="center" alignItems="center"><LaunchIcon /></Box>
            </Box>
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  )
}

function AccountPosition(props: any) {
  const {
    hopTokenSymbol,
    canonicalTokenSymbol,
    token0DepositedFormatted,
    token1DepositedFormatted,
    userPoolBalanceFormatted,
    userPoolTokenPercentageFormatted,
    userPoolBalanceUsdFormatted
  } = props.data

  return (
    <Box>
      <Box mb={4}>
        <Box mb={1}>
          <Typography variant="subtitle1" color="secondary">
            <Box display="flex" alignItems="center">
              Balance <InfoTooltip title="USD value of current position in this pool" />
            </Box>
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="h4">
            {userPoolBalanceUsdFormatted}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="secondary">
            {token0DepositedFormatted} {canonicalTokenSymbol} + {token1DepositedFormatted} {hopTokenSymbol}
          </Typography>
        </Box>
      </Box>
      <Box maxWidth="300px">
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Box mb={1}>
              <Typography variant="subtitle1" color="secondary">
                <Box display="flex" alignItems="center">
                  LP Balance <InfoTooltip title="Liquidity provider (LP) tokens this account has for depositing into pool" />
                </Box>
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">
                {userPoolBalanceFormatted}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box mb={1}>
              <Typography variant="subtitle1" color="secondary">
                <Box display="flex" alignItems="center">
                  Share of Pool <InfoTooltip title="Share of pool percentage for account" />
                </Box>
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">
                {userPoolTokenPercentageFormatted}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function DepositForm(props: any) {
  const {
    token0Symbol,
    token1Symbol,
    token0ImageUrl,
    token1ImageUrl,
    balance0Formatted,
    balance1Formatted,
    token0Amount,
    token1Amount,
    setToken0Amount,
    setToken1Amount,
    addLiquidity,
    priceImpactFormatted,
    depositAmountTotalDisplayFormatted
  } = props.data

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

  function handleClick (event: any) {
    event.preventDefault()
    addLiquidity()
  }

  return (
    <Box>
      <Box mb={4}>
        <Box mb={1} display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="secondary">
              <MuiLink><strong>Wrap/Unwrap token</strong></MuiLink>
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="secondary">
              <strong>Balance: {balance0Formatted}</strong>
            </Typography>
          </Box>
        </Box>
        <Box mb={1}>
          <InputField
            tokenSymbol={token0Symbol}
            tokenImageUrl={token0ImageUrl}
            value={token0Amount}
            onChange={handleToken0Change}
          />
        </Box>
        <Box display="flex" justifyContent="center">
          <Typography variant="h6" color="secondary">
          +
          </Typography>
        </Box>
        <Box mb={1} display="flex" justifyContent="flex-end">
          <Typography variant="body2" color="secondary">
            <strong>Balance: {balance1Formatted}</strong>
          </Typography>
        </Box>
        <Box mb={1}>
          <InputField
            tokenSymbol={token1Symbol}
            tokenImageUrl={token1ImageUrl}
            value={token1Amount}
            onChange={handleToken1Change}
          />
        </Box>
      </Box>
      <Box margin="0 auto" width="90%">
        <Box mb={1} display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle2">
              <Box display="flex" alignItems="center">
                Price Impact <InfoTooltip title="Depositing underpooled assets will give you bonus LP tokens. Depositing overpooled assets will give you less LP tokens." />
              </Box>
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">
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
        <Button highlighted fullWidth onClick={handleClick}>
          Preview
        </Button>
      </Box>
    </Box>
  )
}

function WithdrawForm() {
  return (
    <Box>
      <Typography>
        Withdraw form comming soon
      </Typography>
    </Box>
  )
}

function StakeForm() {
  return (
    <Box>
      <Typography>
        Stake form comming soon
      </Typography>
    </Box>
  )
}

function PoolStats (props:any) {
  const styles = useStyles()
  const {
    poolName,
    canonicalTokenSymbol,
    hopTokenSymbol,
    reserve0Formatted,
    reserve1Formatted,
    lpTokenTotalSupplyFormatted,
    feeFormatted,
    virtualPriceFormatted
  } = props.data

  return (
    <Box p={4} className={styles.poolStats}>
      <Box mb={4}>
        <Typography variant="h5">
          {poolName} Info
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" className={styles.poolStatBoxes}>
        <Box width="100%">
          <Box mb={1}>
            <Typography variant="subtitle2" color="secondary">
              <Box display="flex" alignItems="center">
                {canonicalTokenSymbol} Reserves <InfoTooltip title="Total amount of canonical tokens in pool" />
              </Box>
            </Typography>
          </Box>
          <Typography variant="subtitle2">
            {reserve0Formatted}
          </Typography>
        </Box>
        <Box width="100%">
          <Box mb={1}>
            <Typography variant="subtitle2" color="secondary">
              <Box display="flex" alignItems="center">
                {hopTokenSymbol} Reserves <InfoTooltip title="Total amount of h-tokens in pool" />
              </Box>
            </Typography>
          </Box>
          <Typography variant="subtitle2">
            {reserve1Formatted}
          </Typography>
        </Box>
        <Box width="100%">
          <Box mb={1}>
            <Typography variant="subtitle2" color="secondary">
              <Box display="flex" alignItems="center">
                LP Tokens <InfoTooltip title="Total supply of liquidity provider (LP) tokens for pool" />
              </Box>
            </Typography>
          </Box>
          <Typography variant="subtitle2">
            {lpTokenTotalSupplyFormatted}
          </Typography>
        </Box>
        <Box width="100%">
          <Box mb={1}>
            <Typography variant="subtitle2" color="secondary">
              <Box display="flex" alignItems="center">
                Fee <InfoTooltip title="Each trade has this fee percentage that goes to liquidity providers" />
              </Box>
            </Typography>
          </Box>
          <Typography variant="subtitle2">
            {feeFormatted}
          </Typography>
        </Box>
        <Box width="100%">
          <Box mb={1}>
            <Typography variant="subtitle2" color="secondary">
              <Box display="flex" alignItems="center">
                Virtual Price <InfoTooltip title="The virtual price, to help calculate profit. Virtual price is calculated as `pool_reserves / lp_supply`" />
              </Box>
            </Typography>
          </Box>
          <Typography variant="subtitle2">
            {virtualPriceFormatted}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export function PoolDetails () {
  const styles = useStyles()
  const {
    aprFormatted,
    reserveTotalsUsdFormatted,
    canonicalTokenSymbol,
    hopTokenSymbol,
    reserve0Formatted,
    reserve1Formatted,
    lpTokenTotalSupplyFormatted,
    feeFormatted,
    virtualPriceFormatted,
    poolName,
    tokenImageUrl,
    chainImageUrl,
    tokenSymbol,
    chainName,
    userPoolBalance,
    userPoolBalanceFormatted,
    userPoolTokenPercentageFormatted,
    hasBalance,
    token0DepositedFormatted,
    token1DepositedFormatted,
    userPoolBalanceUsdFormatted,
    loading,
    setToken0Amount,
    token0Amount,
    setToken1Amount,
    token1Amount,
    canonicalToken,
    hopToken,
    token0BalanceFormatted,
    token1BalanceFormatted,
    warning,
    error,
    setError,
    addLiquidity,
    priceImpactFormatted,
    depositAmountTotalDisplayFormatted
  } = usePool()
  const tvlFormatted = reserveTotalsUsdFormatted
  const volume24hFormatted = '-'
  const { pathname, search } = useLocation()
  const history = useHistory()
  const { tab } = useParams<{ tab: string }>()
  const [selectedTab, setSelectedTab] = useState(tab || 'deposit')
  const { theme } = useThemeMode()

  function handleTabChange(event: ChangeEvent<{}>, newValue: string) {
    history.push({
      pathname: `/pool/${newValue}`,
      search,
    })
    setSelectedTab(newValue)
  }

  return (
    <Box maxWidth={"900px"} m={"0 auto"}>
      <Box mb={4} display="flex" alignItems="center">
        <Box display="flex" alignItems="center">
          <Link to={'/pools'} className={styles.backLink}>
            <IconButton>
              <ArrowLeft fontSize={'large'} />
            </IconButton>
          </Link>
        </Box>
        <Box display="flex">
          <Box mr={2}>
            <Box className={styles.imageContainer}>
              <img className={styles.chainImage} src={chainImageUrl} alt={chainName} title={chainName} />
              <img className={styles.tokenImage} src={tokenImageUrl} alt={tokenSymbol} title={tokenSymbol} />
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="h4">
              {poolName}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box mb={4} p={1} display="flex" justifyContent="space-between" className={styles.topBoxes}>
        <Box mr={1} p={2} display="flex" flexDirection="column" className={styles.topBox}>
          <Box mb={2}>
            <Typography variant="subtitle1" color="secondary">
              <Box display="flex" alignItems="center">
                TVL <InfoTooltip title="Total value locked in USD" />
              </Box>
            </Typography>
          </Box>
          <Typography variant="h5">
            {tvlFormatted}
          </Typography>
        </Box>
        <Box ml={1} mr={1} p={2} display="flex" flexDirection="column" className={styles.topBox}>
          <Box mb={2}>
            <Typography variant="subtitle1" color="secondary">
              <Box display="flex" alignItems="center">
                24hr Volume <InfoTooltip title="Total volume in AMM in last 24 hours" />
              </Box>
            </Typography>
          </Box>
          <Typography variant="h5">
            {volume24hFormatted}
          </Typography>
        </Box>
        <Box ml={1} p={2} display="flex" flexDirection="column" className={styles.topBox}>
          <Box mb={2}>
            <Typography variant="subtitle1" color="secondary">
              <Box display="flex" alignItems="center">
                APR <InfoTooltip title="Annual Percentage Rate (APR) from earning fees, based on 24hr trading volume" />
              </Box>
            </Typography>
          </Box>
          <Typography variant="h5">
            {aprFormatted}
          </Typography>
        </Box>
      </Box>
      <Box mb={4}>
        <Box p={4} className={styles.poolDetails}>
          <Box p={2} display="flex" className={styles.poolDetailsBoxes}>
            <Box p={2} width="50%" display="flex" flexDirection="column" className={styles.poolDetailsBox}>
              <Box mb={4}>
                <Typography variant="h4">
                  My Liquidity
                </Typography>
              </Box>
              {loading && (
                <Box>
                  <Skeleton animation="wave" width={'100px'} title="loading" />
                  <Skeleton animation="wave" width={'200px'} title="loading" />
                </Box>
              )}
              {!loading && (
                <>
                {hasBalance && (
                <AccountPosition
                  data={{
                    userPoolBalanceFormatted,
                    userPoolTokenPercentageFormatted,
                    token0DepositedFormatted,
                    token1DepositedFormatted,
                    canonicalTokenSymbol,
                    hopTokenSymbol,
                    userPoolBalanceUsdFormatted,
                  }}
                />
                )}
                {!hasBalance && (
                <PoolEmptyState />
                )}
                </>
              )}
            </Box>
            <Box width="50%" className={styles.poolDetailsBox}>
              <Tabs value={selectedTab} onChange={handleTabChange} style={{ width: 'max-content' }} variant="scrollable">
                <Tab label="Deposit" value="deposit" />
                <Tab label="Withdraw" value="withdraw" />
                <Tab label="Stake" value="stake" />
              </Tabs>
              <Box p={2} display="flex" flexDirection="column">
                <Box mb={2} >
                  {selectedTab === 'deposit' && <DepositForm
                    data={{
                      token0Symbol: canonicalTokenSymbol,
                      token1Symbol: hopTokenSymbol,
                      token0ImageUrl: canonicalToken?.imageUrl,
                      token1ImageUrl: hopToken?.imageUrl,
                      balance0Formatted: token0BalanceFormatted,
                      balance1Formatted: token1BalanceFormatted,
                      token0Amount,
                      token1Amount,
                      setToken0Amount,
                      setToken1Amount,
                      addLiquidity,
                      priceImpactFormatted,
                      depositAmountTotalDisplayFormatted
                    }}
                  />}
                  {selectedTab === 'withdraw' && <WithdrawForm />}
                  {selectedTab === 'stake' && <StakeForm />}
                </Box>
                <Box>
                  <Alert severity="warning">{warning}</Alert>
                  <Alert severity="error" onClose={() => setError(null)} text={error} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <PoolStats
        data={{
          poolName,
          canonicalTokenSymbol,
          hopTokenSymbol,
          reserve0Formatted,
          reserve1Formatted,
          lpTokenTotalSupplyFormatted,
          feeFormatted,
          virtualPriceFormatted
        }}
       />
    </Box>
  )
}
