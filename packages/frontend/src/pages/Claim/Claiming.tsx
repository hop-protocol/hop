import React from 'react'
import { Div, Flex, Text } from 'src/components/ui'
import { Loading } from 'src/components/Loading'
import { StyledLink } from 'src/components/ui/StyledLink'
import { getEtherscanLink, getTruncatedHash } from 'src/utils'
import { correctClaimChain } from 'src/utils/claims'

export function Claiming(props) {
  const { isDarkMode, claiming, tx, delegate } = props

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
        <Loading size={50} load={claiming} imgSrc={delegate.avatar} />
        <Div color="text.secondary" ml={2} p={2}>
          <Text primary textAlign="left" mb={2}>
            Delegate & claim tokens
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
    </>
  )
}
