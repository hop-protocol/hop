import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

type Props = {
  token: string
  chain: string
  tvl: string
  apr: string
  stakingApr: string
}

export function PoolRow (props: Props) {
  const { token, chain, tvl, apr, stakingApr } = props

  return (
    <Box display="flex" justifyContent="space-between">
      <Box>
        {token}
      </Box>
      <Box>
        {chain}
      </Box>
      <Box>
        {tvl}
      </Box>
      <Box>
        {apr}
      </Box>
      <Box>
        {stakingApr}
      </Box>
    </Box>
  )
}
