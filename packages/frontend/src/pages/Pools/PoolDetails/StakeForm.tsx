/// <reference types="vite-plugin-svgr/client" />
import Bolt from 'src/assets/bolt.svg?react'
import Box from '@mui/material/Box'
import React, { ChangeEvent } from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { Alert } from 'src/components/Alert'
import { BalanceText } from 'src/pages/Pools/components/BalanceText'
import { BigNumber } from 'ethers'
import { Button } from 'src/components/Button'
import { InfoTooltip } from 'src/components/InfoTooltip'
import { InputField } from 'src/pages/Pools/components/InputField'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { normalizeTokenSymbol } from 'src/utils/normalizeTokenSymbol'
import { sanitizeNumericalString } from 'src/utils'
import { useStaking } from 'src/pages/Pools/useStaking'
import { useStyles } from 'src/pages/Pools/PoolDetails/useStyles'

type Props = {
  chainSlug: string
  handleStakingChange: (event: React.ChangeEvent<object>, newValue: string) => void
  isTokenDeprecated: boolean
  selectedStaking: string
  stakingContractAddress: string
  stakingEnabled: boolean
  stakingRewards: any[]
  tokenSymbol: string
}

export function StakeForm(props: Props) {
  const styles = useStyles()
  const {
    chainSlug,
    handleStakingChange,
    isTokenDeprecated,
    selectedStaking,
    stakingContractAddress,
    stakingEnabled,
    stakingRewards,
    tokenSymbol,
  } = props
  const {
    amount,
    approveAndStake,
    canWithdraw,
    depositedAmountFormatted,
    error,
    isRewardsExpired,
    isStaking,
    isWithdrawing,
    lpBalanceFormatted,
    lpTokenImageUrl,
    lpTokenSymbol,
    noStaking,
    overallTotalRewardsPerDayFormatted,
    overallTotalStakedFormatted,
    rewardsTokenImageUrl,
    rewardsTokenSymbol,
    setAmount,
    setError,
    setParsedAmount,
    stakingApr,
    stakingAprFormatted,
    userLpBalanceBn,
    walletConnected,
    warning,
    withdraw,
  } = useStaking(chainSlug, tokenSymbol, stakingContractAddress)

  function handleStakeClick (event: ChangeEvent<object>) {
    event.preventDefault()
    approveAndStake()
  }

  function handleWithdrawClick (event: ChangeEvent<object>) {
    event.preventDefault()
    withdraw()
  }

  function handleUnstakedClick (value: BigNumber) {
    try {
      setParsedAmount(value)
      const _amount = formatUnits(value.toString(), 18)
      setAmount(_amount)
    } catch (err) {
    }
  }

  function handleInputChange (value: string) {
    try {
      value = sanitizeNumericalString(value)
      setAmount(value)
      const _parsedAmount = parseUnits(value || '0', 18)
      setParsedAmount(_parsedAmount)
    } catch (err) {
      console.error(err)
    }
  }

  function handleErrorClose() {
    setError('')
  }

  const isEmptyAmount = !Number(amount)
  const formDisabled = !walletConnected
  const stakeButtonText = walletConnected ? 'Preview' : 'Connect Wallet'
  const stakeButtonDisabled = formDisabled || isEmptyAmount || !!warning
  const withdrawButtonDisabled = formDisabled || !canWithdraw
  const showOverallStats = true

  if (noStaking) {
    return (
      <Box>
        <Typography>
          There is no staking available for this asset on this chain.
        </Typography>
      </Box>
    )
  }

  let stakingAprDisplay : any = '-'
  if (stakingApr > 0) {
    stakingAprDisplay = (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Box mr={0.5} title="Boosted APR">
          <Bolt className={styles.bolt} />
        </Box>
        {!!rewardsTokenImageUrl && <Box display="flex"><img className={styles.stakingAprChainImage} src={rewardsTokenImageUrl} alt={rewardsTokenSymbol} title={rewardsTokenSymbol} /></Box>}
        <Box ml={1}>{stakingAprFormatted}</Box>
      </Box>
    )
  } else {
    stakingAprDisplay = `${stakingAprFormatted} ${isRewardsExpired ? '(rewards ended)' : ''}`
  }

  if (isTokenDeprecated) {
    return (
      <>
        <Box mb={4}>
          <Alert severity="warning" text={(normalizeTokenSymbol(tokenSymbol) ? ("The " + normalizeTokenSymbol(tokenSymbol)) : "This") + " bridge is deprecated. Only withdrawals from the AMM are supported."} />
        </Box>

        {stakingRewards.length > 0 && (
          <Box mb={2} display="flex" alignItems="center" className={styles.stakingTabsContainer}>
            <Box>
              <Typography variant="subtitle1">
                Earned
              </Typography>
            </Box>
            <Tabs value={selectedStaking} onChange={handleStakingChange}>
              {stakingRewards.map((stakingReward, index) => {
                const value = index.toString()
                const selected = selectedStaking === value
                return (
                  <Tab key={stakingReward.rewardTokenSymbol} label={<Box style={{
                    paddingLeft: '1rem',
                    paddingBottom: '1rem',
                    transition: 'translate(0, 5px)',
                  }} >
                  <Box display="flex" alignItems="center" data-selected={selected} className={styles.stakingTabButtonBox}>
                    <Box mr={0.5} display="flex" justifyItems="center" alignItems="center">
                      <img className={styles.stakingTabImage} src={stakingReward.rewardTokenImageUrl} alt={stakingReward.rewardTokenSymbol} title={stakingReward.rewardTokenSymbol} />
                    </Box>
                    <Typography variant="body2">
                      {stakingReward.rewardTokenSymbol}
                    </Typography>
                  </Box>
                  </Box>} value={value} />
                )
              })}
            </Tabs>
          </Box>
        )}

        <Box mb={4}>
          <Box mb={1} display="flex" justifyContent="space-between">
            <BalanceText label="Staked" balanceFormatted={depositedAmountFormatted} />
            <BalanceText label="Unstaked" balanceFormatted={lpBalanceFormatted} balanceBn={userLpBalanceBn} />
          </Box>
          <Box mt={4} mb={1}>
            {canWithdraw && (
              <Button large highlighted fullWidth onClick={handleWithdrawClick} disabled={withdrawButtonDisabled} loading={isWithdrawing}>
                Unstake
              </Button>
            )}
          </Box>
          <Box>
            <Alert severity="warning">{warning}</Alert>
            <Alert severity="error" onClose={handleErrorClose} text={error} />
          </Box>
        </Box>
      </>
    )
  } else if (!stakingEnabled) {
    return (
      <Typography variant="body1">
        There is no staking available for this asset on this chain.
      </Typography>
    )
  } else {
    return (
      <>
        {stakingRewards.length > 0 && (
          <Box mb={2} display="flex" alignItems="center" className={styles.stakingTabsContainer}>
            <Box>
              <Typography variant="subtitle1">
                Earn
              </Typography>
            </Box>
            <Tabs value={selectedStaking} onChange={handleStakingChange}>
              {stakingRewards.map((stakingReward, index) => {
                const value = index.toString()
                const selected = selectedStaking === value
                return (
                  <Tab key={stakingReward.rewardTokenSymbol} label={<Box style={{
                    paddingLeft: '1rem',
                    paddingBottom: '1rem',
                    transition: 'translate(0, 5px)',
                  }} >
                  <Box display="flex" alignItems="center" data-selected={selected} className={styles.stakingTabButtonBox}>
                    <Box mr={0.5} display="flex" justifyItems="center" alignItems="center">
                      <img className={styles.stakingTabImage} src={stakingReward.rewardTokenImageUrl} alt={stakingReward.rewardTokenSymbol} title={stakingReward.rewardTokenSymbol} />
                    </Box>
                    <Typography variant="body2">
                      {stakingReward.rewardTokenSymbol}
                    </Typography>
                  </Box>
                  </Box>} value={value} />
                )
              })}
            </Tabs>
          </Box>
        )}

        <Box mb={4}>
          <Box mb={2}>
            <Box mb={1} display="flex" justifyContent="space-between">
              <BalanceText label="Staked" balanceFormatted={depositedAmountFormatted} />
              <BalanceText label="Unstaked" balanceFormatted={lpBalanceFormatted} balanceBn={userLpBalanceBn} onClick={handleUnstakedClick} />
            </Box>
            <InputField
              tokenSymbol={lpTokenSymbol}
              tokenImageUrl={lpTokenImageUrl}
              value={amount}
              onChange={handleInputChange}
              disabled={formDisabled}
            />
          </Box>
          {showOverallStats && (
            <Box mb={1}>
              <Box mb={2} display="flex" justifyContent="space-between">
                <Box>
                  <Typography variant="body1" component="div">
                    APR <InfoTooltip title="Annual Percentage Rate (APR) from staking LP tokens" />
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" component="div">
                    {stakingAprDisplay}
                  </Typography>
                </Box>
              </Box>
              <Box mb={2} display="flex" justifyContent="space-between">
                <Box>
                  <Typography variant="body1" component="div">
                    Total Staked <InfoTooltip title="The total amount of LP tokens staked for rewards" />
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1">
                    {overallTotalStakedFormatted}
                  </Typography>
                </Box>
              </Box>
              <Box mb={1} display="flex" justifyContent="space-between">
                <Box>
                  <Typography variant="body1" component="div">
                    Total Rewards <InfoTooltip title="The total rewards being distributed per day" />
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1">
                    {overallTotalRewardsPerDayFormatted}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          <Box mt={4} mb={1}>
            <Button large highlighted fullWidth onClick={handleStakeClick} disabled={stakeButtonDisabled} loading={isStaking}>
              {stakeButtonText}
            </Button>
            {canWithdraw && (
              <Box mt={4}>
                <Button text fullWidth onClick={handleWithdrawClick} disabled={withdrawButtonDisabled} loading={isWithdrawing}>
                  Unstake
                </Button>
              </Box>
            )}
          </Box>
          <Box>
            <Alert severity="warning">{warning}</Alert>
            <Alert severity="error" onClose={handleErrorClose} text={error} />
          </Box>
        </Box>
      </>
    )
  }
}
