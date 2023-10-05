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
import { transferTimeDisplay } from 'src/utils/transferTimeDisplay'
import pluralize from 'pluralize'
import { networkSlugToName } from 'src/utils'

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

  function InfoContent(props) {
    const { tx, medianTimeEstimate, percentileTimeEstimate, fixedTimeEstimate } = props

    if (tx && tx.token && medianTimeEstimate) {
      return (
        <>
          <Typography variant="body2" color="textSecondary">
            Your {tx.token._symbol ?? 'transfer'}{' '}
            will arrive{' '}
            {
              tx.destNetworkName
              ? `on ${networkSlugToName(tx.destNetworkName)}` 
              : "at the destination"
            }
            <strong>{' '}~
              { transferTimeDisplay(medianTimeEstimate, fixedTimeEstimate) }
            </strong>{' '}
            after the transaction is confirmed.
            { percentileTimeEstimate !== null && percentileTimeEstimate > 0 && (
              <>
                <br />
                <br />
                Only 10% of recent transfers took more than {percentileTimeEstimate + " " + pluralize('minute', percentileTimeEstimate)}.
              </>
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
        </>
      )
    } else if (tx && fixedTimeEstimate) {
      return (
        <Typography variant="body1"><em>{`Your ${tx.token._symbol ?? 'transfer'} will arrive ${tx.destNetworkName ? `on ${networkSlugToName(tx.destNetworkName)}` : "at the destination"} ~${fixedTimeEstimate} minutes after your transaction is confirmed.`}</em></Typography>
      )
    } else {
      return (
        <Typography variant="body1"><em>This may take a few minutes</em></Typography>
      )
    }
  }

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
        <Box margin="0 auto" maxWidth="32rem" paddingLeft={3} paddingRight={3}>
          <InfoContent tx={tx} medianTimeEstimate={medianTimeEstimate} percentileTimeEstimate={percentileTimeEstimate} fixedTimeEstimate={fixedTimeEstimate} />
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
