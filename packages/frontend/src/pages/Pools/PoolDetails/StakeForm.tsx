import React, { ChangeEvent } from 'react'
import Alert from 'src/components/alert/Alert'
import { BigNumber } from 'ethers'
import Box from '@mui/material/Box'
import Button from 'src/components/buttons/Button'
import InfoTooltip from 'src/components/InfoTooltip'
import Typography from '@mui/material/Typography'
import { BalanceText } from '../components/BalanceText'
import { InputField } from '../components/InputField'
import { ReactComponent as Bolt } from 'src/assets/bolt.svg'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { sanitizeNumericalString } from 'src/utils'
import { useStaking } from '../useStaking'
import { useStyles } from './useStyles'

type Props = {
  chainSlug: string
  stakingContractAddress: string
  tokenSymbol: string
}

export function StakeForm(props: Props) {
  const styles = useStyles()
  const {
    chainSlug,
    stakingContractAddress,
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

  function handleStakeClick (event: ChangeEvent<{}>) {
    event.preventDefault()
    approveAndStake()
  }

  function handleWithdrawClick (event: ChangeEvent<{}>) {
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
        <Box mr={0.5} title="Boosted APR"><Bolt className={styles.bolt} /></Box>
        {!!rewardsTokenImageUrl && <Box display="flex"><img className={styles.stakingAprChainImage} src={rewardsTokenImageUrl} alt={rewardsTokenSymbol} title={rewardsTokenSymbol} /></Box>}
        <Box ml={1}>{stakingAprFormatted}</Box>
      </Box>
    )
  } else {
    stakingAprDisplay = `${stakingAprFormatted} ${isRewardsExpired ? '(rewards ended)' : ''}`
  }

  return (
    <Box>
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
  )
}
