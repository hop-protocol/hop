import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Transaction from 'src/models/Transaction'
import Modal from 'src/components/modal'
import { Chain } from '@hop-protocol/sdk'
import { useTxStatusStyles } from '../Transaction'
import TxStatusTracker from 'src/components/Transaction/TxStatusTracker'
import Button from 'src/components/buttons/Button'
import { Div, Flex, Icon } from '../ui'
import { StyledButton } from '../buttons/StyledButton'
import MetaMaskLogo from 'src/assets/logos/metamask.png'
import { useTransactionStatus } from 'src/hooks'
import { useAddTokenToMetamask } from 'src/hooks/useAddTokenToMetamask'
import { useTransferTimeEstimate } from 'src/hooks/useTransferTimeEstimate'
import { getTransferTimeMinutes } from 'src/utils/getTransferTimeMinutes'
import pluralize from 'pluralize'

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
  
  const { fixedTimeEstimate, medianTimeEstimate, percentileTimeEstimate } = useTransferTimeEstimate(
    tx.networkName,
    tx.destNetworkName
  )

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
        <Box>
          {(tx && tx.token && medianTimeEstimate) ? (
            <Box margin="0 auto" maxWidth="84%">
              <Typography variant="body2" color="textSecondary">
                Your transfer will arrive at the destination ~<strong>{medianTimeEstimate !== null ? (medianTimeEstimate + " " + `${pluralize('minute', medianTimeEstimate)}`) : (fixedTimeEstimate + " " + pluralize('minute', fixedTimeEstimate))}</strong>{' '}
                after your transaction is confirmed.{' '}
                { percentileTimeEstimate !== null && (
                  <>90% of transfers were completed in ~<strong>{percentileTimeEstimate + " " + pluralize('minute', percentileTimeEstimate)}</strong>{'.'}</>
                )}
              </Typography>
              { medianTimeEstimate > fixedTimeEstimate * 1.5 &&
                <>
                  <br />
                  <Typography variant="body2" color="textSecondary" style={{ fontStyle: 'italic' }}>
                    This estimate is higher than usual and may not reflect current speeds.
                  </Typography>
                </>
              }
            </Box>
          ) : (
            <Typography variant="body1" style={{ fontStyle: 'italic' }}>This may take a few minutes</Typography>
          )}
          <br />
        </Box>

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
