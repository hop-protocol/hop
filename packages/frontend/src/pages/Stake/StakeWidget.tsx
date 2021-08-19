import React, { FC, useState, useMemo } from 'react'
import { BigNumber, Contract } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import MuiButton from '@material-ui/core/Button'
import { HopBridge, Token } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import AmountSelectorCard from 'src/components/AmountSelectorCard'
import Button from 'src/components/buttons/Button'
import useBalance from 'src/hooks/useBalance'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import Network from 'src/models/Network'
import Transaction from 'src/models/Transaction'
import useStakeBalance from 'src/pages/Stake/useStakeBalance'
import { toTokenDisplay, toPercentDisplay, commafy, shiftBNDecimals } from 'src/utils'
import Alert from 'src/components/alert/Alert'
import usePollValue from 'src/hooks/usePollValue'
import DetailRow from 'src/components/DetailRow'
import useApprove from 'src/hooks/useApprove'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.padding.thick
  },
  buttons: {
    marginTop: theme.padding.default
  },
  button: {
    margin: `0 ${theme.padding.light}`,
    width: '17.5rem'
  },
  claimButton: {
    marginTop: theme.padding.default
  },
  alert: {
    marginTop: theme.padding.default
  },
  withdrawButton: {
    marginTop: theme.padding.light,
    opacity: 0.5
  },
  rewardsDetails: {
    width: '30.0rem'
  },
  details: {
    marginTop: '4.2rem',
    width: '46.0rem',
    [theme.breakpoints.down('xs')]: {
      width: '90%'
    }
  }
}))

type Props = {
  network: Network | undefined
  bridge: HopBridge | undefined
  stakingToken: Token | undefined
  rewardsToken: Token | undefined
  stakingRewards: Contract | undefined
}

const TOTAL_AMOUNTS_DECIMALS = 18
const USD_BN_PRECISION = 100

