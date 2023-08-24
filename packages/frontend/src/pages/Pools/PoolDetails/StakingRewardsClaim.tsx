import React, { ChangeEvent } from 'react'
import Box from '@mui/material/Box'
import Button from 'src/components/buttons/Button'
import Typography from '@mui/material/Typography'
import makeStyles from '@mui/styles/makeStyles';
import { useStaking } from '../useStaking'
import { useStakingAll } from '../useStakingAll'

export const useStyles = makeStyles(theme => ({
  claimRewards: {
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  claimRewardsBox: {
    background: theme.palette.mode === 'dark' ? '#0000003d' : '#fff',
    borderRadius: '1rem',
  },
  claimRewardsFlex: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
  stakingRewardsImage: {
    width: '30px'
  },
}))

type Props = {
  chainSlug?: string
  claimAll?: boolean
  stakingContractAddress?: string
  tokenSymbol?: string
}

export function StakingRewardsClaim(props: Props) {
  const {
    chainSlug,
    claimAll,
    stakingContractAddress,
    tokenSymbol,
  } = props
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
    if (!(stakingContractAddress && chainSlug && tokenSymbol)) {
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

  function handleClaimClick(event: ChangeEvent<{}>) {
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
