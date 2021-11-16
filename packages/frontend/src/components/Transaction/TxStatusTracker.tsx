import React, { useMemo } from 'react'
import { Div, Flex } from 'src/components/ui'
import useTransactionStatus from 'src/hooks/useTransactionStatus'
import { TransactionStatus, useTxStatusStyles } from 'src/components/Transaction'
import { useApp } from 'src/contexts/AppContext'
import { findNetworkBySlug } from 'src/utils/networks'

function TxStatusTracker({ tx }) {
  const { networks } = useApp()
  const styles = useTxStatusStyles()

  const network = useMemo(() => findNetworkBySlug(networks, tx.networkName), [tx, networks])
  // const destNetwork = findNetworkBySlug(networks, tx.destNetworkName)

  // TODO: turn this or just the tx status part into a FC
  const { completed, destCompleted, confirmations, networkConfirmations } = useTransactionStatus(
    tx,
    tx.networkName
  )
  return (
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
  )
}

export default TxStatusTracker
