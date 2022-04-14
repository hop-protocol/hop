import { useEffect, useState } from 'react'
import { ChainId, Hop, NetworkSlug, Token } from '@hop-protocol/sdk'
import { BigNumber, BigNumberish, constants } from 'ethers'
import Network from 'src/models/Network'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import { findNetworkById, formatError, toTokenDisplay } from 'src/utils'
import CanonicalBridge from 'src/models/CanonicalBridge'
import { l1Network } from 'src/config/networks'
import { TxConfirm } from 'src/contexts/AppContext/useTxConfirm'
import { useQuery } from 'react-query'

interface Options {
  customRecipient?: string
}

export function useL1CanonicalBridge(
  sdk?: Hop,
  sourceToken?: Token,
  sourceTokenAmount?: BigNumber,
  destNetwork?: Network,
  estimatedReceived?: BigNumber,
  txConfirm?: TxConfirm,
  options?: any
) {
  const { checkConnectedNetworkId, provider } = useWeb3Context()
  const [l1CanonicalBridge, setL1CanonicalBridge] = useState<CanonicalBridge | undefined>()
  const [usingNativeBridge, setUsingNativeBridge] = useState(false)
  const [userSpecifiedBridge, setUserSpecifiedBridge] = useState(false)
  const {
    customRecipient,
    handleTransaction,
    setSending,
    setTx,
    waitForTransaction,
    updateTransaction,
    setError,
    setApproving,
  } = options

  function selectNativeBridge(val: boolean) {
    setUsingNativeBridge(val)
    setUserSpecifiedBridge(true)
  }

  const sourceNetwork = findNetworkById(sourceToken?.chain.chainId!)

  const { data: needsNativeBridgeApproval } = useQuery(
    [
      `needsNativeBridgeApproval:${l1CanonicalBridge?.address}:${sourceTokenAmount?.toString()}`,
      l1CanonicalBridge?.address,
      sourceTokenAmount?.toString(),
      usingNativeBridge,
    ],
    async () => {
      if (!(usingNativeBridge && l1CanonicalBridge && sourceTokenAmount)) {
        return
      }

      const allowance = await l1CanonicalBridge.getL1CanonicalAllowance()
      return allowance?.lt(sourceTokenAmount)
    },
    {
      enabled:
        !!usingNativeBridge && !!l1CanonicalBridge?.address && !!sourceTokenAmount?.toString(),
      refetchInterval: 10e3,
    }
  )

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
  }, [provider, sourceTokenAmount?.toString(), sourceToken, destNetwork?.slug])

  const approveNativeBridge = async () => {
    if (!(needsNativeBridgeApproval && l1CanonicalBridge && txConfirm)) {
      return
    }

    try {
      setApproving(true)
      const tx: any = await txConfirm.show({
        kind: 'approval',
        inputProps: {
          tagline: `Allow Hop to spend your ${sourceToken?.symbol} on ${sourceToken?.chain.name}`,
          source: {
            network: {
              slug: sourceToken?.chain.slug,
              networkId: sourceToken?.chain.chainId,
            },
          },
        },
        onConfirm: async () => {
          const approveAmount = constants.MaxUint256

          const networkId = sourceToken!.chain.chainId
          const isNetworkConnected = await checkConnectedNetworkId(networkId)
          if (!isNetworkConnected) return

          return l1CanonicalBridge.approve(approveAmount as BigNumberish)
        },
      })

      setApproving(false)
      if (tx?.hash) {
        return handleTransaction(tx, sourceNetwork, destNetwork, sourceToken)
      }
    } catch (error: any) {
      setApproving(false)
      if (!/cancelled/gi.test(error.message)) {
        // noop
        return
      }
      throw new Error(error.message)
    }
  }

  async function sendL1CanonicalBridge() {
    if (
      !(
        sdk &&
        l1CanonicalBridge &&
        sourceToken &&
        sourceTokenAmount &&
        sourceNetwork &&
        destNetwork &&
        !needsNativeBridgeApproval &&
        txConfirm
      )
    ) {
      return
    }

    // const shouldApproveNativeBridge = await needsNativeBridgeApproval(
    //   l1CanonicalBridge,
    //   sourceToken,
    //   sourceTokenAmount
    // )

    // setSending(true)

    // if (shouldApproveNativeBridge) {
    //   const approveTx = await l1CanonicalBridge.approve(constants.MaxUint256)
    //   await approveTx.wait()
    // }

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
          const isNetworkConnected = await checkConnectedNetworkId(l1Network.networkId)
          if (!isNetworkConnected) return

          return l1CanonicalBridge.deposit(sourceTokenAmount)
        } catch (error: any) {
          if (!/cancelled/gi.test(error.message)) {
            // noop
            return
          }
          logger.error(formatError(error))
        }
      },
    })
    logger.debug(`tx:`, tx)

    const txHandled = handleTransaction(tx, sourceNetwork, destNetwork, sourceToken)
    logger.debug(`txHandled:`, txHandled)

    const { transaction, txModel } = txHandled

    const watcher = (sdk as Hop).watch(
      txModel.hash,
      sourceToken.symbol,
      sourceNetwork.slug,
      destNetwork.slug
    )

    if (watcher) {
      watcher.once(sdk.Event.DestinationTxReceipt, async data => {
        logger.debug(`dest tx receipt event data:`, data)
        if (txModel && !txModel.destTxHash) {
          const opts = {
            destTxHash: data.receipt.transactionHash,
            pendingDestinationConfirmation: false,
          }
          updateTransaction(txModel, opts)
        }
      })
    }

    setTx(txModel)

    const txModelArgs = {
      networkName: sourceNetwork,
      destNetworkName: destNetwork,
      token: sourceToken,
    }

    // TODO: DRY. this is copied from useSendTransaction and shouldn't be re-written
    const res = await waitForTransaction(transaction, txModelArgs)

    if (res && 'replacementTxModel' in res) {
      setTx(res.replacementTxModel)
      const { replacementTxModel: txModelReplacement } = res

      if (sourceNetwork && destNetwork) {
        // Replace watcher
        const replacementWatcher = sdk?.watch(
          txModelReplacement.hash,
          sourceToken!.symbol,
          sourceNetwork?.slug,
          destNetwork?.slug
        )
        replacementWatcher.once(sdk?.Event.DestinationTxReceipt, async data => {
          logger.debug(`replacement dest tx receipt event data:`, data)
          if (txModelReplacement && !txModelReplacement.destTxHash) {
            const opts = {
              destTxHash: data.receipt.transactionHash,
              pendingDestinationConfirmation: false,
              replaced: transaction.hash,
            }
            updateTransaction(txModelReplacement, opts)
          }
        })
      }
    }

    setSending(false)

    return handleTransaction(tx, sourceNetwork, destNetwork, sourceToken)
  }

  return {
    sendL1CanonicalBridge,
    l1CanonicalBridge,
    usingNativeBridge,
    setUsingNativeBridge,
    selectNativeBridge,
    approveNativeBridge,
    needsNativeBridgeApproval,
  }
}
