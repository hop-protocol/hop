import React, { useEffect, useState } from 'react'
import { CircularProgress } from '@material-ui/core'
import Check from '@material-ui/icons/Check'
import Link from '@material-ui/core/Link'
import { Div, Flex } from '../ui'
import { Text } from '../ui/Text'

function TransactionStatus(props) {
  const {
    link,
    destNetworkName,
    networkName,
    destTx,
    styles,
    srcConfirmed,
    txConfirmed,
    confirmations,
    networkWaitConfirmations,
  } = props
  const [text, setText] = useState('')

  useEffect(() => {
    console.log(`confirmations:`, confirmations)

    if (txConfirmed) {
      return setText('Complete')
    }

    if (!networkWaitConfirmations) {
      return setText('Pending')
    }

    if (confirmations && networkWaitConfirmations) {
      setText(`${confirmations} / ${networkWaitConfirmations} Confirmations`)
    }

    if (!confirmations) {
      return setText(`... / ${networkWaitConfirmations} Confirmations`)
    }
  }, [txConfirmed, confirmations, networkWaitConfirmations])

  return (
    <>
      <Flex justifyCenter height={60} width="5em">
        {destTx && (!destNetworkName || destNetworkName === networkName) ? (
          <Flex justifyCenter alignCenter height="100%" fontSize="20px" width="5em">
            -
          </Flex>
        ) : (
          <Flex column height="100%" justifyAround alignCenter fontSize="20px" width="5em">
            {txConfirmed ? (
              <Check className={styles.completed} />
            ) : destTx && !srcConfirmed ? (
              <Div width={20} height={20} borderRadius="50%" bg="darkgrey" />
            ) : (
              <CircularProgress size={20} thickness={5} />
            )}

            <Div mt={2} fontSize={0}>
              {link ? (
                <Link color="inherit" href={link} target="_blank" rel="noopener noreferrer">
                  <Text>{text}</Text>
                </Link>
              ) : (
                <Text>{text}</Text>
              )}
            </Div>
          </Flex>
        )}
      </Flex>
    </>
  )
}

export default TransactionStatus
