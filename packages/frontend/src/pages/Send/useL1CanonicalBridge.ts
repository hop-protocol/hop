import { useEffect, useState } from 'react'
import { ChainId, NetworkSlug, Token } from '@hop-protocol/sdk'
import { BigNumber, constants } from 'ethers'
import Network from 'src/models/Network'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useLocalStorage } from 'react-use'
import logger from 'src/logger'
import { formatError } from 'src/utils'
import CanonicalBridge from 'src/models/CanonicalBridge'

async function needsApproval(l1CanonicalBridge: CanonicalBridge, sourceToken, sourceTokenAmount) {
  if (sourceToken.isNativeToken) {
    return
  }

  const allowance = await l1CanonicalBridge.getL1CanonicalAllowance()
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
  const { checkConnectedNetworkId, provider } = useWeb3Context()

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
    if (!(sourceToken && destNetwork && sourceTokenAmount)) {
      return setL1CanonicalBridge(undefined)
    }

    if (sourceToken.chain.chainId !== ChainId.Ethereum) {
      return setL1CanonicalBridge(undefined)
    }

    const signer = provider?.getSigner()
    if (signer) {
      const canonicalBridge = new CanonicalBridge(
        NetworkSlug.Mainnet,
        signer,
        sourceToken.symbol,
        destNetwork.slug
      )
      setL1CanonicalBridge(canonicalBridge)
    }
  }, [provider, sourceTokenAmount?.toString(), sourceToken?.chain.chainId, destNetwork?.slug])

  async function sendL1CanonicalBridge() {
    if (!(l1CanonicalBridge && sourceTokenAmount)) {
      return
    }

    try {
      const isNetworkConnected = await checkConnectedNetworkId(1)
      if (!isNetworkConnected) return

      if (await needsApproval(l1CanonicalBridge, sourceToken, sourceTokenAmount)) {
        const approveTx = await l1CanonicalBridge.approve(constants.MaxUint256)

        await approveTx.wait(1)
      }

      const tx = await l1CanonicalBridge.deposit(sourceTokenAmount)
      console.log(`tx:`, tx)
    } catch (error: any) {
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
