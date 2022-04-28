import React from 'react'
import Box from '@material-ui/core/Box'
import { EthAddress, Flex } from 'src/components/ui'
import { useAirdropPreview } from './useAirdropPreview'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { CriteriaCircle } from './CriteriaCircle'
import { AirdropPreviewWrapper } from './AirdropPreviewWrapper'
import Typography from '@material-ui/core/Typography'

export const respMaxWidths = [350, 624, 824]

export function AirdropPreview() {
  const { address } = useWeb3Context()
  const { eligibility } = useAirdropPreview(address)

  if (!address) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" justifyItems="center" alignItems="center">
        Please connect wallet
      </Box>
    )
  }

  return (
    <AirdropPreviewWrapper>
      <Box display="flex" flexDirection="column" justifyContent="center" width="100%">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Typography variant="h4" component="div">
            Hop Token Airdrop
          </Typography>
        </Box >

        <Box px={4} maxWidth="500px">
          {!eligibility?.isEligible ? (
            <Box m={3} display="flex" flexDirection="column" justifyContent="center" justifyItems="center" alignItems="center" textAlign="center">
              <Typography variant="subtitle2" component="div">
                Sorry, the connected account is not eligible for the Hop airdrop.
              </Typography>
            </Box >
          ) : (
            <Box m={3} display="flex" flexDirection="column" justifyContent="center" justifyItems="center" alignItems="center" textAlign="center">
              <Typography variant="subtitle1" component="div">
                You are eligible for the Hop airdrop! 🎉
              </Typography>
              <Typography variant="body1" component="div">
                Please view your Airdrop preview details below.
              </Typography>
            </Box >
          )}
        </Box>

        <Box display="flex" flexDirection="column" justifyContent="center" justifyItems="center" margin="0 auto" p={1} maxWidth="400px" width="100%">
          <Box display="flex" flexDirection="column" justifyContent="center" my={3}>
            <Box mr={3}>
              <Typography variant="subtitle2" component="div">
                Connected Account:
              </Typography>
            </Box>
            <EthAddress value={address?.address} full />
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Box>Hop Bridge User:</Box>
            <CriteriaCircle criteria={eligibility?.bridgeUserAirdrop} />
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Box>Liquidity Provider:</Box>
            <CriteriaCircle criteria={eligibility?.lpAirdrop} />
          </Box>
        </Box>
      </Box>
    </AirdropPreviewWrapper>
  )
}
