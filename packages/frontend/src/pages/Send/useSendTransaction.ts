import { useState, useEffect, useMemo } from 'react'
import { BigNumber, constants, Signer, errors } from 'ethers'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import Transaction from 'src/models/Transaction'
import { getBonderFeeWithId } from 'src/utils'
import { createTransaction } from 'src/utils/createTransaction'
import { amountToBN, formatError } from 'src/utils/format'
import { HopBridge } from '@hop-protocol/sdk'

type TransactionHandled = {
  transaction: any
  txModel: Transaction
}

function handleTransaction(tx, fromNetwork, toNetwork, sourceToken, txHistory): TransactionHandled {
  const txModel = createTransaction(tx, fromNetwork, toNetwork, sourceToken)
  txHistory.addTransaction(txModel)

  return {
    transaction: tx,
    txModel,
  }
}

export function useSendTransaction(props) {
  const {
    amountOutMin,
    customRecipient,
    deadline,
    totalFee,
    fromNetwork,
    fromTokenAmount,
    intermediaryAmountOutMin,
    sdk,
    setError,
    sourceToken,
    toNetwork,
    txConfirm,
    txHistory,
  } = props
  const [tx, setTx] = useState<Transaction | null>(null)
  const [sending, setSending] = useState<boolean>(false)
  const { provider, address, checkConnectedNetworkId } = useWeb3Context()
  const [recipient, setRecipient] = useState<string>()
  const [signer, setSigner] = useState<Signer>()
  const [bridge, setBridge] = useState<HopBridge>()

  const parsedAmount = useMemo(() => {
      if (!fromTokenAmount || !sourceToken) return BigNumber.from(0)
      return amountToBN(fromTokenAmount, sourceToken.decimals)
    },
    [fromTokenAmount, sourceToken?.decimals]
  )

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
        const r = customRecipient || (await signer.getAddress())
        setRecipient(r)

        if (sourceToken) {
          const b = sdk.bridge(sourceToken.symbol).connect(signer)
          setBridge(b)
        }
      }
    }

    setRecipientAndBridge()
  }, [signer, sourceToken, customRecipient])

  // Master send method
  const send = async () => {
    try {
      if (!fromNetwork || !toNetwork) {
        throw new Error('A network is undefined')
      }
      setError(null)
      setTx(null)

      const networkId = Number(fromNetwork.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      if (!signer) {
        throw new Error('Cannot send: signer does not exist.')
      }
      if (!sourceToken) {
        throw new Error('No from token selected')
      }

      setSending(true)
      logger.debug(`recipient: ${recipient}`)

      let txHandled: TransactionHandled

      if (fromNetwork.isLayer1) {
        txHandled = await sendl1ToL2()
        logger.debug(`sendl1ToL2 tx:`, txHandled.txModel)
      } else if (!fromNetwork.isLayer1 && toNetwork.isLayer1) {
        txHandled = await sendl2ToL1()
        logger.debug(`sendl2ToL1 tx:`, txHandled.txModel)
      } else {
        txHandled = await sendl2ToL2()
        logger.debug(`sendl2ToL2 tx:`, txHandled.txModel)
      }

      const { transaction, txModel } = txHandled

      const sourceChain = sdk.Chain.fromSlug(fromNetwork.slug)
      const destChain = sdk.Chain.fromSlug(toNetwork.slug)
      const watcher = sdk.watch(txModel.hash, sourceToken!.symbol, sourceChain, destChain)

      watcher.on(sdk.Event.DestinationTxReceipt, async data => {
        logger.debug(`dest tx receipt event data:`, data)
        if (txModel && !txModel.destTxHash) {
          txModel.destTxHash = data.receipt.transactionHash
          txModel.pendingDestinationConfirmation = false
          txHistory?.updateTransaction(txModel)
        }
      })

      setTx(txModel)

      try {
        await transaction.wait()
      } catch (error: any) {
        if (error.code === errors.TRANSACTION_REPLACED) {
          if (error.cancelled) {
            // console.log(`error.cancelled__error.replacement:`, error.replacement)
          } else {
            // console.log(`error.replacement:`, error.replacement)
            // console.log(`error.receipt:`, error.receipt)
            const txModelReplacement = createTransaction(
              error.replacement,
              fromNetwork,
              toNetwork,
              sourceToken
            )

            // Replace local storage
            txHistory?.replaceTransaction(transaction.hash, txModelReplacement)
            setTx(txModelReplacement)

            // TODO: (when refactoring Transfer handling) Use a separate function to "DRY" this logic.
            // Or handle it in the Transaction model.

            // Replace watcher
            watcher.off(sdk.Event.DestinationTxReceipt)
            const replacementWatcher = sdk.watch(
              txModelReplacement.hash,
              sourceToken!.symbol,
              sourceChain,
              destChain
            )
            replacementWatcher.on(sdk.Event.DestinationTxReceipt, async data => {
              logger.debug(`replacement dest tx receipt event data:`, data)
              if (txModelReplacement && !txModelReplacement.destTxHash) {
                txModelReplacement.destTxHash = data.receipt.transactionHash
                txModel.pendingDestinationConfirmation = false
                txModel.replaced = true
                txHistory?.updateTransaction(txModelReplacement)
              }
            })
          }
        }
      }
    } catch (err: any) {
      if (!/cancelled/gi.test(err.message)) {
        setError(formatError(err, fromNetwork))
      }
      logger.error(err)
    }
    setSending(false)
  }

  const sendl1ToL2 = async () => {
    const tx: any = await txConfirm?.show({
      kind: 'send',
      inputProps: {
        customRecipient,
        source: {
          amount: fromTokenAmount,
          token: sourceToken,
          network: fromNetwork,
        },
        dest: {
          network: toNetwork,
        },
      },
      onConfirm: async () => {
        if (!amountOutMin || !bridge) return

        return bridge.send(parsedAmount, sdk.Chain.Ethereum, toNetwork?.slug, {
          deadline: deadline(),
          relayer: constants.AddressZero,
          relayerFee: 0,
          recipient,
          amountOutMin,
        })
      },
    })

    return handleTransaction(tx, fromNetwork, toNetwork, sourceToken, txHistory)
  }

  const sendl2ToL1 = async () => {
    const tx: any = await txConfirm?.show({
      kind: 'send',
      inputProps: {
        customRecipient,
        source: {
          amount: fromTokenAmount,
          token: sourceToken,
          network: fromNetwork,
        },
        dest: {
          network: toNetwork,
        },
      },
      onConfirm: async () => {
        if (!amountOutMin || !totalFee || !bridge) return
        if (totalFee.gt(parsedAmount)) {
          throw new Error('Amount must be greater than bonder fee')
        }

        const bonderFeeWithId = getBonderFeeWithId(totalFee)

        return bridge.send(parsedAmount, fromNetwork?.slug as string, toNetwork?.slug as string, {
          recipient,
          bonderFee: bonderFeeWithId,
          amountOutMin: amountOutMin.sub(bonderFeeWithId),
          deadline: deadline(),
          destinationAmountOutMin: 0,
          destinationDeadline: 0,
        })
      },
    })

    return handleTransaction(tx, fromNetwork, toNetwork, sourceToken, txHistory)
  }

  const sendl2ToL2 = async () => {
    const tx: any = await txConfirm?.show({
      kind: 'send',
      inputProps: {
        customRecipient,
        source: {
          amount: fromTokenAmount,
          token: sourceToken,
          network: fromNetwork,
        },
        dest: {
          network: toNetwork,
        },
      },
      onConfirm: async () => {
        if (!totalFee || !bridge) return
        if (totalFee.gt(parsedAmount)) {
          throw new Error('Amount must be greater than bonder fee')
        }

        const bonderFeeWithId = getBonderFeeWithId(totalFee)

        return bridge.send(parsedAmount, fromNetwork?.slug as string, toNetwork?.slug as string, {
          recipient,
          bonderFee: bonderFeeWithId,
          amountOutMin: intermediaryAmountOutMin.sub(bonderFeeWithId),
          deadline: deadline(),
          destinationAmountOutMin: amountOutMin.sub(bonderFeeWithId),
          destinationDeadline: deadline(),
        })
      },
    })

    return handleTransaction(tx, fromNetwork, toNetwork, sourceToken, txHistory)
  }

  return {
    send,
    sending,
    tx,
    setTx,
  }
}
