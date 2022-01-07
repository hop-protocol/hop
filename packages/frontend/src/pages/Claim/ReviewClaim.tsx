import React from 'react'
import { Circle, Div, Flex, Icon } from 'src/components/ui'
import { Text } from 'src/components/ui/Text'
import Button from 'src/components/buttons/Button'
import hopTokenLogo from 'src/assets/logos/hop-token-logo.svg'
import { toTokenDisplay } from 'src/utils'
import { BigNumber } from 'ethers'
import { StyledButton } from 'src/components/buttons/StyledButton'

export function ReviewClaim(props) {
  const { claimableTokens, delegate, isDarkMode, handleClaimTokens, prevStep } = props
  const tokenClaims = BigNumber.from(claimableTokens)

  return (
    <>
      <Flex column>
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
          <Text mb={2} textAlign="left" color="text.primary">
            You will receive
          </Text>
          <Flex alignCenter fullWidth>
            <Text fontSize={28} mr={2} mono textAlign="left" color="text.primary">
              {toTokenDisplay(claimableTokens, 18)}
            </Text>

            <Icon src={hopTokenLogo} alt="HOP Token Logo" />
          </Flex>
        </Div>
      </Flex>

      <Flex column mb={4}>
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
          <Flex alignCenter justifyBetween>
            <Div overflow={'hidden'}>
              <Text mb={2} textAlign="left" color="text.primary">
                You're delegating to
              </Text>
              <Flex alignCenter>
                {delegate.avatar && (
                  <Circle mr={2}>
                    <Icon src={delegate.avatar} width={45} />
                  </Circle>
                )}
                <Div color="text.primary" fontSize={[1, 2]}>
                  {delegate.ensName || delegate.address}
                </Div>
              </Flex>
            </Div>

            <StyledButton borderRadius={2} onClick={prevStep}>
              Edit
            </StyledButton>
          </Flex>
        </Div>

        <Flex mt={2} justifyCenter fullWidth>
          <Button large highlighted onClick={handleClaimTokens} disabled={tokenClaims.eq(0)}>
            <Div width="220px">Claim</Div>
          </Button>
        </Flex>
      </Flex>
    </>
  )
}
