import React from 'react'
import { Link } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import MuiButton from '@material-ui/core/Button'
import Button from 'src/components/buttons/Button'
import { makeStyles } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'

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
  poolLink: {
    textDecoration: 'none',
    display: 'block',
    '&:hover': {
      background: '#0000000d'
    }
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
  hideMobile: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
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
  stakingAprChain: any
  totalApr: number
  totalAprFormatted: string
  userBalance: number
  userBalanceFormatted: string
  depositLink: string
  canClaim: boolean
  claimLink: string
}

type Props = {
  isAllPools?: boolean
  data: Data
}

export function PoolRow (props: Props) {
  const styles = useStyles()
  const { isAllPools, data } = props
  const { token, chain, poolName, poolSubtitle, userBalanceFormatted, tvlFormatted, totalAprFormatted, stakingApr, stakingAprChain, depositLink, canClaim, claimLink } = data

  return (
    <tr>
      <td>
        <Link to={depositLink} className={styles.poolLink}>
          <Box p={1} display="flex">
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
        <Box p={1}>
          {userBalanceFormatted === '' ? <Skeleton animation="wave" width={'100%'} title="loading" /> : <Typography variant="body1" title="Your pool position value in USD">
              {userBalanceFormatted}
            </Typography>
          }
        </Box>
      </td>
      <td className={styles.hideMobile}>
        <Box p={1}>
          {tvlFormatted === '' ? <Skeleton animation="wave" width={'100%'} title="loading" /> : <Typography variant="body1" title="Total value locked in USD">
              {tvlFormatted}
            </Typography>
          }
        </Box>
      </td>
      <td className={!isAllPools ? styles.hideMobile : ''}>
        {totalAprFormatted === '' ? <Skeleton animation="wave" width={'100%'} title="loading" /> : <Box p={1} display="flex" justifyContent="flex-start" alignItems="center">
            <Typography variant="body1" title="Total APR which is AMM APR + any staking rewards APR">
              <strong>{totalAprFormatted}</strong>
            </Typography>
            {stakingApr > 0 ? <Box ml={1} display="flex" justifyContent="center" alignItems="center">
              <span title="Boosted APR">⚡</span>
              {stakingAprChain ? <Box ml={1} display="flex">
              <img className={styles.stakingAprChainImage} src={stakingAprChain.imageUrl} alt={stakingAprChain.name} title={stakingAprChain.name} /></Box> : null}
            </Box> : null}
          </Box>
        }
      </td>
      <td>
        <Box p={1} display="flex" justifyContent="center">
          {canClaim ? <>
            <Button highlighted>
                <Link to={claimLink} className={styles.claimLink}>
                Claim
                </Link>
              </Button>
          </> : <>
          <MuiButton variant="text" className={styles.depositLink}>
              <Link to={depositLink} className={styles.depositLink}>
                <Typography variant="body1" component="span" title="Deposit into pool">
                  <strong>Invest</strong>
                </Typography>
              </Link>
            </MuiButton>
         </>
          }
        </Box>
      </td>
    </tr>
  )
}