const StakeWidget: FC<Props> = props => {
  const styles = useStyles()
  const {
    network,
    bridge,
    stakingToken,
    rewardsToken,
    stakingRewards
  } = props

  const { networks, txConfirm, txHistory, sdk } = useApp()
  const { checkConnectedNetworkId, address } = useWeb3Context()
  const { stakeBalance } = useStakeBalance(stakingRewards, address)

  const formattedStakeBalance = toTokenDisplay(stakeBalance, stakingToken?.decimals)

  const tokenUsdPrice = useAsyncMemo(async () => {
    try {
      if (!bridge) {
        return
      }
      const token = await bridge.getL1Token()
      return bridge.priceFeed.getPriceByTokenSymbol(token.symbol)
    } catch (err) {
      console.error(err)
    }
  }, [bridge])

  const maticUsdPrice = useAsyncMemo(async () => {
    try {
      if (!bridge) {
        return
      }
      return bridge.priceFeed.getPriceByTokenSymbol('MATIC')
    } catch (err) {
      console.error(err)
    }
  }, [bridge])

  const earned = usePollValue<BigNumber>(
    async () => {
      if (!address) return undefined
      const _ern = await stakingRewards?.earned(address.toString())
      return _ern
    },
    5e3,
    [stakingRewards, address]
  )

  const formattedEarned = toTokenDisplay(earned, rewardsToken?.decimals, rewardsToken?.symbol)

  const polygon = networks.find(network =>
    network.slug === 'polygon'
  )

  const { balance: lpBalance, loading: loadingLpBalance } = useBalance(stakingToken, polygon, address)
  const [amount, setAmount] = useState('')
  const parsedAmount = (amount && stakingToken)
    ? parseUnits(amount, stakingToken.decimals)
    : undefined

  const allowance = usePollValue(
    async () => {
      if (!(
        address &&
        stakingRewards
      )) {
        return undefined
      }
      return stakingToken?.allowance(stakingRewards.address)
    },
    5e3,
    [stakingToken, stakingRewards]
  )

  const needsApproval = useMemo(() => {
    if (!(address && allowance && parsedAmount)) {
      return undefined
    }
    return allowance.lt(parsedAmount)
  }, [allowance, parsedAmount])

  const isStakeEnabled = useMemo(() => {
    if (!parsedAmount || !lpBalance) return false
    if (needsApproval) return false
    if (parsedAmount.gt(lpBalance)) return false
    return true
  }, [parsedAmount, lpBalance, needsApproval])

  const warning = useMemo(() => {
    if (!parsedAmount || !lpBalance) return undefined
    if (parsedAmount.gt(lpBalance)) {
      return 'Insufficient balance'
    }
  }, [parsedAmount, lpBalance])

  const { balance: totalStaked } = useBalance(stakingToken, polygon, stakingRewards?.address)
  const totalStakedFormatted = toTokenDisplay(
    totalStaked,
    stakingToken?.decimals,
    stakingToken?.symbol
  )

  const totalRewardsPerDay = useAsyncMemo(async () => {
    if (!stakingRewards) return undefined
    const rewardRate = await stakingRewards?.rewardRate()
    return rewardRate.mul(86400) // multiply by 1 day
  }, [stakingRewards])

  const totalRewardsPerDayFormatted = toTokenDisplay(
    totalRewardsPerDay,
    rewardsToken?.decimals,
    rewardsToken?.symbol
  )

  const userRewardsPerDay = useAsyncMemo(async () => {
    try {
      if (
        !stakingRewards ||
        !stakeBalance ||
        !totalStaked ||
        stakeBalance.eq(0)
      ) return undefined
      let rewardRate = await stakingRewards?.rewardRate()
      rewardRate = rewardRate.mul(86400) // multiply by 1 day
      rewardRate = rewardRate.mul(stakeBalance).div(totalStaked)
      return rewardRate
    } catch (err) {
      return ''
    }
  }, [stakingRewards, stakeBalance, totalStaked])

  const userRewardsPerDayFormatted = toTokenDisplay(
    userRewardsPerDay,
    rewardsToken?.decimals,
    rewardsToken?.symbol
  )

  const approve = useApprove()
  const approveToken = async () => {
    if (
      !stakingRewards ||
      !network ||
      !stakingToken
    ) {
      throw new Error('Undefined approval parameter')
    }

    const networkId = Number(network.networkId)
    const isNetworkConnected = await checkConnectedNetworkId(networkId)
    if (!isNetworkConnected || !parsedAmount) return

    const tx = await approve(parsedAmount, stakingToken, stakingRewards?.address)

    await tx?.wait()
  }

  const lpPosition = useAsyncMemo(async () => {
    if (!(
      earned &&
      tokenUsdPrice &&
      stakeBalance &&
      stakeBalance.gt(0)
    )) {
      return
    }

    const tokenUsdPriceBn = BigNumber.from(tokenUsdPrice * USD_BN_PRECISION)
    return (stakeBalance.add(earned)).mul(tokenUsdPriceBn).div(USD_BN_PRECISION)
  }, [stakeBalance, earned, tokenUsdPrice])

  const lpPositionFormatted = lpPosition ? `$${toTokenDisplay(lpPosition, stakingToken?.decimals)}` : ''

  // ((MATIC_PRICE * WMATIC_PER_DAY)/(AMM_USDC + AMM_HUSDC)) * DAYS_PER_YEAR
  // Example: ((1.36 * 3,246.6071)/(2,748,080.39 + 2,698,129.89))*365
  const apr = useAsyncMemo(async () => {
    try {
      if (!(
        bridge &&
        network &&
        totalRewardsPerDay &&
        maticUsdPrice
      )) {
        return
      }

      const maticUsdPriceBn = BigNumber.from(maticUsdPrice * USD_BN_PRECISION)
      const token = await bridge.getCanonicalToken(network.slug)
      const ammTotal = await bridge.getReservesTotal(network.slug)
      const ammTotal18d = shiftBNDecimals(ammTotal, TOTAL_AMOUNTS_DECIMALS - token.decimals)

      return ((((totalRewardsPerDay).mul(maticUsdPriceBn)).div(USD_BN_PRECISION)).div(ammTotal18d)).mul(365).mul(100)
    } catch (err) {
      console.error(err)
    }
  }, [bridge, network, totalRewardsPerDay, maticUsdPrice])

  const aprFormatted = toPercentDisplay(apr, TOTAL_AMOUNTS_DECIMALS)

  const stake = async () => {
    if (!stakingRewards) {
      throw new Error('StakingRewards not instantiated')
    }

    if (!network) {
      throw new Error('Network must be defined')
    }

    const networkId = Number(network.networkId)
    const isNetworkConnected = await checkConnectedNetworkId(networkId)
    if (!isNetworkConnected) return

    const tx = await txConfirm?.show({
      kind: 'stake',
      inputProps: {
        amount: amount,
        token: stakingToken
      },
      onConfirm: async () => {
        const signer = await sdk.getSignerOrProvider(network.slug)
        return stakingRewards.connect(signer).stake(parsedAmount)
      }
    })

    if (tx?.hash && network) {
      setAmount('')
      txHistory?.addTransaction(
        new Transaction({
          hash: tx.hash,
          networkName: network.slug,
          token: stakingToken
        })
      )
    }
  }

  const claim = async () => {
    if (!stakingRewards) {
      throw new Error('StakingRewards not instantiated')
    }

    if (!network) {
      throw new Error('Network must be defined')
    }

    const networkId = Number(network.networkId)
    const isNetworkConnected = await checkConnectedNetworkId(networkId)
    if (!isNetworkConnected) return

    const signer = await sdk.getSignerOrProvider(network.slug)
    await stakingRewards.connect(signer).getReward()
  }

  const withdraw = async () => {
    if (
      !stakingRewards ||
      !network ||
      !stakeBalance
    ) {
      throw new Error('Missing withdraw param')
    }

    const networkId = Number(network.networkId)
    const isNetworkConnected = await checkConnectedNetworkId(networkId)
    if (!isNetworkConnected) return

    const signer = await sdk.getSignerOrProvider(network.slug)
    const _stakingRewards = stakingRewards.connect(signer)

    const tx = await txConfirm?.show({
      kind: 'withdrawStake',
      inputProps: {
        token: stakingToken,
        amount: Number(formatUnits(stakeBalance, stakingToken?.decimals))
      },
      onConfirm: async (amountPercent: number) => {
        if (!amountPercent) return

        if (amountPercent === 100) {
          return _stakingRewards.exit()
        }

        const withdrawAmount = stakeBalance.mul(amountPercent).div(100)

        return _stakingRewards.withdraw(withdrawAmount)
      }
    })

    if (tx?.hash && network) {
      txHistory?.addTransaction(
        new Transaction({
          hash: tx.hash,
          networkName: network.slug,
          token: stakingToken
        })
      )
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      className={styles.root}
    >
      <AmountSelectorCard
        label={`Staked: ${formattedStakeBalance}`}
        value={amount}
        token={stakingToken}
        onChange={setAmount}
        titleIconUrl={network?.imageUrl}
        title={`${network?.name} ${stakingToken?.name}`}
        balance={lpBalance}
        loadingBalance={loadingLpBalance}
        hideSymbol
      />
      <div className={styles.details}>
        <DetailRow
          title="APR"
          tooltip="Annual Percentage Rate (APR) from staking LP tokens"
          value={aprFormatted}
        />
        {!userRewardsPerDay &&
        <DetailRow
          title="Total Staked"
          tooltip="The total amount of LP tokens staked for rewards"
          value={totalStakedFormatted}
        />
        }
        <DetailRow
          title={userRewardsPerDay ? 'Your Rewards' : 'Total Rewards'}
          tooltip={
            userRewardsPerDay
              ? 'The rewards you\'re earning per day'
              : 'The total rewards being distributed per day'
          }
          value={`${userRewardsPerDay ? userRewardsPerDayFormatted : totalRewardsPerDayFormatted} / day`}
        />
        {lpPosition &&
        <DetailRow
          title="Your Total"
          tooltip="The total worth of your staked LP position in USD"
          value={lpPositionFormatted}
        />
      }
      </div>
      <Alert severity="warning" text={warning} className={styles.alert}/>
      <Box display="flex" flexDirection="column" alignItems="center">
        {earned?.gt(0) &&
          <Button
            className={styles.claimButton}
            large
            highlighted
            onClick={claim}
          >
            Claim {formattedEarned}
          </Button>
        }
        <Box className={styles.buttons} display="flex" flexDirection="row" alignItems="center">
          <Button
            className={styles.button}
            large
            highlighted={!!needsApproval}
            disabled={!needsApproval}
            onClick={approveToken}
          >
            Approve
          </Button>
          <Button
            className={styles.button}
            large
            highlighted={needsApproval === false}
            disabled={!isStakeEnabled}
            onClick={stake}
          >
            Stake
          </Button>
        </Box>
        {earned?.gt(0) && (
          <MuiButton
            className={styles.withdrawButton}
            onClick={withdraw}
          >
            Withdraw
          </MuiButton>
        )}
      </Box>
    </Box>
  )
}

export default StakeWidget
