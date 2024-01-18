import { Icon } from 'src/components/ui/Icon'
import Box from '@material-ui/core/Box'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import hopTokenLogo from 'src/assets/logos/hop-token-logo.svg'
import { BigNumber } from 'ethers'
import { Button } from 'src/components/Button/Button'
import { TokenClaim } from 'src/pages/Claim/useClaim'
import { toTokenDisplay } from 'src/utils'

interface ClaimTokensProps {
  claim?: TokenClaim
  claimableTokens: BigNumber
  warning?: string
  nextStep?: () => void
  setStep?: (step: number) => void
  isDarkMode: boolean
}

export function ClaimStart(props: ClaimTokensProps) {
  const { claimableTokens, nextStep } = props

  return (
    <>
      <Box display="flex" flexDirection="column">
        <Box mt={3} display="flex" flexDirection="column" justifyContent="center" alignItems="center" textAlign="left" width="100%">
          <Typography variant="body1">
            You're eligible for the airdrop!
            You have received these tokens for being an active participant of the Hop protocol.
          </Typography>
        </Box>
        {!claimableTokens.eq(0) && (
          <Box
            my={4}
            p={3}
            px={24}
            width="100%"
            boxShadow="mutedDark"
            borderRadius="30px"
          >
            <Box mb={2} textAlign="left">
              <Typography variant="body1">
                You will receive
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" width="100%">
              <Box mr={2}>
                <Typography variant="h4">
                  {toTokenDisplay(claimableTokens || '0', 18)}
                </Typography>
              </Box>

              <Icon src={hopTokenLogo} alt="HOP" width={32} />
            </Box>
          </Box>
        )}
      </Box>

      <Box display="flex" flexDirection="column" my={2}>
        {!claimableTokens.eq(0) && (
          <Box mb={3} textAlign="center" width="100%">
            <Typography variant="body1" color="secondary">
            Continue with delegation and claim process.
            </Typography>
          </Box>
        )}

        <Box mt={2} display="flex" justifyContent="center" width="100%">
          <Button large highlighted onClick={nextStep} disabled={claimableTokens.eq(0)}>
            Start Claim
          </Button>
        </Box>
      </Box>
    </>
  )
}
