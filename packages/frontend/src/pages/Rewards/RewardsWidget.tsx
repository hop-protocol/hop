import React from 'react'
import Alert from 'src/components/alert/Alert'
import Box from '@material-ui/core/Box'
import Button from 'src/components/buttons/Button'
import Typography from '@material-ui/core/Typography'
import { toTokenDisplay } from 'src/utils'
import InfoTooltip from 'src/components/InfoTooltip'
import { useRewards } from './useRewards'

interface Props {
  rewardsContractAddress: string
  merkleBaseUrl: string
  requiredChainId: number
  title: string
}

export function RewardsWidget(props: Props) {
  const { rewardsContractAddress, merkleBaseUrl, requiredChainId, title } = props
  const { tokenDecimals, tokenSymbol, claimableAmount, unclaimableAmount, latestRootTotal, latestRoot, claimRecipient, error, onchainRoot, loading, claim, claiming } = useRewards({ rewardsContractAddress, merkleBaseUrl, requiredChainId })

  const claimableAmountDisplay = tokenDecimals ? toTokenDisplay(claimableAmount, tokenDecimals) : ''
  const unclaimableAmountDisplay = tokenDecimals ? toTokenDisplay(unclaimableAmount, tokenDecimals) : ''
  const latestRootTotalDisplay = tokenDecimals ? toTokenDisplay(latestRootTotal, tokenDecimals) : ''

  return (
    <Box maxWidth="500px" margin="0 auto" flexDirection="column" display="flex" justifyContent="center" textAlign="center">
      <Box mb={6}>
        <Typography variant="h4">Rewards</Typography>
      </Box>
      {!claimRecipient && (
        <Box mb={4} display="flex" flexDirection="column" justifyContent="center" textAlign="center">
          <Typography variant="body1">
            Please connect wallet
          </Typography>
        </Box>
      )}
      {!!claimRecipient && (
        <Box>
          <Box mb={2}>
            <Typography variant="h6">{title} <InfoTooltip title={<><div>Merkle rewards</div><div>published root: {onchainRoot}</div><div>Latest root: {latestRoot}</div><div>latest root total: {latestRootTotalDisplay}</div></>} /></Typography>
          </Box>
          {loading && (
            <Box mb={4} display="flex" flexDirection="column" justifyContent="center" textAlign="center">
              <Typography variant="body1">
                Loading...
              </Typography>
            </Box>
          )}
          <Box mb={4} display="flex" flexDirection="column" justifyContent="center" textAlign="center">
            <Typography variant="body1">
              Claimable: <strong>{claimableAmountDisplay} {tokenSymbol}</strong> <InfoTooltip title={'Tokens that can be claimed now'} />
            </Typography>
            <Typography variant="body1">
              Locked: {unclaimableAmountDisplay} {tokenSymbol} <InfoTooltip title={'Tokens that will be claimable once merkle root is published on-chain'} />
            </Typography>
          </Box>
          <Box mb={2}>
            <Button variant="contained" onClick={claim} loading={claiming} disabled={claiming || claimableAmount.eq(0)} highlighted={claimableAmount.gt(0)}>Claim Rewards</Button>
          </Box>
        </Box>
      )}
      {!!error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
    </Box>
  )
}
