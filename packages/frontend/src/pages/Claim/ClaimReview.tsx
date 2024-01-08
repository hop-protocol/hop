import React from 'react'
import { Div, Icon } from 'src/components/ui'
import { Button } from 'src/components/Button'
import hopTokenLogo from 'src/assets/logos/hop-token-logo.svg'
import { toTokenDisplay } from 'src/utils'
import { BigNumber } from 'ethers'
import Box from '@material-ui/core/Box'
import { StyledButton } from 'src/components/Button/StyledButton'
import Typography from '@material-ui/core/Typography'
import { DelegateIcon } from 'src/pages/Claim/DelegateIcon'

export function ClaimReview (props: any) {
  const { claimableTokens, delegate, isDarkMode, handleClaimTokens, prevStep } = props
  const tokenClaims = BigNumber.from(claimableTokens)

  return (
    <>
      <Box display="flex" flexDirection="column">
        <Div
          my={3}
          mt={4}
          p={3}
          px={24}
          fullWidth
          boxShadow="mutedDark"
          bg={isDarkMode ? `black.muted` : 'white'}
          borderRadius="30px"
        >
          <Box mb={2} textAlign="left">
            <Typography variant="body1">
              You will receive
            </Typography>
          </Box>
          <Box display="flex" justifyContent="content" width="100%">
            <Box mr={2}>
              <Typography variant="h4">
                {toTokenDisplay(claimableTokens, 18)}
              </Typography>
            </Box>

            <Icon src={hopTokenLogo} alt="HOP" width={32} />
          </Box>
        </Div>
      </Box>

      <Box display="flex" flexDirection="column">
        <Div
          my={3}
          mb={3}
          p={3}
          px={24}
          fullWidth
          boxShadow="mutedDark"
          bg={isDarkMode ? `black.muted` : 'white'}
          borderRadius="30px"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Box mb={2} textAlign="left">
                <Typography variant="body1">
                  You're delegating to
                </Typography>
              </Box>
              <Box display="flex" textAlign="center">
                <Box mr={2}>
                  <DelegateIcon delegate={delegate} />
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center" textAlign="left">
                  <Box>
                    <Typography variant="body1">
                      {delegate.address?.truncate()}
                    </Typography>
                  </Box>
                  {!!delegate.ensName && (
                    <Box>
                      <Typography variant="body1" color="secondary">
                        {delegate.ensName}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            <Box>
              <StyledButton borderRadius={2} onClick={prevStep}>
                Edit
              </StyledButton>
            </Box>
          </Box>
        </Div>

        <Box mt={2} display="flex" justifyContent="center" width="100%">
          <Button large highlighted onClick={handleClaimTokens} disabled={tokenClaims.eq(0)}>
            Claim
          </Button>
        </Box>
      </Box>
    </>
  )
}
