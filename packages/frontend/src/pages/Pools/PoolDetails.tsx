import React from 'react'
import { usePools } from './PoolsContext'
import Box from '@material-ui/core/Box'
import { PoolRow } from './PoolRow'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import ArrowLeft from '@material-ui/icons/ChevronLeft'
import InfoTooltip from 'src/components/InfoTooltip'

export const useStyles = makeStyles(theme => ({
  box: {
    boxShadow: theme.boxShadow.inner,
    transition: 'all 0.15s ease-out',
    borderRadius: '3rem'
  },
  backLink: {
    cursor: 'pointer',
    textDecoration: 'none'
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
    background: 'white',
    borderRadius: '3rem',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
    },
  },
  poolStats: {
    boxShadow: theme.boxShadow.inner,
    transition: 'all 0.15s ease-out',
    borderRadius: '3rem'
  },
}))

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
    poolName,
    tokenImageUrl,
    chainImageUrl,
    tokenSymbol,
    chainName
  } = usePools()
  const tvlFormatted = reserveTotalsUsdFormatted
  const volume24hFormatted = '-'

  return (
    <Box maxWidth={"900px"} m={"0 auto"}>
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
      <Box mb={4} p={1} display="flex" justifyContent="space-between">
        <Box mr={1} p={2} display="flex" flexDirection="column" className={styles.topBox}>
          <Box mb={2}>
            <Typography variant="subtitle1" color="secondary">
             TVL
            </Typography>
          </Box>
          <Typography variant="h5">
            {tvlFormatted}
          </Typography>
        </Box>
        <Box ml={1} mr={1} p={2} display="flex" flexDirection="column" className={styles.topBox}>
          <Box mb={2}>
            <Typography variant="subtitle1" color="secondary">
              24hr Volume
            </Typography>
          </Box>
          <Typography variant="h5">
            {volume24hFormatted}
          </Typography>
        </Box>
        <Box ml={1} p={2} display="flex" flexDirection="column" className={styles.topBox}>
          <Box mb={2}>
            <Typography variant="subtitle1" color="secondary">
              APR
            </Typography>
          </Box>
          <Typography variant="h5">
            {aprFormatted}
          </Typography>
        </Box>
      </Box>
      <Box mb={4}>
        <Box p={4} className={styles.box}>
          <Box mb={4}>
            <Typography variant="h4">
              My Liquidity
            </Typography>
          </Box>
          <Box p={2} display="flex">
            <Box p={2} width="50%">
              Add liquidity
            </Box>
            <Box p={2} width="50%">
              Deposit input
            </Box>
          </Box>
        </Box>
      </Box>
      <Box p={4} className={styles.poolStats}>
        <Box mb={4}>
          <Typography variant="h5">
            {poolName} Info
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Box width="100%">
            <Box mb={1}>
              <Typography variant="subtitle2" color="secondary">
              {canonicalTokenSymbol} Reserves
              </Typography>
            </Box>
            <Typography variant="subtitle2">
              {reserve0Formatted}
            </Typography>
          </Box>
          <Box width="100%">
            <Box mb={1}>
              <Typography variant="subtitle2" color="secondary">
              {hopTokenSymbol} Reserves
              </Typography>
            </Box>
            <Typography variant="subtitle2">
              {reserve1Formatted}
            </Typography>
          </Box>
          <Box width="100%">
            <Box mb={1}>
              <Typography variant="subtitle2" color="secondary">
              LP Tokens
              </Typography>
            </Box>
            <Typography variant="subtitle2">
              {lpTokenTotalSupplyFormatted}
            </Typography>
          </Box>
          <Box width="100%">
            <Box mb={1}>
              <Typography variant="subtitle2" color="secondary">
              Fee
              </Typography>
            </Box>
            <Typography variant="subtitle2">
              {feeFormatted}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
