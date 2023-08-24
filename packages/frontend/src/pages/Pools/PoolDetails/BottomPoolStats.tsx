import React from 'react'
import Box from '@mui/material/Box'
import InfoTooltip from 'src/components/InfoTooltip'
import Typography from '@mui/material/Typography'
import { useStyles } from './useStyles'

type Props = {
  feeFormatted: string
  lpTokenTotalSupplyFormatted: string
  poolName: string
  reserve0Formatted: string
  reserve1Formatted: string
  token0Symbol: string
  token1Symbol: string
  virtualPriceFormatted: string
}

export function BottomPoolStats (props: Props) {
  const styles = useStyles()
  const {
    feeFormatted,
    lpTokenTotalSupplyFormatted,
    poolName,
    reserve0Formatted,
    reserve1Formatted,
    token0Symbol,
    token1Symbol,
    virtualPriceFormatted,
  } = props

  return (
    <Box p={4} className={styles.poolStats}>
      <Box mb={4}>
        <Typography variant="h5">
          {poolName} Info
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" className={styles.poolStatBoxes}>
        <Box width="100%">
          <Box mb={1}>
            <Typography variant="subtitle2" color="secondary" component="div">
              <Box display="flex" alignItems="center">
                {token0Symbol} Reserves <InfoTooltip title="Total amount of canonical tokens in pool" />
              </Box>
            </Typography>
          </Box>
          <Typography variant="subtitle2">
            {reserve0Formatted}
          </Typography>
        </Box>
        <Box width="100%">
          <Box mb={1}>
            <Typography variant="subtitle2" color="secondary" component="div">
              <Box display="flex" alignItems="center">
                {token1Symbol} Reserves <InfoTooltip title="Total amount of h-tokens in pool" />
              </Box>
            </Typography>
          </Box>
          <Typography variant="subtitle2">
            {reserve1Formatted}
          </Typography>
        </Box>
        <Box width="100%">
          <Box mb={1}>
            <Typography variant="subtitle2" color="secondary" component="div">
              <Box display="flex" alignItems="center">
                LP Tokens <InfoTooltip title="Total supply of liquidity provider (LP) tokens for pool" />
              </Box>
            </Typography>
          </Box>
          <Typography variant="subtitle2">
            {lpTokenTotalSupplyFormatted}
          </Typography>
        </Box>
        <Box width="100%">
          <Box mb={1}>
            <Typography variant="subtitle2" color="secondary" component="div">
              <Box display="flex" alignItems="center">
                Fee <InfoTooltip title="Each trade has this fee percentage that goes to liquidity providers" />
              </Box>
            </Typography>
          </Box>
          <Typography variant="subtitle2">
            {feeFormatted}
          </Typography>
        </Box>
        <Box width="100%">
          <Box mb={1}>
            <Typography variant="subtitle2" color="secondary" component="div">
              <Box display="flex" alignItems="center">
                Virtual Price <InfoTooltip title="The virtual price, to help calculate profit. Virtual price is calculated as `pool_reserves / lp_supply`" />
              </Box>
            </Typography>
          </Box>
          <Typography variant="subtitle2">
            {virtualPriceFormatted}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
