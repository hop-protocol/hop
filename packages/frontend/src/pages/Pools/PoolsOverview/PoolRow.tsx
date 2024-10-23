/// <reference types="vite-plugin-svgr/client" />
import Bolt from '../../../assets/bolt.svg?react' // eslint-disable-line n/no-missing-import
import Box from '@mui/material/Box'
import MuiButton from '@mui/material/Button'
import React from 'react'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { AprDetailsTooltip } from '#components/InfoTooltip/AprDetailsTooltip.js'
import { Button } from '#components/Button/index.js'
import { Link, useNavigate } from 'react-router-dom'
import Badge from '@mui/material/Badge'
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/material/styles'

const DeprecatedBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    color: '#fff',
    fontSize: '0.75rem',
    top: '50%',
    right: '-30px'
  },
}))

const RebrandedBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    color: '#fff',
    fontSize: '0.75rem',
    top: '50%',
    right: '-30px'
  },
}))

export const useStyles = makeStyles(theme => ({
  box: {
  },
  imageContainer: {
    position: 'relative'
  },
  chainImage: {
    width: '18px',
    position: 'absolute',
    top: '-5px',
    left: '-5px'
  },
  stakingAprChainImage: {
    width: '20px',
  },
  tokenImage: {
    width: '36px'
  },
  tr: {
    '&:hover': {
      background: theme.palette.mode === 'dark' ? '#0000001a' : '#00000005'
    }
  },
  poolLink: {
    textDecoration: 'none',
    display: 'block',
  },
  depositLink: {
    textDecoration: 'none',
    background: 'none',
    boxShadow: 'none'
  },
  claimLink: {
    textDecoration: 'none',
    background: 'none',
    boxShadow: 'none',
    color: 'white'
  },
  poolName: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
  },
  hideMobile: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
  },
  bolt: {
    '& path': {
      fill: theme.palette.mode === 'dark' ? '#fff' : '#000'
    }
  }
}))

type Data = {
  token: any
  chain: any
  poolName: string
  poolSubtitle: string
  tvl: number
  tvlFormatted: string
  apr: number
  aprFormatted: string
  stakingApr: number
  stakingAprFormatted: string
  stakingRewards: any[]
  totalApr: number
  totalAprFormatted: string
  userBalanceUsdFormatted: string
  userBalanceTotalUsdFormatted: string
  depositLink: string
  canClaim: boolean
  canStake: boolean
  isPoolDeprecated: boolean
  claimLink: string
  stakeLink: string
  withdrawLink: string
  stakingRewardsStakedTotalUsdFormatted: string
}

type Props = {
  isAllPools?: boolean
  data: Data
}

