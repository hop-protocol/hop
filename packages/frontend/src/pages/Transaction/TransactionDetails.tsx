import React from 'react'
import { Link } from '@mui/material'
import { utils } from 'ethers'
import { Div, Flex } from 'src/components/ui'
import { Text } from 'src/components/ui/Text'
import { truncateHash, Tx, TxState } from 'src/utils'
import { getExplorerTxUrl } from 'src/utils/getExplorerUrl'

function TransactionDetails(props: TxState) {
  const {
    networkName,
    network,
    txHash,
    gasCost,
    response,
    confirmations,
    networkConfirmations,
  } = props

  return (
    <Div>
      <Flex justifyBetween mb={2}>
        <Div bold>Source Network:</Div>
        {networkName && (
          <Link
            href={getExplorerTxUrl(networkName, txHash)}
            target="_blank"
            underline="hover">
            {networkName}: {truncateHash(txHash)}
          </Link>
        )}
      </Flex>

      <Flex justifyBetween mb={2}>
        <Div>From:</Div>
        <Text mono>{response?.from}</Text>
      </Flex>
      <Flex justifyBetween mb={2}>
        <Div>To:</Div>
        <Text mono>{response?.to}</Text>
      </Flex>

      <Flex justifyBetween mb={2}>
        <Div>Value:</Div>
        <Div>
          {utils.formatEther(response?.value?.toString() || '0')} {network?.nativeTokenSymbol}
        </Div>
      </Flex>

      <Flex justifyBetween mb={2}>
        <Div>Gas Price:</Div>
        <Div>{utils.formatUnits(response?.gasPrice?.toString() || '0', 'gwei')} Gwei</Div>
      </Flex>

      <Flex justifyBetween mb={2}>
        <Div>Gas Limit:</Div>
        <Div>{response?.gasLimit?.toString()}</Div>
      </Flex>

      <Flex justifyBetween mb={2}>
        <Div>Gas Cost:</Div>
        <Div>
          {gasCost} {network?.nativeTokenSymbol}
        </Div>
      </Flex>

      <Flex justifyBetween mb={2}>
        <Div>Tx Nonce:</Div>
        <Div>{response?.nonce}</Div>
      </Flex>

      <Flex justifyBetween mb={2}>
        <Div>Confirmations / Needed:</Div>
        <Div>
          {confirmations} / {networkConfirmations}
        </Div>
      </Flex>
    </Div>
  );
}

export default TransactionDetails
