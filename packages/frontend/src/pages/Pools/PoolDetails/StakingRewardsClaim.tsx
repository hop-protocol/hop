import React, { useState, ChangeEvent, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import Button from 'src/components/buttons/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useStaking } from '../useStaking'
import { useStakingAll } from '../useStakingAll'

export const useStyles = makeStyles(theme => ({
  claimRewards: {
    [theme.breakpoints.down('xs')]: {
      width: '90%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  claimRewardsBox: {
    background: theme.palette.type === 'dark' ? '#0000003d' : '#fff',
    borderRadius: '1rem',
  },
  claimRewardsFlex: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
  stakingRewardsImage: {
    width: '30px'
  },
}))

export function StakingRewardsClaim(props: any) {
  const {
    claimAll,
    chainSlug,
    tokenSymbol,
    stakingContractAddress
  } = props.data
  const styles = useStyles()

  let canClaim = false
  let claim : any
  let isClaiming = false
  let earnedAmountFormatted = ''
  let rewardsTokenSymbol: any = ''
  let rewardsTokenImageUrl = ''

  if (claimAll) {
    ({
      canClaim,
      claim,
      isClaiming,
      earnedAmountFormatted,
      rewardsTokenSymbol,
      rewardsTokenImageUrl,
    } = useStakingAll())
  } else {
    if (!stakingContractAddress) {
      return null
    }
    ({
      canClaim,
      claim,
      isClaiming,
      earnedAmountFormatted,
      rewardsTokenSymbol,
      rewardsTokenImageUrl,
    } = useStaking(chainSlug, tokenSymbol, stakingContractAddress))
  }

  function handleClaimClick(event: any) {
    event.preventDefault()
    claim()
  }

  if (!canClaim) {
    return (
      <></>
    )
  }

  return (
    <Box maxWidth="400px" width="100%" className={styles.claimRewards}>
      <Box p={2} className={styles.claimRewardsBox}>
        <Box display="flex" justifyItems="space-between" className={styles.claimRewardsFlex}>
          <Box mr={2} display="flex" justifyContent="center" alignItems="center">
            <Box display="flex" justifyItems="center" alignItems="center">
              <img className={styles.stakingRewardsImage} src={rewardsTokenImageUrl} alt={rewardsTokenSymbol} title={rewardsTokenSymbol} />
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
              {claimAll ? 'Claim All' : 'Claim'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
