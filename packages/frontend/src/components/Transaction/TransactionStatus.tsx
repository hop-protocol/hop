import React, { useEffect, useState } from 'react'
import { CircularProgress } from '@material-ui/core'
import Check from '@material-ui/icons/Check'
import Link from '@material-ui/core/Link'
import { Div, Flex } from '../ui'
import { Text } from '../ui/Text'
import { getHasFinalizationBlockTag, networkSlugToName } from 'src/utils'

function TransactionStatus(props) {
  const {
    link,
    destNetworkName,
    networkName,
    destTx,
    styles,
    srcConfirmed,
    txConfirmed,
    showConfirmations = true,
    confirmations,
    networkWaitConfirmations,
  } = props
  const [text, setText] = useState('')

  useEffect(() => {
    if (txConfirmed) {
      return setText('Complete')
    }

    if (!networkWaitConfirmations) {
      return setText('Pending')
    }

    if (showConfirmations) {
      // If the chain relies on L1 finality, do not show a confirmation number, since that is L2 confirmations.
      // The modal will still show the accurate time to finality.
      if (!confirmations || getHasFinalizationBlockTag(networkName)) {
        return setText(`• / ${networkWaitConfirmations} L1 Confirmations`)
      }

      if (confirmations && networkWaitConfirmations) {
        setText(`${confirmations} / ${networkWaitConfirmations} Confirmations`)
      }
    } else if (confirmations) {
      return setText('Complete')
    }
  }, [txConfirmed, confirmations, networkWaitConfirmations])

  return (
    <>
      <Flex justifyCenter height={60} width="5em">
        {destTx && (!destNetworkName || destNetworkName === networkName) ? (
          <Flex justifyCenter alignCenter height="100%" fontSize="20px" width="5em"></Flex>
        ) : (
          <Flex column height="100%" justifyAround alignCenter fontSize="20px" width="5em">
            <Div mb={1} fontSize={0}>
              <Text className={styles.topLabel}>{destTx ? networkSlugToName(destNetworkName) : networkSlugToName(networkName)}</Text>
            </Div>

            {txConfirmed || (!showConfirmations && confirmations) ? (
              <Check className={styles.completed} />
            ) : destTx && !srcConfirmed ? (
              <Div width={20} height={20} borderRadius="50%" bg="darkgrey" />
            ) : (
              <CircularProgress size={20} thickness={5} />
            )}

            <Div mt={1} fontSize={0}>
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
