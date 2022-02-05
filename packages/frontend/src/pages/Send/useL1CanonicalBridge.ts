import React, { useEffect, useState } from 'react'
import { CanonicalBridge, ChainId, ChainSlug, Token } from '@hop-protocol/sdk'
import { BigNumber, constants } from 'ethers'
import { useApp } from 'src/contexts/AppContext'
import Network from 'src/models/Network'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useLocalStorage } from 'react-use'
import logger from 'src/logger'
import { formatError } from 'src/utils'

async function needsApproval(
  l1CanonicalBridge: CanonicalBridge,
  sourceToken,
  sourceTokenAmount,
  destNetwork
) {
  if (sourceToken.isNativeToken) {
    return
  }
  if (Number(destNetwork.networkId) === ChainId.Arbitrum) {
    return
  }
  const allowance = await l1CanonicalBridge.getL1CanonicalAllowance(l1CanonicalBridge.chain)
  if (allowance.lt(sourceTokenAmount)) {
    return true
  }
}

export function useL1CanonicalBridge(
  sourceToken?: Token,
  sourceTokenAmount?: BigNumber,
  destNetwork?: Network,
  estimatedReceived?: BigNumber
) {
  const { sdk } = useApp()
  const { checkConnectedNetworkId } = useWeb3Context()

  const [l1CanonicalBridge, setL1CanonicalBridge] = useState<CanonicalBridge | undefined>()
  const [usingL1CanonicalBridge, setUl1cb] = useLocalStorage('using-l1-canonical-bridge', false)

  useEffect(() => {
    if (sourceTokenAmount && estimatedReceived && l1CanonicalBridge) {
      if (usingL1CanonicalBridge == null && sourceTokenAmount.gt(estimatedReceived)) {
        return setUl1cb(true)
      }

      if (sourceTokenAmount.lte(estimatedReceived)) {
        setUl1cb(false)
      }
    }
  }, [sourceTokenAmount?.toString(), estimatedReceived?.toString(), l1CanonicalBridge])

  useEffect(() => {
    async function setupCanonicalBridge() {
      if (!(sourceToken && destNetwork && sourceTokenAmount)) {
        return setL1CanonicalBridge(undefined)
      }

      if (sourceToken.chain.chainId !== ChainId.Ethereum) {
        return setL1CanonicalBridge(undefined)
      }

      const canonicalBridge = sdk.canonicalBridge(sourceToken.symbol, destNetwork.slug)
      setL1CanonicalBridge(canonicalBridge)
    }

    setupCanonicalBridge()
  }, [sdk, sourceTokenAmount?.toString(), sourceToken, destNetwork?.slug])

  async function sendL1CanonicalBridge() {
    if (!(l1CanonicalBridge && sourceTokenAmount && destNetwork?.slug)) {
      return
    }

    try {
      const isNetworkConnected = await checkConnectedNetworkId(1)
      if (!isNetworkConnected) return

      if (await needsApproval(l1CanonicalBridge, sourceToken, sourceTokenAmount, destNetwork)) {
        const approveTx = await l1CanonicalBridge.approveDeposit(
          constants.MaxUint256,
          destNetwork.slug
        )
        await approveTx.wait(1)
      }

      const tx = await l1CanonicalBridge.deposit(sourceTokenAmount, destNetwork.slug)
      console.log(`tx:`, tx)
    } catch (error: any) {
      //   if (error.message?.includes('revert')) {
      //     // noop
      //   }
      logger.error(formatError(error))
    }
  }

  return {
    sendL1CanonicalBridge,
    l1CanonicalBridge,
    usingL1CanonicalBridge,
    setUl1cb,
  }
}
