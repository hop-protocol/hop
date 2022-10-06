import React from 'react'
import { Link } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'

export const useStyles = makeStyles(theme => ({
  box: {
  },
  imageContainer: {
    position: 'relative'
  },
  chainImage: {
    width: '16px',
    position: 'absolute',
    top: '-5px',
    left: '-5px'
  },
  tokenImage: {
    width: '32px'
  },
  poolLink: {
    textDecoration: 'none'
  },
  depositLink: {
    textDecoration: 'none'
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
  totalApr: number
  totalAprFormatted: string
  userBalance: number
  userBalanceFormatted: string
  depositLink: string
}

type Props = {
  data: Data
}

export function PoolRow (props: Props) {
  const styles = useStyles()
  const { token, chain, poolName, poolSubtitle, userBalanceFormatted, tvlFormatted, totalAprFormatted, depositLink } = props.data

  return (
    <tr>
      <td>
        <Link to={depositLink} className={styles.poolLink}>
          <Box p={1} display="flex">
            <Box mr={2}>
              <Box className={styles.imageContainer}>
                <img className={styles.chainImage} src={chain.imageUrl} alt={chain.name} />
                <img className={styles.tokenImage} src={token.imageUrl} alt={token.symbol} />
              </Box>
            </Box>
            <Box display="flex" flexDirection="column">
              <Box>
                <Typography variant="body1">
                  <strong>{poolName}</strong>
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="secondary">
                  {poolSubtitle}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Link>
      </td>
      <td>
        <Box p={1}>
          <Typography variant="body1">
            {userBalanceFormatted === '' ? <Skeleton animation="wave" width={'100%'} /> : userBalanceFormatted }
          </Typography>
        </Box>
      </td>
      <td>
        <Box p={1}>
          <Typography variant="body1">
            {tvlFormatted === '' ? <Skeleton animation="wave" width={'100%'} /> : tvlFormatted }
          </Typography>
        </Box>
      </td>
      <td>
        <Box p={1}>
          <Typography variant="body1">
            {totalAprFormatted === '' ? <Skeleton animation="wave" width={'100%'} /> : <strong>{totalAprFormatted}</strong> }
          </Typography>
        </Box>
      </td>
      <td>
        <Box p={1}>
          <Link to={depositLink} className={styles.depositLink}>
            <Typography variant="body1" component="span">
               <strong>Invest</strong>
            </Typography>
          </Link>
        </Box>
      </td>
    </tr>
  )
}
