import React, { useMemo } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import MuiButton from '@material-ui/core/Button'
import Transaction from 'src/models/Transaction'
import Modal from 'src/components/modal'
import { Chain } from '@hop-protocol/sdk'
import { Div, Flex } from '../ui'
import TransactionStatus from '../accountDetails/TransactionStatus'
import useTransactionStatus from 'src/hooks/useTransactionStatus'
import { useTxStatusStyles } from '../accountDetails/useTxStatusStyles'
import { useApp } from 'src/contexts/AppContext'
import { findNetworkBySlug } from 'src/utils/networks'

type Props = {
  tx: Transaction
  onClose?: () => void
}

function TxStatusModal(props: Props) {
  const { networks, txHistory } = useApp()
  const styles = useTxStatusStyles()
  const { onClose, tx } = props
  const handleTxStatusClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const network = useMemo(() => findNetworkBySlug(networks, tx.networkName), [tx, networks])
  // const destNetwork = findNetworkBySlug(networks, tx.destNetworkName)

  const sourceChain = tx?.networkName ? Chain.fromSlug(tx.networkName) : null
  const destinationChain = tx?.destNetworkName ? Chain.fromSlug(tx.destNetworkName) : null
  let timeEstimate = '5 minutes'
  if (sourceChain?.isL1 && destinationChain?.equals(Chain.Polygon)) {
    timeEstimate = '15 minutes'
  }

  const { completed, destCompleted, confirmations, networkConfirmations } = useTransactionStatus(
    txHistory,
    tx,
    tx.networkName
  )

  return (
    <Modal onClose={handleTxStatusClose}>
      <Div mb={4}>
        <Flex justifyAround alignCenter>
          {network && (
            <Flex column alignCenter textAlign="center" width="5em">
              {/* <Icon src={network?.imageUrl} /> */}
              {/* <Div>{network.name}</Div> */}
              <Div mt={2}>Source</Div>
            </Flex>
          )}
          {tx.destNetworkName !== tx.networkName && (
            <Flex column alignCenter textAlign="center" width="5em">
              {/* <Icon src={destNetwork?.imageUrl} /> */}
              {/* <Div>{destNetwork?.name}</Div> */}
              <Div mt={2}>Destination</Div>
            </Flex>
          )}
        </Flex>

        <Flex justifyAround alignCenter mt={3}>
          <TransactionStatus
            txConfirmed={completed}
            link={tx.explorerLink}
            destNetworkName={tx.destNetworkName}
            styles={styles}
            confirmations={confirmations}
            networkWaitConfirmations={networkConfirmations}
          />

          {tx.destNetworkName !== tx.networkName && (
            <TransactionStatus
              srcConfirmed={completed}
              txConfirmed={destCompleted}
              link={tx.destExplorerLink}
              destNetworkName={tx.destNetworkName}
              networkName={tx.networkName}
              destTx
              styles={styles}
            />
          )}
        </Flex>
      </Div>

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
        <MuiButton className={styles.txStatusCloseButton} onClick={handleTxStatusClose}>
          Close
        </MuiButton>
      </Box>
    </Modal>
  )
}

export default TxStatusModal
