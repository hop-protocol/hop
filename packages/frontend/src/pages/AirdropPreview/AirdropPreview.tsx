import React from 'react'
import { Div, EthAddress, Flex } from 'src/components/ui'
import { useAirdropPreview } from './useAirdropPreview'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { CriteriaCircle } from './CriteriaCircle'
import { AirdropPreviewWrapper } from './AirdropPreviewWrapper'

export const respMaxWidths = [350, 624, 824]

export function AirdropPreview() {
  const { address } = useWeb3Context()
  const { eligibility } = useAirdropPreview(address)

  return (
    <AirdropPreviewWrapper>
      <Flex column alignCenter>
        <Div fontSize={[18, 4, 5]} color="text.primary">
          Hop Token Airdrop Preview
        </Div>

        <Div px={4}>
          {!eligibility?.isEligible ? (
            <Div textAlign={'center'} m={3} fontSize={16} bold color="text.secondary">
              Sorry! the connected account is not eligible for the Hop airdrop :( Please view
              details below.
            </Div>
          ) : (
            <Div textAlign={'center'} m={3} fontSize={16} bold color="text.secondary">
              You are eligible for the Hop airdrop! Please view your Airdrop preview details below.
            </Div>
          )}
        </Div>

        <Flex column p={1}>
          <Flex column fontWeight={600} justifyCenter p={2} my={3}>
            <Div fontSize={1} mr={3}>
              Connected Account:
            </Div>
            <EthAddress value={address?.address} full textAlign="center" />
          </Flex>

          <Flex fullWidth justifyBetween py={2} px={4}>
            <Div>Hop Bridge User:</Div>
            <CriteriaCircle criteria={eligibility?.bridgeUserAirdrop} />
          </Flex>

          <Flex fullWidth justifyBetween py={2} px={4}>
            <Div>Liquidity Provider:</Div>
            <CriteriaCircle criteria={eligibility?.lpAirdrop} />
          </Flex>
        </Flex>
      </Flex>
    </AirdropPreviewWrapper>
  )
}
