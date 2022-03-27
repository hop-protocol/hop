import { useCallback, useEffect, useState } from 'react'
import { ChainId, Hop, NetworkSlug, Token } from '@hop-protocol/sdk'
import { BigNumber, BigNumberish, constants } from 'ethers'
import Network from 'src/models/Network'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import { findNetworkById, formatError, toTokenDisplay } from 'src/utils'
import CanonicalBridge from 'src/models/CanonicalBridge'
import { useApprove } from 'src/hooks'
import { l1Network } from 'src/config/networks'
import useTxConfirm from 'src/contexts/AppContext/useTxConfirm'

interface Options {
  customRecipient?: string
}

export function useL1CanonicalBridge(
  sdk?: Hop,
  sourceToken?: Token,
  sourceTokenAmount?: BigNumber,
  destNetwork?: Network,
  estimatedReceived?: BigNumber,
  txConfirm?: any,
  options?: any
) {
  const { checkConnectedNetworkId, provider } = useWeb3Context()
  const { txConfirmParams, show } = useTxConfirm(options)
  const [l1CanonicalBridge, setL1CanonicalBridge] = useState<CanonicalBridge | undefined>()
  const [usingNativeBridge, setUsingNativeBridge] = useState(false)
  const [userSpecifiedBridge, setUserSpecifiedBridge] = useState(false)
  const { handleTransaction, setTx, setSending, waitForTransaction, updateTransaction } = options

  function selectNativeBridge(val: boolean) {
    setUsingNativeBridge(val)
    setUserSpecifiedBridge(true)
  }

  const sourceNetwork = findNetworkById(sourceToken?.chain.chainId!)

  const { needsNativeBridgeApproval } = useApprove(sourceToken, sourceNetwork, sourceTokenAmount)

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

  const approveNativeBridge = useCallback(async () => {
    if (needsNativeBridgeApproval && l1CanonicalBridge) {
      setSending(true)
      try {
        const args = {
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
            console.log(`l1CanonicalBridge:`, l1CanonicalBridge)
            const approveAmount = constants.MaxUint256
            return l1CanonicalBridge.approve(approveAmount as BigNumberish)
          },
        }
        console.log(`args:`, args)

        const tx = await txConfirm.show(args)
        console.log(`tx:`, tx)

        const approveTx = await l1CanonicalBridge.approve(constants.MaxUint256)
        if (approveTx) {
          return approveTx.wait()
        }
      } catch (error) {
        console.log(`error:`, error)
      }
      setSending(false)
    }
  }, [l1CanonicalBridge, needsNativeBridgeApproval, sourceToken, sourceTokenAmount, show])

  async function sendL1CanonicalBridge() {
    if (
      !(
        sdk &&
        l1CanonicalBridge &&
        sourceToken &&
        sourceTokenAmount &&
        sourceNetwork &&
        destNetwork &&
        !needsNativeBridgeApproval
      )
    ) {
      return
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
          const isNetworkConnected = await checkConnectedNetworkId(l1Network.networkId)
          if (!isNetworkConnected) return

          return l1CanonicalBridge.deposit(sourceTokenAmount)
        } catch (error: any) {
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
  }

  return {
    sendL1CanonicalBridge,
    l1CanonicalBridge,
    usingNativeBridge,
    setUsingNativeBridge,
    selectNativeBridge,
    approveNativeBridge,
    txConfirmParams,
  }
}
