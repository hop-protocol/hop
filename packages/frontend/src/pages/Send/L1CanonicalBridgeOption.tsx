import React from 'react'
import { CanonicalBridge, Token } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import { Flex } from 'src/components/ui'
import { toTokenDisplay } from 'src/utils'

interface Props {
  sendL1CanonicalBridge?: () => void
  l1CanonicalBridge?: CanonicalBridge
  destToken?: Token
  amount?: BigNumber
}

function L1CanonicalBridgeOption(props: Props) {
  const { l1CanonicalBridge, sendL1CanonicalBridge, destToken, amount } = props

  return (
    <Flex>
      {l1CanonicalBridge && (
        <Flex column>
          <Flex>L1 Canonical Bridge:</Flex>
          <Flex onClick={sendL1CanonicalBridge}>{l1CanonicalBridge.address}</Flex>
          <Flex>{toTokenDisplay(amount, destToken?.decimals, destToken?.symbol)}</Flex>
        </Flex>
      )}
    </Flex>
  )
}

export default L1CanonicalBridgeOption
