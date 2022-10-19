import React, { useState, ChangeEvent, useEffect } from 'react'
import { usePool } from '../PoolsContext'
import Box from '@material-ui/core/Box'
import { useParams } from 'react-router'
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
import { InputField } from '../components/InputField'
import InfoTooltip from 'src/components/InfoTooltip'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import MenuItem from '@material-ui/core/MenuItem'
import SelectOption from 'src/components/selects/SelectOption'
import { Slider } from 'src/components/slider'
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import {
  commafy,
  sanitizeNumericalString,
  BNMin,
  formatTokenDecimalString
} from 'src/utils'
import { useStaking } from '../useStaking'
import { stakingRewardsContracts, hopStakingRewardsContracts, metadata, reactAppNetwork } from 'src/config'
import { usePoolStats } from '../usePoolStats'
import TokenWrapper from 'src/components/TokenWrapper'

export const useStyles = makeStyles(theme => ({
  backLink: {
    cursor: 'pointer',
    textDecoration: 'none'
  },
  balanceLink: {
    cursor: 'pointer',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
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
    borderRadius: '2rem',
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
  hopRewards: {
    [theme.breakpoints.down('xs')]: {
      width: '90%'
    },
  },
  hopRewardsBox: {
    background: theme.palette.type === 'dark' ? '#0000003d' : '#fff',
    borderRadius: '1rem',
  },
  hopRewardsFlex: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
  hopImage: {
    width: '30px'
  }
}))

function BalanceText(props: any) {
  const styles = useStyles()
  const { balanceFormatted, onClick } = props

  function handleClick (event: any) {
    event.preventDefault()
    if (onClick) {
      const value = sanitizeNumericalString(balanceFormatted)
      onClick(value)
    }
  }

  return (
    <Box>
      <Link to="" onClick={handleClick} className={styles.balanceLink}>
        <Typography variant="body2" color="secondary">
          <strong>Balance: {balanceFormatted}</strong>
        </Typography>
      </Link>
    </Box>
  )
}

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

function HopRewardsClaim(props: any) {
  const {
    chainSlug,
    tokenSymbol,
    walletConnected,
    hopStakingContractAddress
  } = props.data
  const styles = useStyles()
  const {
    canClaim,
    claim,
    isClaiming,
    earnedAmountFormatted
  } = useStaking(chainSlug, tokenSymbol, hopStakingContractAddress)

  function handleClaimClick(event: any) {
    event.preventDefault()
    claim()
  }

  const hopLogo = metadata.tokens.HOP.image

  if (!canClaim) {
    return (
      <></>
    )
  }

  return (
    <Box mt={8} maxWidth="400px" width="100%" className={styles.hopRewards}>
      <Box p={2} className={styles.hopRewardsBox}>
        <Box display="flex" justifyItems="space-between" className={styles.hopRewardsFlex}>
          <Box mr={2} display="flex" justifyContent="center" alignItems="center">
            <Box display="flex" justifyItems="center" alignItems="center">
              <img className={styles.hopImage} src={hopLogo} alt='HOP' title='HOP' />
            </Box>
          </Box>
          <Box width="100%">
            <Box>
              <Typography variant="subtitle2" color="secondary">
                Unclaimed Rewards
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">
                {earnedAmountFormatted}
              </Typography>
            </Box>
          </Box>
          <Box pl={2} display="flex" justifyContent="center" alignItems="center" width="80%">
            <Button highlighted fullWidth onClick={handleClaimClick} loading={isClaiming}>
              Claim
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function AccountPosition(props: any) {
  const styles = useStyles()
  const {
    hopTokenSymbol,
    canonicalTokenSymbol,
    token0DepositedFormatted,
    token1DepositedFormatted,
    userPoolBalanceFormatted,
    userPoolTokenPercentageFormatted,
    userPoolBalanceUsdFormatted,
    chainSlug,
    tokenSymbol,
    walletConnected,
    hopStakingContractAddress
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
      <HopRewardsClaim data={{
          chainSlug,
          tokenSymbol,
          walletConnected,
          hopStakingContractAddress
      }} />
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
    depositAmountTotalDisplayFormatted,
    walletConnected,
    enoughBalance,
    selectedNetwork,
    isDepositing
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

  const formDisabled = false
  const isEmptyAmount = (!(token0Amount || token1Amount))
  const sendDisabled = formDisabled || isEmptyAmount || !enoughBalance
  let sendButtonText = walletConnected ? 'Preview' : 'Connect Wallet'
  if (!enoughBalance) {
    sendButtonText = 'Insufficient Balance'
  }

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
          <BalanceText balanceFormatted={balance0Formatted} onClick={setToken0Amount} />
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
          <BalanceText balanceFormatted={balance1Formatted} onClick={setToken1Amount} />
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
        <Button large highlighted fullWidth onClick={handleClick} disabled={sendDisabled} loading={isDepositing}>
          {sendButtonText}
        </Button>
      </Box>
    </Box>
  )
}

function WithdrawForm(props: any) {
  const {
    hasBalance,
    token0Symbol,
    token1Symbol,
    token0ImageUrl,
    token1ImageUrl,
    setToken0Amount,
    setToken1Amount,
    tokenDecimals,
    token0AmountBn,
    token1AmountBn,
    totalAmount,
    token0Max,
    token1Max,
    calculatePriceImpact,
    goToTab,
    walletConnected,
    removeLiquidity,
    isWithdrawing
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
    const amounts = { proportional, tokenIndex, amountPercent, amount: amountBN }
    removeLiquidity(amounts)
  }

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

  const handleSelection = (event: ChangeEvent<{ value: unknown }>) => {
    const value = Number(event.target.value)
    const _selection = selections.find(item => item.value === value)
    const _proportional = value === -1
    setSelection(_selection)
    setProportional(_proportional)
    if (value > -1) {
      setTokenIndex(value)
    }
  }

  const updateDisplayAmount = (percent: number = amountPercent) => {
    if (!token0AmountBn) {
      return
    }
    if (!token1AmountBn) {
      return
    }
    const _amount0 = Number(formatUnits(token0AmountBn, tokenDecimals))
    const _amount1 = Number(formatUnits(token1AmountBn, tokenDecimals))
    const amount0 = commafy((_amount0 * (percent / 100)).toFixed(5), 5)
    const amount1 = commafy((_amount1 * (percent / 100)).toFixed(5), 5)
    const display = `${amount0} ${token0Symbol} + ${amount1} ${token1Symbol}`
    setDisplayAmount(display)
  }

  const handleProportionSliderChange = async (percent: number) => {
    setAmountPercent(percent)
    updateDisplayAmount(percent)
  }

  const selectedTokenSymbol = tokenIndex ? token1Symbol : token0Symbol
  const [amount, setAmount] = useState<string>('')
  const [amountBN, setAmountBN] = useState<BigNumber>(BigNumber.from(0))
  const maxBalance = tokenIndex ? token1Max : token0Max
  const [amountSliderValue, setAmountSliderValue] = useState<number>(0)

  const handleAmountSliderChange = (percent: number) => {
    const _balance = Number(formatUnits(maxBalance, tokenDecimals))
    const _amount = (_balance ?? 0) * (percent / 100)
    setAmount(_amount.toFixed(5))
    if (percent === 100) {
      setAmountBN(maxBalance)
    }
  }

  const handleAmountChange = (_amount: string) => {
    setAmount(_amount)
  }

  useEffect(() => {
    const value = Number(amount)
    const _balance = Number(formatUnits(maxBalance, tokenDecimals))
    const sliderValue = 100 / (_balance / value)
    setAmountSliderValue(sliderValue)
  }, [amount])

  const [priceImpact, setPriceImpact] = useState<number | undefined>()

  useEffect(() => {
    updateDisplayAmount()
  }, [])

  useEffect(() => {
    setAmountBN(parseUnits((amount || 0).toString(), tokenDecimals))
  }, [amount])

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

  const priceImpactLabel = Number(priceImpact) > 0 ? 'Bonus' : 'Price Impact'
  const priceImpactFormatted = priceImpact ? `${Number((priceImpact * 100).toFixed(4))}%` : ''

  const formDisabled = !hasBalance
  const isEmptyAmount = (proportional ? !amountPercent : amountBN.lte(0) || amountBN.gt(maxBalance))
  const sendDisabled = formDisabled || isEmptyAmount
  const sendButtonText = walletConnected ? 'Withdraw' : 'Connect Wallet'

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
        <Box>
          <Button onClick={() => goToTab('deposit')}>
            <Typography variant="body1">
              Deposit
            </Typography>
          </Button>
        </Box>
      </Box>
    )
  }

  const maxBalanceFormatted = `${formatTokenDecimalString(maxBalance, tokenDecimals, 4)}`

  return (
    <Box>

      <Box mb={3} display="flex" justifyContent="center">
        <RaisedSelect value={selection.value} onChange={handleSelection}>
          {selections.map((item: any) => (
            <MenuItem value={item.value} key={item.label}>
              <SelectOption value={item.label} icon={item.icon} label={item.label} />
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
          <Box mb={1} display="flex" justifyContent="space-between">
            <Typography variant="subtitle2" color="textPrimary">
              Withdraw only {selectedTokenSymbol}
            </Typography>
            <BalanceText balanceFormatted={maxBalanceFormatted} onClick={setAmount} />
          </Box>
          <Box mb={1}>
            <InputField
              tokenSymbol={selectedTokenSymbol}
              tokenImageUrl={token0ImageUrl}
              value={amount}
              onChange={handleAmountChange}
              disabled={formDisabled}
            />
          </Box>
          <Box width="100%" textAlign="center">
            <Slider onChange={handleAmountSliderChange} defaultValue={0} value={amountSliderValue} />
          </Box>
        </Box>
      )}

      <Box margin="0 auto" width="90%">
        <Box mb={1} display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle2">
              <Box display="flex" alignItems="center">
                Price Impact <InfoTooltip title="Withdrawing overpooled assets will give you bonus tokens. Withdrawaing underpooled assets will give you less tokens." />
              </Box>
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">
              {priceImpactFormatted}
            </Typography>
          </Box>
        </Box>
      <Box>
        <Button large highlighted fullWidth onClick={handleClick} disabled={sendDisabled} loading={isWithdrawing}>
          {sendButtonText}
        </Button>
      </Box>
    </Box>
    </Box>
  )
}

function StakeForm(props: any) {
  const {
    chainSlug,
    tokenSymbol,
    stakingContractAddress
  } = props.data
  const {
    amount,
    approveTokens,
    canClaim,
    canWithdraw,
    claim,
    depositedAmountFormatted,
    earnedAmountFormatted,
    error,
    isApprovalNeeded,
    isApproving,
    isClaiming,
    isRewardsExpired,
    isStaking,
    isWithdrawing,
    lpBalanceFormatted,
    lpTokenSymbol,
    noStaking,
    overallTotalRewardsPerDayFormatted,
    overallTotalStakedFormatted,
    rewardsTokenSymbol,
    setAmount,
    setError,
    stake,
    stakingAprFormatted,
    userRewardsPerDayFormatted,
    userRewardsTotalUsdFormatted,
    walletConnected,
    warning,
    withdraw,
  } = useStaking(chainSlug, tokenSymbol, stakingContractAddress)

  const isEmptyAmount = !Number(amount)
  const formDisabled = !walletConnected
  const stakeButtonText = walletConnected ? 'Stake' : 'Connect Wallet'
  const approveDisabled = formDisabled || isEmptyAmount || !isApprovalNeeded
  const stakeButtonDisabled = formDisabled || isEmptyAmount || isApprovalNeeded || !!warning
  const claimButtonDisabled = formDisabled || !canClaim
  const withdrawButtonDisabled = formDisabled || !canWithdraw

  function handleAmountChange (_amount: string) {
    setAmount(_amount)
  }

  function handleApproveClick (event: any) {
    event.preventDefault()
    approveTokens()
  }

  function handleStakeClick (event: any) {
    event.preventDefault()
    stake()
  }

  function handleWithdrawClick (event: any) {
    event.preventDefault()
    withdraw()
  }

  function handleClaimClick (event: any) {
    event.preventDefault()
    claim()
  }

  if (noStaking) {
    return (
      <Box>
        <Typography>
          There is no staking available for this asset on this chain.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h6">
          {rewardsTokenSymbol} Rewards
        </Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">
          My deposits
        </Typography>
        <Typography>
          LP Balance: {lpBalanceFormatted} {lpTokenSymbol}
        </Typography>
        <Typography>
          Staked LP <InfoTooltip title="LP tokens that have been deposited to earn rewards" />: {depositedAmountFormatted}
        </Typography>
        <Typography>
          Total <InfoTooltip title="The total worth of your staked LP position in USD" />: {userRewardsTotalUsdFormatted}
        </Typography>
        <Typography>
          Rewards <InfoTooltip title="The rewards you're earning per day" />: {userRewardsPerDayFormatted}
        </Typography>
        <Typography>
          Earned <InfoTooltip title="Rewards earned that are claimable" />: {earnedAmountFormatted}
        </Typography>
        <Box mt={2}>
          <Box mb={1}>
            <Button large highlighted fullWidth onClick={handleClaimClick} disabled={claimButtonDisabled} loading={isClaiming}>
              Claim
            </Button>
          </Box>
          <Box mb={1}>
            <Button large highlighted fullWidth onClick={handleWithdrawClick} disabled={withdrawButtonDisabled} loading={isWithdrawing}>
              Withdraw
            </Button>
          </Box>
        </Box>
      </Box>
      <Box mb={2}>
        <Typography variant="subtitle1">
          Staking stats
        </Typography>
        <Typography>
          APR <InfoTooltip title="Annual Percentage Rate (APR) from staking LP tokens" />: {stakingAprFormatted} {isRewardsExpired ? '(rewards ended)' : ''}
        </Typography>
        <Typography>
          Total Staked <InfoTooltip title="The total amount of LP tokens staked for rewards" />: {overallTotalStakedFormatted}
        </Typography>
        <Typography>
          Total Rewards <InfoTooltip title="The total rewards being distributed per day" />: {overallTotalRewardsPerDayFormatted}
        </Typography>
      </Box>
      <Box mb={1}>
        <Typography variant="subtitle1">
          Stake LP
        </Typography>
        <Box mb={1} display="flex" justifyContent="flex-end">
          <BalanceText balanceFormatted={lpBalanceFormatted} onClick={setAmount} />
        </Box>
        <InputField
          tokenSymbol={lpTokenSymbol}
          value={amount}
          onChange={handleAmountChange}
          disabled={formDisabled}
        />
      </Box>
      <Box mb={1}>
        <Button large highlighted fullWidth onClick={handleApproveClick} disabled={approveDisabled} loading={isApproving}>
          Approve
        </Button>
      </Box>
      <Box mb={1}>
        <Button large highlighted fullWidth onClick={handleStakeClick} disabled={stakeButtonDisabled} loading={isStaking}>
          {stakeButtonText}
        </Button>
      </Box>
      <Box>
        <Alert severity="warning">{warning}</Alert>
        <Alert severity="error" onClose={() => setError(null)} text={error} />
      </Box>
    </Box>
  )
}

function TopPoolStats (props:any) {
  const styles = useStyles()
  const {
    tvlFormatted,
    volume24hFormatted,
    aprFormatted
  } = props.data

  return (
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
  )
}

function BottomPoolStats (props:any) {
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
    token0Deposited,
    token1Deposited,
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
    addLiquidityAndStake,
    priceImpactFormatted,
    depositAmountTotalDisplayFormatted,
    poolReserves,
    calculateRemoveLiquidityPriceImpactFn,
    selectedNetwork,
    walletConnected,
    chainSlug,
    enoughBalance,
    removeLiquiditySimple,
    isWithdrawing,
    isDepositing
  } = usePool()
  const tvlFormatted = reserveTotalsUsdFormatted
  const volume24hFormatted = '-'
  const { pathname, search } = useLocation()
  const history = useHistory()
  const { tab } = useParams<{ tab: string }>()
  const [selectedTab, setSelectedTab] = useState(tab || 'deposit')
  const { theme } = useThemeMode()

  const calculateRemoveLiquidityPriceImpact = calculateRemoveLiquidityPriceImpactFn(userPoolBalance)

  function goToTab(value: string) {
    history.push({
      pathname: `/pool/${value}`,
      search,
    })
    setSelectedTab(value)
  }

  function handleTabChange(event: ChangeEvent<{}>, newValue: string) {
    goToTab(newValue)
  }

  const totalAmount = token0Deposited?.add(token1Deposited || 0) ?? BigNumber.from(0)
  const token0Max = BNMin(poolReserves[0], totalAmount)
  const token1Max = BNMin(poolReserves[1], totalAmount)

  const stakingContractAddress = stakingRewardsContracts?.[reactAppNetwork]?.[chainSlug]?.[tokenSymbol]
  const hopStakingContractAddress = hopStakingRewardsContracts?.[reactAppNetwork]?.[chainSlug]?.[tokenSymbol]
  const stakingEnabled = !!(stakingContractAddress || hopStakingContractAddress)

  return (
    <Box maxWidth={"900px"} m={"0 auto"}>
      <Box mb={4} display="flex" alignItems="center">
        <Alert severity="info">
        This page is still a work in progress and not fully functional.
        </Alert>
      </Box>
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
      <TopPoolStats
        data={{
          tvlFormatted,
          volume24hFormatted,
          aprFormatted
        }}
      />
      <Box mb={4}>
        <Box p={4} className={styles.poolDetails}>
          <Box p={2} display="flex" className={styles.poolDetailsBoxes}>
            <Box width="50%" display="flex" flexDirection="column" className={styles.poolDetailsBox}>
              <Box p={2}>
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
                      hopStakingContractAddress,
                      chainSlug,
                      tokenSymbol,
                      walletConnected,
                    }}
                  />
                  )}
                  {!hasBalance && (
                  <PoolEmptyState />
                  )}
                  </>
                )}
              </Box>
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
                      hasBalance,
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
                      addLiquidity: addLiquidityAndStake,
                      priceImpactFormatted,
                      depositAmountTotalDisplayFormatted,
                      walletConnected,
                      enoughBalance,
                      selectedNetwork,
                      isDepositing
                    }}
                  />}
                  {selectedTab === 'withdraw' && <WithdrawForm
                    data={{
                      hasBalance,
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
                      depositAmountTotalDisplayFormatted,
                      token0AmountBn: token0Deposited,
                      token1AmountBn: token1Deposited,
                      tokenDecimals: canonicalToken?.decimals,
                      token0Max,
                      token1Max,
                      calculatePriceImpact: calculateRemoveLiquidityPriceImpact,
                      goToTab,
                      walletConnected,
                      removeLiquidity: removeLiquiditySimple,
                      isWithdrawing,
                      totalAmount
                    }}
                  />}
                  {selectedTab === 'stake' && (
                    <>
                      {stakingEnabled && (
                        <>
                        {!!stakingContractAddress && (
                          <Box mb={4}>
                            <StakeForm
                              data={{
                                chainSlug,
                                tokenSymbol,
                                stakingContractAddress
                              }}
                            />
                          </Box>
                        )}
                        {!!hopStakingContractAddress && (
                          <Box mb={4}>
                            <StakeForm
                              data={{
                                chainSlug,
                                tokenSymbol,
                                stakingContractAddress: hopStakingContractAddress
                              }}
                            />
                          </Box>
                        )}
                        </>
                      )}
                      {!stakingEnabled && (
                        <Typography>
                          There is no staking available for this asset on this chain.
                        </Typography>
                      )}
                    </>
                  )}
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
      <BottomPoolStats
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
