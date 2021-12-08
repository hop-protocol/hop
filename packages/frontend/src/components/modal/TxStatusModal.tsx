import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Transaction from 'src/models/Transaction'
import Modal from 'src/components/modal'
import { Chain } from '@hop-protocol/sdk'
import { useTxStatusStyles } from '../Transaction'
import TxStatusTracker from 'src/components/Transaction/TxStatusTracker'
import Button from 'src/components/buttons/Button'

type Props = {
  tx: Transaction
  onClose?: () => void
}

function TxStatusModal(props: Props) {
  const styles = useTxStatusStyles()
  const { onClose, tx } = props
  const handleTxStatusClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const sourceChain = tx?.networkName ? Chain.fromSlug(tx.networkName) : null
  const destinationChain = tx?.destNetworkName ? Chain.fromSlug(tx.destNetworkName) : null
  let timeEstimate = '5 minutes'
  if (sourceChain?.isL1 && destinationChain?.equals(Chain.Polygon)) {
    timeEstimate = '15 minutes'
  }

  return (
    <Modal onClose={handleTxStatusClose}>
      <TxStatusTracker tx={tx} />

      <Box display="flex" alignItems="center" className={styles.txStatusInfo}>
        <Typography variant="body1">
          {tx && tx.token ? (
            <em>
              Your transfer will arrive at the destination around <strong>{timeEstimate}</strong>{' '}
              after your transaction is confirmed.
            </em>
          ) : (
            <em>This may take a few minutes</em>
          )}
        </Typography>
        <Button className={styles.txStatusCloseButton} onClick={handleTxStatusClose}>
          Close
        </Button>
      </Box>
    </Modal>
  )
}

export default TxStatusModal
