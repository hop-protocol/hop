import React, { useEffect } from 'react'
import Link from '@material-ui/core/Link'
import Transaction from 'src/models/Transaction'
import { Flex } from '../ui'
import useTransactionStatus from 'src/hooks/useTransactionStatus'
import TransactionStatus from './TransactionStatus'
import { isOlderThanOneHour } from 'src/utils'

function TransactionRow({ tx, styles, rmTx }: { tx: Transaction; styles: any; rmTx: any }) {
  const {
    completed,
    destCompleted,
    confirmations,
    networkConfirmations,
    replaced,
  } = useTransactionStatus(tx, tx.networkName)

  useEffect(() => {
    if (replaced) {
      if (isOlderThanOneHour(replaced.timestampMs)) {
        return rmTx(replaced)
      }
    }
  }, [replaced])

  return (
    <Flex justifyBetween mb=".5rem" alignCenter>
      <Flex alignCenter width="50%">
        <Link href={tx.explorerLink} target="_blank" rel="noopener noreferrer">
          <span className={styles.network}>{tx.networkName}:</span> {tx.truncatedHash} ↗
        </Link>
      </Flex>

      <Flex justifyAround alignCenter width="50%">
        <TransactionStatus
          txConfirmed={completed}
          link={tx.explorerLink}
          destNetworkName={tx.destNetworkName}
          styles={styles}
          showConfirmations={tx.isBridgeTransfer}
          confirmations={confirmations}
          networkWaitConfirmations={networkConfirmations}
        />

        <TransactionStatus
          srcConfirmed={completed}
          txConfirmed={destCompleted}
          link={tx.destExplorerLink}
          destNetworkName={tx.destNetworkName}
          networkName={tx.networkName}
          destTx
          styles={styles}
        />
      </Flex>
    </Flex>
  )
}

export default TransactionRow
