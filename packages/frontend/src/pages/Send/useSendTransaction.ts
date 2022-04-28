import { useState, useEffect, useMemo, useCallback } from 'react'
import { BigNumber, constants, Signer } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import Transaction from 'src/models/Transaction'
import { getBonderFeeWithId } from 'src/utils'
import { createTransaction } from 'src/utils/createTransaction'
import { amountToBN, formatError } from 'src/utils/format'
import { Hop, HopBridge } from '@hop-protocol/sdk'
import { useTransactionReplacement } from 'src/hooks'
import EventEmitter from 'eventemitter3'

export type TransactionHandled = {
  transaction: any
  txModel: Transaction
}

export function useSendTransaction(props) {
  const {
    amountOutMin,
    customRecipient,
    deadline,
    totalFee,
    sourceChain,
    sourceTokenAmount,
    intermediaryAmountOutMin = BigNumber.from(0),
    sdk,
    setError,
    sourceToken,
    destinationChain,
    txConfirm,
    estimatedReceived,
  } = props
  const [tx, setTx] = useState<Transaction>()
  const [sending, setSending] = useState<boolean>(false)
  const { provider, address, checkConnectedNetworkId, walletName } = useWeb3Context()
  const [recipient, setRecipient] = useState<string>()
  const [signer, setSigner] = useState<Signer>()
  const [bridge, setBridge] = useState<HopBridge>()
  const { waitForTransaction, addTransaction, updateTransaction } =
    useTransactionReplacement(walletName)
  const parsedAmount = useMemo(() => {
    if (!sourceTokenAmount || !sourceToken) return BigNumber.from(0)
    return amountToBN(sourceTokenAmount, sourceToken.decimals)
  }, [sourceTokenAmount, sourceToken?.decimals])

  // Set signer
  useEffect(() => {
    if (provider) {
      const s = provider.getSigner()
      setSigner(s)
    }
  }, [provider, address]) // trigger on address change (ie metamask wallet change)

  // Set recipient and bridge
  useEffect(() => {
    async function setRecipientAndBridge() {
      if (signer) {
        try {
          const r = customRecipient || (await signer.getAddress())
          setRecipient(getAddress(r))

          if (sourceToken) {
            const b = sdk.bridge(sourceToken.symbol).connect(signer)
            setBridge(b)
          }
        } catch (error: any) {
          console.log(`error:`, error)
          if (error.message.includes('invalid address')) {
            setError('Invalid custom recipient address')
          }
        }
      }
    }

    setRecipientAndBridge()
  }, [sdk, signer, sourceToken, customRecipient])

  function handleTransaction(tx, sourceChain, destinationChain, sourceToken): TransactionHandled {
    const txModel = createTransaction(tx, sourceChain, destinationChain, sourceToken)
    addTransaction(txModel)

    return {
      transaction: tx,
      txModel,
    }
  }

  // Master send method
  const send = useCallback(async () => {
    try {
      if (!sourceChain || !destinationChain) {
        throw new Error('A network is undefined')
      }
      setError(null)
      setTx(undefined)

      const isNetworkConnected = await checkConnectedNetworkId(sourceChain.chainId)
      if (!isNetworkConnected) return

      try {
        if (customRecipient) {
          getAddress(customRecipient) // attempts to checksum
        }
      } catch (err) {
        throw new Error('Custom recipient address is invalid')
      }

      if (!signer) {
        throw new Error('Cannot send: signer does not exist.')
      }
      if (!sourceToken) {
        throw new Error('No from token selected')
      }

      setSending(true)
      logger.debug(`recipient: ${recipient}`)

      let txHandled: TransactionHandled

      if (sourceChain.isLayer1) {
        txHandled = await sendl1ToL2()
        logger.debug(`sendl1ToL2 tx:`, txHandled.txModel)
      } else if (!sourceChain.isLayer1 && destinationChain.isLayer1) {
        txHandled = await sendl2ToL1()
        logger.debug(`sendl2ToL1 tx:`, txHandled.txModel)
      } else {
        txHandled = await sendl2ToL2()
        logger.debug(`sendl2ToL2 tx:`, txHandled.txModel)
      }

      const { transaction, txModel } = txHandled

      const watcher = (sdk as Hop).watch(
        txModel.hash,
        sourceToken.symbol,
        sourceChain.slug,
        destinationChain.slug
      )

      if (watcher instanceof EventEmitter) {
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
        networkName: sourceChain.slug,
        destNetworkName: destinationChain.slug,
        token: sourceToken,
      }

      const res = await waitForTransaction(transaction, txModelArgs)

      if (res && 'replacementTxModel' in res) {
        setTx(res.replacementTxModel)
        const { replacementTxModel: txModelReplacement } = res

        // Replace watcher
        const replacementWatcher = sdk.watch(
          txModelReplacement.hash,
          sourceToken!.symbol,
          sourceChain.slug,
          destinationChain.slug
        )
        replacementWatcher.once(sdk.Event.DestinationTxReceipt, async data => {
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
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err, sourceChain))
      }
      logger.error(err)
    }
    setSending(false)
  }, [
    sourceChain,
    destinationChain,
    sdk,
    sourceToken,
    sourceTokenAmount,
    destinationChain,
    waitForTransaction,
    updateTransaction,
    customRecipient,
    formatError,
  ])

  const sendl1ToL2 = useCallback(async () => {
    const tx: any = await txConfirm?.show({
      kind: 'send',
      inputProps: {
        customRecipient: recipient,
        source: {
          amount: sourceTokenAmount,
          token: sourceToken,
          network: sourceChain,
        },
        dest: {
          network: destinationChain,
        },
        estimatedReceived,
      },
      onConfirm: async () => {
        if (!amountOutMin || !bridge) return

        const networkId = Number(sourceChain.networkId)
        const isNetworkConnected = await checkConnectedNetworkId(networkId)
        if (!isNetworkConnected) return

        return bridge.send(parsedAmount, sdk.Chain.Ethereum, destinationChain?.slug, {
          deadline: deadline(),
          relayer: constants.AddressZero,
          relayerFee: 0,
          recipient,
          amountOutMin,
        })
      },
    })

    return handleTransaction(tx, sourceChain, destinationChain, sourceToken)
  }, [
    recipient,
    bridge,
    sourceToken,
    sourceTokenAmount?.toString(),
    sourceChain,
    destinationChain,
    estimatedReceived?.toString(),
    amountOutMin?.toString(),
    txConfirm,
    totalFee?.toString(),
    parsedAmount?.toString(),
    deadline,
  ])

  const sendl2ToL1 = useCallback(async () => {
    const tx: any = await txConfirm?.show({
      kind: 'send',
      inputProps: {
        customRecipient: recipient,
        source: {
          amount: sourceTokenAmount,
          token: sourceToken,
          network: sourceChain,
        },
        dest: {
          network: destinationChain,
        },
        estimatedReceived,
      },
      onConfirm: async () => {
        if (!amountOutMin || !totalFee || !bridge) return
        if (totalFee.gt(parsedAmount)) {
          throw new Error('Amount must be greater than bonder fee')
        }

        const networkId = Number(sourceChain.networkId)
        const isNetworkConnected = await checkConnectedNetworkId(networkId)
        if (!isNetworkConnected) return

        const bonderFeeWithId = getBonderFeeWithId(totalFee)

        return bridge.send(
          parsedAmount,
          sourceChain?.slug as string,
          destinationChain?.slug as string,
          {
            recipient,
            bonderFee: bonderFeeWithId,
            amountOutMin: amountOutMin.sub(bonderFeeWithId),
            deadline: deadline(),
            destinationAmountOutMin: 0,
            destinationDeadline: 0,
          }
        )
      },
    })

    return handleTransaction(tx, sourceChain, destinationChain, sourceToken)
  }, [
    recipient,
    txConfirm,
    sourceToken,
    sourceTokenAmount?.toString(),
    sourceChain,
    destinationChain,
    amountOutMin?.toString(),
    totalFee?.toString(),
    bridge,
    estimatedReceived.toString(),
    parsedAmount,
    deadline,
  ])

  const sendl2ToL2 = useCallback(async () => {
    const tx = await txConfirm?.show({
      kind: 'send',
      inputProps: {
        customRecipient: recipient,
        source: {
          amount: sourceTokenAmount,
          token: sourceToken,
          network: sourceChain,
        },
        dest: {
          network: destinationChain,
        },
        estimatedReceived,
      },
      onConfirm: async () => {
        if (!totalFee || !bridge) return
        if (totalFee.gt(parsedAmount)) {
          throw new Error('Amount must be greater than bonder fee')
        }

        const networkId = Number(sourceChain.networkId)
        const isNetworkConnected = await checkConnectedNetworkId(networkId)
        if (!isNetworkConnected) return

        const bonderFeeWithId = getBonderFeeWithId(totalFee)

        return bridge.send(
          parsedAmount,
          sourceChain?.slug as string,
          destinationChain?.slug as string,
          {
            recipient,
            bonderFee: bonderFeeWithId,
            amountOutMin: intermediaryAmountOutMin.sub(bonderFeeWithId),
            deadline: deadline(),
            destinationAmountOutMin: amountOutMin.sub(bonderFeeWithId),
            destinationDeadline: deadline(),
          }
        )
      },
    })

    return handleTransaction(tx, sourceChain, destinationChain, sourceToken)
  }, [
    recipient,
    bridge,
    sourceToken,
    sourceTokenAmount?.toString(),
    sourceChain,
    destinationChain,
    estimatedReceived?.toString(),
    waitForTransaction,
    intermediaryAmountOutMin?.toString(),
    updateTransaction,
    amountOutMin?.toString(),
    txConfirm,
    totalFee?.toString(),
    parsedAmount,
    deadline,
  ])

  return {
    send,
    sending,
    tx,
    setTx,
    setSending,
  }
}
