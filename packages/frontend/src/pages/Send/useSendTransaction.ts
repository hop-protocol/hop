import { useState, useEffect } from 'react'
import { constants, utils } from 'ethers'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import Transaction from 'src/models/Transaction'
import { getBonderFeeWithId } from 'src/utils'
import { createTransaction } from 'src/utils/createTransaction'
import { formatError } from 'src/utils/format'

export function useSendTransaction(props) {
  const {
    amountOutMin,
    bonderFee,
    customRecipient,
    deadline,
    destinationTxFee,
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
  const [sending, setSending] = useState(false)
  const { provider, checkConnectedNetworkId } = useWeb3Context()

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

      setSending(true)
      let tx: Transaction | null = null
      if (fromNetwork.isLayer1) {
        tx = await sendl1ToL2()
        logger.debug(`sendl1ToL2 tx:`, tx)
      } else if (!fromNetwork.isLayer1 && toNetwork.isLayer1) {
        tx = await sendl2ToL1()
        logger.debug(`sendl2ToL1 tx:`, tx)
      } else {
        tx = await sendl2ToL2()
        logger.debug(`sendl2ToL2 tx:`, tx)
      }

      if (tx) {
        const sourceChain = sdk.Chain.fromSlug(fromNetwork.slug)
        const destChain = sdk.Chain.fromSlug(toNetwork.slug)
        const watcher = sdk.watch(tx.hash, sourceToken!.symbol, sourceChain, destChain)

        watcher.on(sdk.Event.DestinationTxReceipt, async data => {
          console.log(`dest tx receipt event data:`, data)
          if (tx && !tx.destTxHash) {
            tx.destTxHash = data.receipt.transactionHash
            txHistory?.updateTransaction(tx)
          }
        })

        setTx(tx)
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
    const signer = provider?.getSigner()
    if (!signer) {
      throw new Error('Cannot send: signer does not exist.')
    }
    if (!sourceToken) {
      throw new Error('No from token selected')
    }

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
        if (!amountOutMin) return
        const parsedAmount = utils.parseUnits(fromTokenAmount, sourceToken.decimals).toString()
        const recipient = customRecipient || (await signer.getAddress())
        const relayer = constants.AddressZero
        const relayerFee = 0
        const bridge = sdk.bridge(sourceToken.symbol).connect(signer)

        const tx = await bridge.send(parsedAmount, sdk.Chain.Ethereum, toNetwork?.slug, {
          deadline: deadline(),
          relayer,
          relayerFee,
          recipient,
          amountOutMin,
        })
        return tx
      },
    })

    let txObj: Transaction | null = null
    if (tx?.hash && fromNetwork) {
      txObj = createTransaction(tx, fromNetwork, toNetwork, sourceToken)
      txHistory?.addTransaction(txObj)
    }

    return txObj
  }

  const sendl2ToL1 = async () => {
    const signer = provider?.getSigner()
    if (!signer) {
      throw new Error('Cannot send: signer does not exist.')
    }
    if (!sourceToken) {
      throw new Error('No from token selected')
    }

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
        if (!amountOutMin || !bonderFee) return
        const destinationAmountOutMin = 0
        const destinationDeadline = 0
        const parsedAmountIn = utils.parseUnits(fromTokenAmount, sourceToken.decimals)
        const bridge = sdk.bridge(sourceToken.symbol).connect(signer)

        let totalBonderFee = bonderFee
        if (destinationTxFee?.gt(0)) {
          totalBonderFee = totalBonderFee.add(destinationTxFee)
        }

        if (totalBonderFee.gt(parsedAmountIn)) {
          throw new Error('Amount must be greater than bonder fee')
        }
        const recipient = customRecipient || (await signer?.getAddress())

        totalBonderFee = getBonderFeeWithId(totalBonderFee)
        const tx = await bridge.send(
          parsedAmountIn,
          fromNetwork?.slug as string,
          toNetwork?.slug as string,
          {
            recipient,
            bonderFee: totalBonderFee,
            amountOutMin: amountOutMin.sub(totalBonderFee),
            deadline: deadline(),
            destinationAmountOutMin,
            destinationDeadline,
          }
        )
        return tx
      },
    })

    let txObj: Transaction | null = null
    if (tx?.hash && fromNetwork) {
      txObj = createTransaction(tx, fromNetwork, toNetwork, sourceToken)
      txHistory?.addTransaction(txObj)
    }

    return txObj
  }

  const sendl2ToL2 = async () => {
    const signer = provider?.getSigner()
    if (!signer) {
      throw new Error('Cannot send: signer does not exist.')
    }
    if (!sourceToken) {
      throw new Error('No from token selected')
    }

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
        if (!bonderFee) return
        const parsedAmountIn = utils.parseUnits(fromTokenAmount, sourceToken.decimals)
        const recipient = customRecipient || (await signer?.getAddress())
        const bridge = sdk.bridge(sourceToken.symbol).connect(signer)

        let totalBonderFee = bonderFee
        if (destinationTxFee?.gt(0)) {
          totalBonderFee = totalBonderFee.add(destinationTxFee)
        }

        if (totalBonderFee.gt(parsedAmountIn)) {
          throw new Error('Amount must be greater than bonder fee')
        }

        totalBonderFee = getBonderFeeWithId(totalBonderFee)
        const tx = await bridge.send(
          parsedAmountIn,
          fromNetwork?.slug as string,
          toNetwork?.slug as string,
          {
            recipient,
            bonderFee: totalBonderFee,
            amountOutMin: intermediaryAmountOutMin.sub(totalBonderFee),
            deadline: deadline(),
            destinationAmountOutMin: amountOutMin.sub(totalBonderFee),
            destinationDeadline: deadline(),
          }
        )
        return tx
      },
    })

    let txObj: Transaction | null = null
    if (tx?.hash && fromNetwork) {
      txObj = createTransaction(tx, fromNetwork, toNetwork, sourceToken)
      txHistory?.addTransaction(txObj)
    }

    return txObj
  }

  return {
    send,
    sending,
    tx,
    setTx,
  }
}