export function PoolRow (props: Props) {
  const styles = useStyles()
  const navigate = useNavigate()
  const { isAllPools, data } = props
  const { token, chain, poolName, poolSubtitle, userBalanceUsdFormatted, stakingRewardsStakedTotalUsdFormatted, userBalanceTotalUsdFormatted, tvlFormatted, aprFormatted, totalAprFormatted, stakingRewards, depositLink, canClaim, canStake, isPoolDeprecated, withdrawLink, claimLink, stakeLink } = data

  return (
    <tr className={styles.tr}>
      <td>
        <Link to={depositLink} className={styles.poolLink}>
          <Box p={1} display="flex" className={styles.poolName}>
            <Box mr={2}>
              <Box className={styles.imageContainer}>
                <img className={styles.chainImage} src={chain.imageUrl} alt={chain.name} title={chain.name} />
                <img className={styles.tokenImage} src={token.imageUrl} alt={token.symbol} title={token.symbol} />
              </Box>
            </Box>
            <Box display="flex" flexDirection="column">
              <Box>
                <Typography variant="body1" title="Pool">
                  {poolName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="secondary" title="Tokens in pool">
                  {isPoolDeprecated ? <DeprecatedBadge badgeContent="Deprecated" color="warning" title="This pool is deprecated and only withdrawals are allowed.">{poolSubtitle}</DeprecatedBadge> : (

                    poolSubtitle?.includes('POL ') ? <RebrandedBadge badgeContent="prev. MATIC" color="info" title="The token symbol has been rebranded">{poolSubtitle}</RebrandedBadge> : poolSubtitle

                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Link>
      </td>
      <td className={isAllPools ? styles.hideMobile : ''}>
        <Link to={depositLink} className={styles.poolLink}>
        <Box p={1}>
          {userBalanceTotalUsdFormatted === '' ? <Skeleton animation="wave" width={'100%'} title="loading" /> : <Typography variant="body1" title={`${'Your pool position value in USD'}. unstaked=${userBalanceUsdFormatted} staked=${stakingRewardsStakedTotalUsdFormatted}`}>
              {userBalanceTotalUsdFormatted}
            </Typography>
          }
        </Box>
        </Link>
      </td>
      <td className={styles.hideMobile}>
        <Link to={depositLink} className={styles.poolLink}>
        <Box p={1}>
          {tvlFormatted === '' ? <Skeleton animation="wave" width={'100%'} title="loading" /> : <Typography variant="body1" title="Total value locked in USD">
              {tvlFormatted}
            </Typography>
          }
        </Box>
        </Link>
      </td>
      <td className={!isAllPools ? styles.hideMobile : ''}>
          <Link to={depositLink} className={styles.poolLink}>
          <AprDetailsTooltip
            total={{
              aprFormatted: totalAprFormatted
            }}
            tradingFees={{
              aprFormatted: aprFormatted
            }}
            rewards={stakingRewards?.map((x: any) => {
              return {
                rewardTokenSymbol: x.tokenSymbol,
                rewardTokenImageUrl: x.imageUrl,
                aprFormatted: x.aprFormatted
              }
            })}
          >
          <Box display="inline-block">
          {totalAprFormatted === '' ? <Skeleton animation="wave" width={'100%'} title="loading" /> : <Box p={1} display="flex" justifyContent="flex-start" alignItems="center">
              <Typography variant="body1" title="Total APR which is AMM APR + any staking rewards APR">
                <strong>{totalAprFormatted}</strong>
              </Typography>
              {stakingRewards.length > 0 ? <Box ml={1} display="flex" justifyContent="center" alignItems="center">
                <span title="Boosted APR">
                  <Bolt className={styles.bolt} />
                </span>
                {stakingRewards.length > 0 ? <Box ml={0.5} display="flex">
                  {stakingRewards.map((x: any, i: number) => {
                    return (
                      <img key={x.tokenSymbol} className={styles.stakingAprChainImage} src={x.imageUrl} alt={x.tokenSymbol} title={x.tokenSymbol} style={{
                        transform: `translateX(-${8 * i}px)`
                      }} />
                    )
                  })}
                </Box> : null}
              </Box> : null}
            </Box>
          }
          </Box>
          </AprDetailsTooltip>
          </Link>
      </td>
      <td>
        <Box p={1} display="flex" justifyContent="center">
          {(canClaim || canStake) ? <>
            {canStake ? (
              <Button highlighted onClick={() => navigate(stakeLink)}>
                Stake
              </Button>
            ) : (
              <Button highlighted onClick={() => navigate(claimLink)}>
                Claim
              </Button>
            )
            }
          </> : (isPoolDeprecated ? <>
            <Link to={withdrawLink} className={styles.poolLink}>
              <MuiButton variant="text" className={styles.depositLink} onClick={() => navigate(withdrawLink)}>
                  <Typography variant="body1" component="span" title="Withdraw from pool">
                    <strong>Withdraw</strong>
                  </Typography>
                </MuiButton>
            </Link>
          </> : <>
            <Link to={depositLink} className={styles.poolLink}>
              <MuiButton variant="text" className={styles.depositLink} onClick={() => navigate(depositLink)}>
                  <Typography variant="body1" component="span" title="Deposit into pool">
                    <strong>Add Liquidity</strong>
                  </Typography>
                </MuiButton>
            </Link>
          </>)
          }
        </Box>
      </td>
    </tr>
  )
}
