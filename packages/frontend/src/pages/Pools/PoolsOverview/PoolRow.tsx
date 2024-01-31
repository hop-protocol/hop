import Box from '@mui/material/Box'
import MuiButton from '@mui/material/Button'
import React from 'react'
import Skeleton from '@mui/lab/Skeleton'
import Typography from '@mui/material/Typography'
import { AprDetailsTooltip } from 'src/components/InfoTooltip/AprDetailsTooltip'
import { ReactComponent as Bolt } from 'src/assets/bolt.svg'
import { Button } from 'src/components/Button'
import { Link, useNavigate } from 'react-router-dom'
import { makeStyles } from '@mui/styles'

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
  claimLink: string
  stakeLink: string
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
  const { token, chain, poolName, poolSubtitle, userBalanceUsdFormatted, stakingRewardsStakedTotalUsdFormatted, userBalanceTotalUsdFormatted, tvlFormatted, aprFormatted, totalAprFormatted, stakingRewards, depositLink, canClaim, canStake, claimLink, stakeLink } = data

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
                  <strong>{poolName}</strong>
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="secondary" title="Tokens in pool">
                  {poolSubtitle}
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
                <span title="Boosted APR"><Bolt className={styles.bolt} /></span>
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
          </> : <>
            <Link to={depositLink} className={styles.poolLink}>
              <MuiButton variant="text" className={styles.depositLink} onClick={() => navigate(depositLink)}>
                  <Typography variant="body1" component="span" title="Deposit into pool">
                    <strong>Add Liquidity</strong>
                  </Typography>
                </MuiButton>
            </Link>
          </>
          }
        </Box>
      </td>
    </tr>
  )
}
