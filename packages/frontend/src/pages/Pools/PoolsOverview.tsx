import React from 'react'
import { usePools } from './usePools'
import Box from '@material-ui/core/Box'
import { PoolRow } from './PoolRow'

export function PoolsOverview () {
  const { pools } = usePools()

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Box>
          token
        </Box>
        <Box>
          chain
        </Box>
        <Box>
          tvl
        </Box>
        <Box>
          apr
        </Box>
        <Box>
          staking apr
        </Box>
      </Box>
      {pools.map((x: any) => {
        return (
          <PoolRow
            token={x.token}
            chain={x.chain}
            tvl={x.tvl}
            apr={x.apr}
            stakingApr={x.stakingApr}
          />
        )
      })}
    </Box>
  )
}
