import React, { useEffect, useState } from 'react'
import { CanonicalBridge, Token } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import { Flex } from 'src/components/ui'
import { useApp } from 'src/contexts/AppContext'
import { useEstimateTxCost } from 'src/hooks'
import { amountToBN } from 'src/utils'
import Network from 'src/models/Network'
import { useWeb3Context } from 'src/contexts/Web3Context'

interface Props {
  estimatedAmount?: string
  token?: Token
  destNetwork?: Network
  amount?: BigNumber
}

function L1CanonicalBridgeOption({ estimatedAmount = '', token, destNetwork, amount }: Props) {
  const { sdk } = useApp()
  const { address } = useWeb3Context()
  const { estimateSend } = useEstimateTxCost()

  const [l1CanonicalBridge, setL1CanonicalBridge] = useState<CanonicalBridge | undefined>()

  useEffect(() => {
    if (!(token && destNetwork && estimatedAmount && amount)) {
      return setL1CanonicalBridge(undefined)
    }

    const estReceived = amountToBN(estimatedAmount, token.decimals)
    const lessValueReceived = estReceived.lt(amount)

    if (lessValueReceived) {
      const canonicalBridge = sdk.canonicalBridge(token.symbol, destNetwork.slug)
      return setL1CanonicalBridge(canonicalBridge)
    }

    setL1CanonicalBridge(undefined)
  }, [sdk, amount?.toString(), estimatedAmount, token?.symbol, destNetwork?.slug])

  useEffect(() => {
    async function getEst() {
      if (!(l1CanonicalBridge && amount && destNetwork?.slug)) {
        return
      }

      try {
        const est = await l1CanonicalBridge.estimateDepositTx(amount, destNetwork.slug)
        console.log(`est:`, est?.toString())

        //   const canonicalBridgeTotal = fromAmount.sub(estimatedGas)
        //   const hopBridgeTotal = data?.estimatedReceived!
        //   if (hopBridgeTotal && canonicalBridgeTotal.gt(hopBridgeTotal)) {
        //     console.log('use canonical bridge')
        //   }
      } catch (error: any) {
        if (error.message?.includes('revert')) {
          // noop
          return
        }
        console.log(`error:`, error)
      }
    }

    getEst()
  }, [l1CanonicalBridge, amount?.toString(), destNetwork?.slug])

  return (
    <Flex>
      {l1CanonicalBridge && (
        <Flex column>
          <Flex>L1 Canonical Bridge:</Flex>
          <Flex>{l1CanonicalBridge.address}</Flex>
        </Flex>
      )}
    </Flex>
  )
}

export default L1CanonicalBridgeOption
