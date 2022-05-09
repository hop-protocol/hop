import React from 'react'
import { Flex } from 'src/components/ui'
import { Loading } from 'src/components/Loading'
import { StyledLink } from 'src/components/ui/StyledLink'
import { BigNumber } from 'ethers'
import Button from 'src/components/buttons/Button'
import { toTokenDisplay, getEtherscanLink, getTruncatedHash } from 'src/utils'
import { correctClaimChain } from 'src/utils/claims'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

export function Claiming(props: any) {
  const { isDarkMode, claiming, tx, delegate, handleClaimTokens, claimableTokens, showTryAgain } = props

  return (
    <Box display="flex" flexDirection="column">
      <Box my={3} textAlign="center">
        <Typography variant="body1">
          Please approve the transaction to delegate and claim your tokens.
        </Typography>
      </Box>

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
        <Box ml={2} p={2} textAlign="left">
          <Box mb={1}>
            <Typography variant="body1">
              Delegate and claim tokens
            </Typography>
          </Box>
          <Box mb={1}>
            <Typography variant="body1">
              {toTokenDisplay(claimableTokens, 18)} HOP
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              This transaction happens on-chain and will require paying gas
            </Typography>
          </Box>
        </Box>
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
      {(showTryAgain && !claiming) && (
        <Box mt={4}>
          <Button large highlighted onClick={handleClaimTokens} disabled={claimableTokens.eq(0)}>
            Try Again
          </Button>
        </Box>
      )}
      {claiming && (
        <Box mt={4}>
          <Button large highlighted disabled={claiming}>
            Claiming
          </Button>
        </Box>
      )}
    </Box>
  )
}
