import React, { useEffect } from 'react'
import Link from '@material-ui/core/Link'
import RightArrow from '@material-ui/icons/ArrowRightAlt'
import Transaction from 'src/models/Transaction'
import { Flex } from '../ui'
import useTransactionStatus from 'src/hooks/useTransactionStatus'
import TransactionStatus from './TransactionStatus'
import { isOlderThanOneHour, networkSlugToName } from 'src/utils'

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
    <Flex justifyBetween mb="6px" alignCenter marginBottom="10px" paddingBottom="10px">
      <Flex flexDirection="column" alignItems="flex-start" width="50%">
        <div>
          <span className={styles.network}>{networkSlugToName(tx.networkName)}:</span>
          <Link href={tx.explorerLink} target="_blank" rel="noopener noreferrer">
            {tx.truncatedHash} ↗
          </Link>
        </div>
        <div>
          {tx.methodName && <small className={styles.methodName}>({tx.methodName})</small>}
        </div>
      </Flex>

      <Flex justifyContent="space-between" alignItems="center" width="50%">
        <TransactionStatus
          txConfirmed={completed}
          link={tx.explorerLink}
          networkName={tx.networkName}
          destNetworkName={tx.destNetworkName}
          styles={styles}
          showConfirmations={tx.isBridgeTransfer}
          confirmations={confirmations}
          networkWaitConfirmations={networkConfirmations}
        />
        {tx.destNetworkName && (tx.networkName !== tx.destNetworkName) &&
        <>
          <div><RightArrow fontSize="large" color="primary" /></div>
          <TransactionStatus
            srcConfirmed={completed}
            txConfirmed={destCompleted}
            link={tx.destExplorerLink}
            destNetworkName={tx.destNetworkName}
            networkName={tx.networkName}
            destTx
            styles={styles}
          />
      </>}
      </Flex>
    </Flex>
  )
}

export default TransactionRow
