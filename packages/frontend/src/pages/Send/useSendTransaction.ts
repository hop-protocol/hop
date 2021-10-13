import { useState, useEffect } from 'react'
import { BigNumber, constants, Signer, utils } from 'ethers'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import Transaction from 'src/models/Transaction'
import { getBonderFeeWithId } from 'src/utils'
import { createTransaction } from 'src/utils/createTransaction'
import { formatError } from 'src/utils/format'
import { HopBridge } from '@hop-protocol/sdk'

function handleTransaction(tx, fromNetwork, toNetwork, sourceToken, txHistory) {
  let txObj: Transaction | null = null
  if (tx?.hash && fromNetwork) {
    txObj = createTransaction(tx, fromNetwork, toNetwork, sourceToken)
    txHistory?.addTransaction(txObj)
  }
  return txObj
}

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
  const [sending, setSending] = useState<boolean>(false)
  const { provider, checkConnectedNetworkId } = useWeb3Context()
  const [recipient, setRecipient] = useState<string>()
  const [signer, setSigner] = useState<Signer>()
  const [bridge, setBridge] = useState<HopBridge>()
  const [parsedAmount, setParsedAmount] = useState<BigNumber>(BigNumber.from(0))
  const [totalBonderFee, setTotalBonderFee] = useState<BigNumber>(BigNumber.from(0))

  // Set signer
  useEffect(() => {
    if (provider) {
      const s = provider.getSigner()
      setSigner(s)
    }
  }, [provider])

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
  }, [signer, sourceToken])

  // Set parsedAmount and totalBonderFee
  useEffect(() => {
    if (fromTokenAmount && sourceToken && bonderFee && destinationTxFee) {
      const parsedAmount = utils.parseUnits(fromTokenAmount, sourceToken.decimals)

      let totalBonderFee = bonderFee
      if (destinationTxFee?.gt(0)) {
        totalBonderFee = totalBonderFee.add(destinationTxFee)
      }

      setParsedAmount(parsedAmount)
      setTotalBonderFee(totalBonderFee)
    }
  }, [fromTokenAmount, sourceToken, bonderFee, destinationTxFee])

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
        if (!amountOutMin || !bonderFee || !bridge) return
        if (totalBonderFee.gt(parsedAmount)) {
          throw new Error('Amount must be greater than bonder fee')
        }

        const bonderFeeWithId = getBonderFeeWithId(totalBonderFee)

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
        if (!bonderFee || !bridge) return
        if (totalBonderFee.gt(parsedAmount)) {
          throw new Error('Amount must be greater than bonder fee')
        }

        const bonderFeeWithId = getBonderFeeWithId(totalBonderFee)

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
