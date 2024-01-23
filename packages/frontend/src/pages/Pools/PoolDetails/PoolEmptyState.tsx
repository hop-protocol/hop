import React from 'react'
import Box from '@mui/material/Box'
import LaunchIcon from '@mui/icons-material/Launch'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { DinoGame } from 'src/pages/Pools/PoolDetails/DinoGame'

export function PoolEmptyState() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
      <Box>
        <DinoGame />
      </Box>
      <Box p={2}>
        <Box display="flex" justifyContent="center">
          <Typography variant="h5">
            Add liquidity to earn
          </Typography>
        </Box>
      </Box>
      <Box pl={2} pr={2} mb={2} display="flex" justifyContent="center" textAlign="center">
        <Typography variant="body1">
            You can deposit a single asset or both assets in any ratio you like. The pool will automatically handle the conversion for you.
        </Typography>
      </Box>
      <Box mb={2} display="flex" justifyContent="center">
        <Typography variant="body1" component="div">
          <MuiLink target="_blank" rel="noopener noreferrer" href="https://help.hop.exchange/hc/en-us/articles/4406095303565-What-do-I-need-in-order-to-provide-liquidity-on-Hop-" >
            <Box display="flex" justifyContent="center" alignItems="center">
              Learn more <Box ml={1} display="flex" justifyContent="center" alignItems="center"><LaunchIcon /></Box>
            </Box>
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  )
}
