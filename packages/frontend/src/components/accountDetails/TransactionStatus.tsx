import React, { useEffect, useState } from 'react'
import { CircularProgress } from '@material-ui/core'
import Check from '@material-ui/icons/Check'
import Link from '@material-ui/core/Link'
import { Div, Flex } from '../ui'

function TransactionStatus(props) {
  const { complete, link, destNetworkName, destTx, styles, network, confirmations } = props
  const [confirmationText, setConfirmationText] = useState('')

  useEffect(() => {
    if (!network) return

    if (!confirmations) {
      return setConfirmationText(`... / ${network.waitConfirmations}`)
    }

    setConfirmationText(`${confirmations} / ${network.waitConfirmations}`)

    // if (confirmations >= network.waitConfirmations) {
    //   setConfirmationText(`${network.waitConfirmations} / ${network.waitConfirmations}`)
    // } else {
    //   setConfirmationText(`${confirmations} / ${network.waitConfirmations}`)
    // }
  }, [confirmations, network])

  return (
    <Div>
      <Div width='5em'>
        {destTx && !destNetworkName ? (
          <Div textAlign="center">-</Div>
        ) : complete ? (
          <Flex column justifyBetween alignCenter fontSize="20px">
            <Check className={styles.completed} />
            <Flex mt={2} fontSize={0}>
              {link ? (
                <Link color="inherit" href={link} target="_blank" rel="noopener noreferrer">
                  Complete
                </Link>
              ) : (
                <Div>Complete</Div>
              )}
            </Flex>
          </Flex>
        ) : (
          <Flex column justifyBetween alignCenter fontSize="20px">
            <CircularProgress size={20} thickness={5} />
            <Flex mt="10px" fontSize={0}>
              {link ? (
                <Link color="inherit" href={link} target="_blank" rel="noopener noreferrer">
                  Pending
                </Link>
              ) : (
                <Div>Pending</Div>
              )}
            </Flex>
          </Flex>
        )}
      </Div>

      {confirmationText && (
        <Flex column justifyCenter alignCenter mt={3}>
          <Div>{confirmationText}</Div>
          <Div>Confirmations</Div>
        </Flex>
      )}
    </Div>
  )
}

export default TransactionStatus
