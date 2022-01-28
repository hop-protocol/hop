import React, { useEffect, useState } from 'react'
import { CanonicalBridge, ChainId, ChainSlug, Token } from '@hop-protocol/sdk'
import { BigNumber, constants } from 'ethers'
import { useApp } from 'src/contexts/AppContext'
import Network from 'src/models/Network'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { getProviderByNetworkName, toTokenDisplay } from 'src/utils'
import { getGasCostByGasLimit } from 'src/hooks'

async function needsApproval(l1CanonicalBridge: CanonicalBridge, token, amount, destNetwork) {
  if (token.isNativeToken) {
    return
  }
  if (Number(destNetwork.networkId) === ChainId.Arbitrum) {
    return
  }
  const allowance = await l1CanonicalBridge.getL1CanonicalAllowance(l1CanonicalBridge.chain)
  if (allowance.lt(amount)) {
    return true
  }
}

export function useL1CanonicalBridge(
  token?: Token,
  destNetwork?: Network,
  amount?: BigNumber,
  estimatedReceived?: BigNumber,
  estimatedGasCost?: BigNumber
) {
  const { sdk } = useApp()
  const { checkConnectedNetworkId } = useWeb3Context()

  const [l1CanonicalBridge, setL1CanonicalBridge] = useState<CanonicalBridge | undefined>()

  useEffect(() => {
    async function checkIfL1CanonicalBridgeIsCheaper() {
      if (!(token && destNetwork && estimatedReceived && amount)) {
        console.log(token, destNetwork, estimatedReceived, amount)
        return setL1CanonicalBridge(undefined)
      }

      const canonicalBridge = sdk.canonicalBridge(token.symbol, destNetwork.slug)
      const l1Provider = getProviderByNetworkName(ChainSlug.Ethereum)

      const canonDepositEstGasLimit = BigNumber.from(200e3)

      const canonicalTotalTxCostEstimate = await getGasCostByGasLimit(
        l1Provider,
        canonDepositEstGasLimit
      )

      // if (await needsApproval(canonicalBridge, token, amount, destNetwork)) {
      //   const canonicalApproveGasEstimate = await canonicalBridge.estimateApproveTx(
      //     amount,
      //     destNetwork.slug
      //   )

      //   const approveGasCostWei = await getGasCostByGasLimit(
      //     l1Provider,
      //     canonicalApproveGasEstimate
      //   )
      //   canonicalTotalTxCostEstimate = canonicalTotalTxCostEstimate.add(approveGasCostWei)
      // }

      console.log('')
      console.log(`      hop gas:`, toTokenDisplay(estimatedGasCost))
      console.log(`canonical gas:`, toTokenDisplay(canonicalTotalTxCostEstimate))
      // const canonicalReceived = amount.sub(canonicalTotalTxCostEstimate)
      // const hopReceived = estimatedReceived.sub(estimatedGasCost)

      // L1 canonical bridge value > hop bridge
      const moreTokensReceived = amount.gt(estimatedReceived)
      // const cheaperGasCost = canonicalTotalTxCostEstimate.lt(estimatedGasCost)
      console.log(`moreTokensReceived via canon:`, moreTokensReceived)
      // console.log(`cheaperGasCost via canonical:`, cheaperGasCost)

      setL1CanonicalBridge(canonicalBridge)
      // if (moreTokensReceived && cheaperGasCost) {
      //   return setL1CanonicalBridge(canonicalBridge)
      // }

      // setL1CanonicalBridge(undefined)
    }

    checkIfL1CanonicalBridgeIsCheaper()
  }, [
    sdk,
    amount?.toString(),
    token?.symbol,
    destNetwork?.slug,
    estimatedReceived,
    estimatedGasCost,
  ])

  async function sendL1CanonicalBridge() {
    if (!(l1CanonicalBridge && amount && destNetwork?.slug)) {
      return
    }

    try {
      const isNetworkConnected = await checkConnectedNetworkId(1)
      if (!isNetworkConnected) return

      if (await needsApproval(l1CanonicalBridge, token, amount, destNetwork)) {
        const approveTx = await l1CanonicalBridge.approveDeposit(
          constants.MaxUint256,
          destNetwork.slug
        )
        await approveTx.wait(1)
      }

      const tx = await l1CanonicalBridge.deposit(amount, destNetwork.slug)
      console.log(`tx:`, tx)
    } catch (error: any) {
      console.log(`error:`, error)
      if (error.message?.includes('revert')) {
        // noop
      }
    }
  }

  return {
    sendL1CanonicalBridge,
    l1CanonicalBridge,
  }
}
