import React from 'react'
import { Div, Flex, Text } from 'src/components/ui'
import { Loading } from 'src/components/Loading'
import { StyledLink } from 'src/components/ui/StyledLink'
import { BigNumber } from 'ethers'
import Button from 'src/components/buttons/Button'
import { getEtherscanLink, getTruncatedHash } from 'src/utils'
import { correctClaimChain } from 'src/utils/claims'
import Box from '@material-ui/core/Box'

export function Claiming(props: any) {
  const { isDarkMode, claiming, tx, delegate, handleClaimTokens, claimableTokens, showTryAgain } = props

  return (
    <>
      <Text my={3} fontSize={2} bold secondary textAlign="left">
        Please approve the transaction to delegate and claim your tokens.
      </Text>

      <Flex
        p={3}
        px={4}
        alignCenter
        bg={isDarkMode ? '#1F1E23' : 'white'}
        borderRadius={'25px'}
        boxShadow={'0px 4px 25px 10px rgba(255, 255, 255, 0.01)'}
      >
        {delegate.avatar && (
          <Loading size={50} load={claiming} imgSrc={delegate.avatar} />
        )}
        <Div color="text.secondary" ml={2} p={2} textAlign="left">
          <Text primary textAlign="left" mb={2}>
            Delegate and claim tokens
          </Text>
          <Div>This transaction happens on-chain and will require paying gas</Div>
        </Div>
      </Flex>

      {tx && (
        <Flex mt={3} justifyCenter color="secondary.main">
          Transaction:&nbsp;
          <StyledLink
            href={getEtherscanLink(
              correctClaimChain.id,
              tx.transactionHash || tx.hash,
              'transaction'
            )}
          >
            {getTruncatedHash(tx.transactionHash || tx.hash)} ↗
          </StyledLink>
        </Flex>
      )}
      {showTryAgain && (
        <Box mt={5}>
          <Flex mt={2} justifyCenter fullWidth>
            <Button large highlighted onClick={handleClaimTokens} disabled={claimableTokens.eq(0)}>
              <Div width="220px">Try Again</Div>
            </Button>
          </Flex>
        </Box>
      )}
    </>
  )
}
