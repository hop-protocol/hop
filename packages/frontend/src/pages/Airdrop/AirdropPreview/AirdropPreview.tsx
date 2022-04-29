import React from 'react'
import Box from '@material-ui/core/Box'
import { EthAddress, Flex } from 'src/components/ui'
import { useAirdropPreview } from './useAirdropPreview'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { CriteriaCircle } from './CriteriaCircle'
import { AirdropPreviewWrapper } from './AirdropPreviewWrapper'
import { StyledButton } from 'src/components/buttons/StyledButton'
import Typography from '@material-ui/core/Typography'

export const respMaxWidths = [350, 624, 824]

export function AirdropPreview() {
  const { address } = useWeb3Context()
  const { eligibility } = useAirdropPreview(address)

  return (
    <>
      <AirdropPreviewWrapper>
        <Box display="flex" flexDirection="column" justifyContent="center" width="100%">
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Typography variant="h4" component="div">
              Hop Token Airdrop
            </Typography>
          </Box >

          {!address && (
            <Box px={4} maxWidth="500px">
              <Box m={3} display="flex" flexDirection="column" justifyContent="center" justifyItems="center" alignItems="center" textAlign="center">
                <Typography variant="subtitle2" component="div" color="textSecondary">
                Please connect your wallet to check if eligible
                </Typography>
              </Box >
            </Box>
          )}

          {!!address && (
          <>
            <Box px={4} maxWidth="500px">
              {!eligibility?.isEligible ? (
                <Box m={3} display="flex" flexDirection="column" justifyContent="center" justifyItems="center" alignItems="center" textAlign="center">
                  <Typography variant="subtitle2" component="div" color="textSecondary">
                  Sorry, the connected account is not eligible for the Hop airdrop 😞
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
                  <Typography variant="body1" component="div">
                    Account: <EthAddress value={address?.address} full />
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Box>Hop Bridge User:</Box>
                <CriteriaCircle criteria={eligibility?.bridgeUserAirdrop} />
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Box>Liquidity Provider:</Box>
                <CriteriaCircle criteria={eligibility?.lpAirdrop} />
              </Box>
              <Box display="flex" mt={5}>
                <Typography variant="body1" component="div">
                  <em>An announcement will be made by the Hop team on the official announcement channels when tokens are ready to be claimed.</em>
                </Typography>
              </Box>
            </Box>
          </>
        )}
        </Box>

      </AirdropPreviewWrapper>
      <Box my={5} display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%">
        <Box display="flex" flexDirection="column" justifyContent="center" justifyItems="center" my={2}>
          <Box>
            <Typography variant="body1" component="div">
              Check if your Discord or Twitter account is eligible for the <strong>Active User</strong> airdrop
            </Typography>
          </Box>
          <Box m={2}>
            <StyledButton href={"/airdrop/social-verify"}>
              Check Social Account
            </StyledButton>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" justifyItems="center">
          <Box>
            <Typography variant="body1" component="div">
              Check if your Authereum account is eligible for the <strong>Authereum User</strong> airdrop
            </Typography>
          </Box>
          <Box m={2}>
            <StyledButton href={"https://authereum.hop.exchange/check"}>
              Check Authereum Account
            </StyledButton>
          </Box>
        </Box>
      </Box>
    </>
  )
}
