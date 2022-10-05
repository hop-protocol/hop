import React from 'react'
import { usePools } from './usePools'
import Box from '@material-ui/core/Box'
import { PoolRow } from './PoolRow'

export function PoolsOverview () {
  const { pools, userPools } = usePools()

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
         my position
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
      {userPools.length > 0 && (
        <Box mb={4}>
          My Pools
          <Box>
            {userPools.map((x: any) => {
              return (
                <PoolRow
                  token={x.token}
                  chain={x.chain}
                  userBalance={x.userBalance}
                  tvl={x.tvl}
                  apr={x.apr}
                  stakingApr={x.stakingApr}
                />
              )
            })}
          </Box>
        </Box>
      )}
      <Box>
        {pools.map((x: any) => {
          return (
            <PoolRow
              token={x.token}
              chain={x.chain}
              userBalance={x.userBalance}
              tvl={x.tvl}
              apr={x.apr}
              stakingApr={x.stakingApr}
            />
          )
        })}
      </Box>
    </Box>
  )
}
