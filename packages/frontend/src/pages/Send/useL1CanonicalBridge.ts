import { useEffect, useState } from 'react'
import { ChainId, NetworkSlug, Token } from '@hop-protocol/sdk'
import { BigNumber, constants } from 'ethers'
import Network from 'src/models/Network'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import { findNetworkById, formatError, toTokenDisplay } from 'src/utils'
import CanonicalBridge from 'src/models/CanonicalBridge'
import { handleTransaction } from './useSendTransaction'
import { useTransactionReplacement } from 'src/hooks'

async function needsApproval(l1CanonicalBridge: CanonicalBridge, sourceToken, sourceTokenAmount) {
  if (sourceToken.isNativeToken) {
    return
  }

  const allowance = await l1CanonicalBridge.getL1CanonicalAllowance()
  if (allowance.lt(sourceTokenAmount)) {
    return true
  }
}

interface Options {
  customRecipient?: string
}

export function useL1CanonicalBridge(
  sourceToken?: Token,
  sourceTokenAmount?: BigNumber,
  destNetwork?: Network,
  estimatedReceived?: BigNumber,
  txConfirm?: any,
  options?: Options
) {
  const { checkConnectedNetworkId, provider } = useWeb3Context()

  const [l1CanonicalBridge, setL1CanonicalBridge] = useState<CanonicalBridge | undefined>()
  const [usingNativeBridge, setUsingNativeBridge] = useState(false)
  const [userSpecifiedBridge, setUserSpecifiedBridge] = useState(false)
  const { addTransaction } = useTransactionReplacement()

  function selectNativeBridge(val: boolean) {
    setUsingNativeBridge(val)
    setUserSpecifiedBridge(true)
  }

  useEffect(() => {
    if (userSpecifiedBridge) return

    if (sourceTokenAmount && estimatedReceived && l1CanonicalBridge) {
      if (!usingNativeBridge && sourceTokenAmount.gt(estimatedReceived)) {
        setUsingNativeBridge(true)
      } else if (sourceTokenAmount.lte(estimatedReceived)) {
        setUsingNativeBridge(false)
      }
    }

    return () => setUserSpecifiedBridge(false)
  }, [sourceTokenAmount?.toString(), estimatedReceived?.toString(), l1CanonicalBridge, destNetwork])

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

    const sourceNetwork = findNetworkById(sourceToken?.chain.chainId.toString()!)

    if (await needsApproval(l1CanonicalBridge, sourceToken, sourceTokenAmount)) {
      const approveTx = await l1CanonicalBridge.approve(constants.MaxUint256)
      await approveTx.wait(1)
    }

    const tx: any = await txConfirm.show({
      kind: 'depositNativeBridge',
      inputProps: {
        customRecipient: options?.customRecipient,
        source: {
          amount: toTokenDisplay(sourceTokenAmount, sourceToken?.decimals),
          token: sourceToken,
          network: sourceNetwork,
        },
        dest: {
          network: destNetwork,
        },
        estimatedReceived: toTokenDisplay(
          estimatedReceived,
          sourceToken?.decimals,
          sourceToken?.symbol
        ),
      },
      onConfirm: async () => {
        try {
          const isNetworkConnected = await checkConnectedNetworkId(1)
          if (!isNetworkConnected) return

          return l1CanonicalBridge.deposit(sourceTokenAmount)
        } catch (error: any) {
          logger.error(formatError(error))
        }
      },
    })

    console.log(`tx:`, tx)

    return handleTransaction(tx, sourceNetwork, destNetwork, sourceToken, addTransaction)
  }

  return {
    sendL1CanonicalBridge,
    l1CanonicalBridge,
    usingNativeBridge,
    setUsingNativeBridge,
    selectNativeBridge,
  }
}
