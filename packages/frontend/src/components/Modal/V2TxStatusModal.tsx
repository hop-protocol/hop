import Box from '@mui/material/Box'
import React, { useEffect, useState } from 'react'
import { providers } from 'ethers'
import TxStatusTracker from '#components/Transaction/TxStatusTracker.js'
import Typography from '@mui/material/Typography'
import { Button } from '#components/Button/index.js'
import { Modal } from '#components/Modal/Modal.js'
import { transferTimeDisplay } from '#utils/transferTimeDisplay.js'
import { useTxStatusStyles } from '#components/Transaction/index.js'
import { Hop } from '@hop-protocol/v2-sdk'

type Token = {
  symbol: string
}

type Chain = {
  name: string
  chainId: number
}

type Props = {
  v2Sdk: Hop
  tx: providers.TransactionResponse
  token: Token
  fromChain: Chain
  toChain: Chain
  onClose?: () => void
}

export function V2TxStatusModal(props: Props) {
  const styles = useTxStatusStyles()
  const { onClose, v2Sdk, tx, token, fromChain, toChain } = props
  const [fromCompleted, setFromCompleted] = useState(false)
  const [toCompleted, setToCompleted] = useState(false)
  const [currentConfirmations, setCurrentConfirmations] = useState(0)
  const [confirmationsRequired, setConfirmationsRequired] = useState(100) // TODO
  const handleTxStatusClose = () => {
    if (onClose) {
      onClose()
    }
  }

  function InfoContent(props: any) {
    const { token, toChain, medianTimeEstimate, percentileTimeEstimate, fixedTimeEstimate } = props

    if (token && fromChain && toChain && medianTimeEstimate) {
      return (
        <>
          <Typography variant="body2" color="textSecondary">
            Your {token.symbol ?? 'transfer'}{' '}
            will arrive{' '}
            {
              toChain.name
              ? `on ${toChain.name}`
              : "at the destination"
            }
            <strong>{' '}
              { transferTimeDisplay(medianTimeEstimate, fixedTimeEstimate) }
            </strong>{' '}
            after the transaction is confirmed.
          </Typography>
          { medianTimeEstimate > fixedTimeEstimate * 1.5 &&
            <>
              <br />
              <Typography variant="body2" color="textSecondary" style={{ fontStyle: 'italic' }}>
                This estimate is higher than usual and may not reflect current speeds.
              </Typography>
            </>
          }
        </>
      )
    } else if (tx && fixedTimeEstimate) {
      return (
        <Typography variant="body1"><em>{`Your ${token?.symbol ?? 'transfer'} will arrive ${toChain.name ? `on ${toChain.name}` : "at the destination"} ~${fixedTimeEstimate} minutes after your transaction is confirmed.`}</em></Typography>
      )
    } else {
      return (
        <Typography variant="body1"><em>This may take a few minutes</em></Typography>
      )
    }
  }

  // TODO: interval
  useEffect(() => {
    async function update() {
      if (v2Sdk && tx && fromChain && toChain) {
        const fromChainId = fromChain.chainId
        const toChainId = toChain.chainId
        const event = await v2Sdk.getRailsGateway(fromChainId).getTransferSentEventFromTransactionHash({
          transactionHash: tx.hash
        })
        const { transferId } = event?.decoded
        const transferStatus = await v2Sdk.getTransferStatus({
          fromChainId,
          toChainId,
          transferId
        })

        setFromCompleted(!!transferStatus.transferSentEvent)
        setToCompleted(!!transferStatus.transferBondedEvent)

        if (!transferStatus.transferBondedEvent) {
          const provider = v2Sdk.getProvider(fromChainId)
          const blockNumber = await provider.getBlockNumber()
          const { blockNumber: receiptBlockNumber } = await provider.getTransactionReceipt(tx.hash)
          setCurrentConfirmations(blockNumber - receiptBlockNumber)
        }
      }
    }

    update().catch(console.error)
  }, [v2Sdk, fromChain, toChain, tx])

  // TODO
  const medianTimeEstimate = '500'
  const percentileTimeEstimate = '500'
  const fixedTimeEstimate = '500'

  // TODO
  const txModel = {
    networkName: fromChain?.name,
    destNetworkName: toChain?.name,
    explorerLink: ''
  }

  return (
    <Modal onClose={handleTxStatusClose}>
      <TxStatusTracker
        tx={txModel}
        completed={fromCompleted}
        destCompleted={toCompleted}
        confirmations={currentConfirmations}
        networkConfirmations={confirmationsRequired}
      />

      <Box display="flex" alignItems="center" className={styles.txStatusInfo}>
        <Box margin="0 auto" maxWidth="32rem" paddingLeft={3} paddingRight={3}>
          <InfoContent token={token} toChain={toChain} medianTimeEstimate={medianTimeEstimate} percentileTimeEstimate={percentileTimeEstimate} fixedTimeEstimate={fixedTimeEstimate} />
          <br />
        </Box>

        <Button className={styles.txStatusCloseButton} onClick={handleTxStatusClose}>
          Close
        </Button>
      </Box>
    </Modal>
  )
}
