import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Transaction from 'src/models/Transaction'
import Modal from 'src/components/modal'
import { Chain } from '@hop-protocol/sdk'
import { useTxStatusStyles } from '../Transaction'
import TxStatusTracker from 'src/components/Transaction/TxStatusTracker'
import Button from 'src/components/buttons/Button'
import { useAddTokenToMetamask } from 'src/hooks/useAddTokenToMetamask'
import { Div, Flex, Icon } from '../ui'
import { StyledButton } from '../buttons/StyledButton'
import MetaMaskLogo from 'src/assets/logos/metamask.png'
import { useTransactionStatus } from 'src/hooks'
import { getTransferTimeString } from 'src/utils/getTransferTimeString'

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
  const timeEstimate = sourceChain && destinationChain ? getTransferTimeString(sourceChain?.slug, destinationChain?.slug) : ''

  const { completed, destCompleted, confirmations, networkConfirmations } = useTransactionStatus(
    tx,
    tx.networkName
  )
  const { success, addTokenToDestNetwork } = useAddTokenToMetamask(tx.token, tx.destNetworkName)

  return (
    <Modal onClose={handleTxStatusClose}>
      <TxStatusTracker
        tx={tx}
        completed={completed}
        destCompleted={destCompleted}
        confirmations={confirmations}
        networkConfirmations={networkConfirmations}
      />

      <Box display="flex" alignItems="center" className={styles.txStatusInfo}>
        <Typography variant="body1">
          {(tx && tx.token && timeEstimate) ? (
            <em>
              Your transfer will arrive at the destination in <strong>{timeEstimate}</strong>{' '}
              after your transaction is confirmed.
            </em>
          ) : (
            <em>This may take a few minutes</em>
          )}
        </Typography>

        {tx?.token?.symbol && (
          <Flex mt={2} justifyCenter>
            <StyledButton onClick={addTokenToDestNetwork}>
              {!success ? (
                <Flex alignCenter>
                  <Div mr={2}>Add {tx.token.symbol} to Metamask</Div>
                  <Icon width={20} src={MetaMaskLogo} />
                </Flex>
              ) : (
                <Flex alignCenter>
                  <Div mr={2}>Added {tx.token.symbol}</Div>
                  <Icon.Circle width={0} stroke="green" />
                </Flex>
              )}
            </StyledButton>
          </Flex>
        )}

        <Button className={styles.txStatusCloseButton} onClick={handleTxStatusClose}>
          Close
        </Button>
      </Box>
    </Modal>
  )
}

export default TxStatusModal
