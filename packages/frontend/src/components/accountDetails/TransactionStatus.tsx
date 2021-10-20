import React from 'react'
import { CircularProgress } from '@material-ui/core'
import Check from '@material-ui/icons/Check'
import Link from '@material-ui/core/Link'
import { Div, Flex } from '../ui'

function TransactionStatus(props) {
  const { complete, link, destNetworkName, destTx, styles } = props

  return (
    <Div width="5em">
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
  )
}

export default TransactionStatus
