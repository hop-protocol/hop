import React, { useState, useEffect } from 'react'
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
import SelectOption from '../selects/SelectOption'
import { useApp } from 'src/contexts/AppContext'
import find from 'lodash/find'

type Props = {
  tx: Transaction
  onClose?: () => void
}

function TxStatusModal(props: Props) {
  const { networks } = useApp()
  const [iconImage, setIconImage] = useState('')
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

  useEffect(() => {
    if (networks?.length && tx?.networkName) {
      const n = find(networks, ['slug', tx.networkName])
      if (n) {
        setIconImage(n.imageUrl)
      }
    }
  }, [networks, tx])

  const { completed, destCompleted } = useTransactionStatus(tx, tx.networkName)

  return (
    <Modal onClose={handleTxStatusClose}>
      <Div mb={4}>
        <Flex justifyAround alignCenter>
          <Flex column alignCenter textAlign="center" width="5em">
            {/* <SelectOption icon={iconImage} /> */}
            <Div>Source</Div>
          </Flex>
          <Flex textAlign="center" width="5em">
            Destination
          </Flex>
        </Flex>

        <Flex justifyAround alignCenter mt={3}>
          <TransactionStatus
            complete={completed}
            link={tx.explorerLink}
            destNetworkName={tx.destNetworkName}
            styles={styles}
          />

          <TransactionStatus
            complete={destCompleted}
            link={tx.destExplorerLink}
            destNetworkName={tx.destNetworkName}
            destTx
            styles={styles}
          />
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
