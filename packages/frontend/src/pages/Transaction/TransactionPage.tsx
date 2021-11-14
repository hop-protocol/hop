import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Div, Flex } from 'src/components/ui'
import { useTransaction } from 'src/hooks'
import SmallTextField from 'src/components/SmallTextField'
import { Box, Button, Link, makeStyles, MenuItem, Typography } from '@material-ui/core'
import FlatSelect from 'src/components/selects/FlatSelect'
import { useApp } from 'src/contexts/AppContext'
import Network from 'src/models/Network'
import Transaction from 'src/models/Transaction'
import TxStatusModal from 'src/components/modal/TxStatusModal'
import { getBaseExplorerUrl, normalizeBN, truncateHash } from 'src/utils'
import { utils } from 'ethers'
import { Text } from 'src/components/ui/Text'

function TransactionParams({ params }: { params?: any[] }) {
  const [args, setArgs] = useState<any[]>()

  useEffect(() => {
    const ps = params?.reduce((acc, p, i) => {
      console.log(`p, i:`, p, i)
      if (p === i) {
        return acc
      }
      if (typeof p === 'string') {
        return [...acc, p]
      }
      if (p._isBigNumber) {
        return [...acc, p.toString()]
      }
      return acc
    }, [])

    setArgs(ps)
  }, [params])

  return (
    <>
      {args?.map((arg, i) => (
        <Div key={arg}>
          {i}: {arg}
        </Div>
      ))}
    </>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '51.6rem',
    boxSizing: 'border-box',
    [theme.breakpoints.down('xs')]: {
      width: 'auto',
    },
  },
  topRow: {
    marginBottom: '1.8rem',
  },
  networkSelectionBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultLabel: {
    height: '3.8rem',
    marginLeft: '1.2rem',
  },
  networkLabel: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '0.4rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  networkIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '4rem',
    height: '4rem',
  },
  networkIcon: {
    display: 'flex',
    height: '2.2rem',
    margin: '0.7rem',
  },
  balance: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  maxButton: {
    border: 'none',
    background: '#f8f8f9',
    borderRadius: '1rem',
    padding: '0.5rem 1rem',
    fontSize: '1.2rem',
    marginRight: '1rem',
    cursor: 'pointer',
  },
}))

function TransactionPage() {
  const { hash } = useParams<{ hash: string }>()

  const [txHash, setTxHash] = useState<string>(hash)
  const [sourceNetwork, setSourceNetwork] = useState<Network>()

  const { networks } = useApp()
  const styles = useStyles()

  // STATE
  // balances
  // liquidity
  // contract: address, name, network id
  // method name, params, parsed args
  // type of tx / transfer: (send, approve, convert, wrap, unwrap, addLiquidity, removeLiquidity, stake)
  // bonder fees
  // lp fees
  // timing (x minutes ago)
  // error messages
  // link to graph
  // link to notion: shared external
  // add token to MM

  // txHash + network -> sourceNetworkProvider.getTransaction(txHash)
  // -> tx.from -> sourceNetworkProvider.getBalance(tx.from)
  // -> tx.to -> find(addresses[network], [tx.to])
  // -> contract -> tx.data.slice(0, 8) -> methodName and tx type
  // tx types: approve / sendL1ToL2 / sendL2ToL2 / sendL2ToL1 / convert / wrap / unwrap / addLiquidity / removeLiquidity / stake / unstake?
  // -> contract.interface.parseTransactionData(tx.data) -> tx args

  // TheGraph -> events -> destTxHash -> destExplorerLink

  // provider.getTransactionReceipt(txHash) -> receipt.logs -> getTransferSentDetailsFromLogs(receipt.logs) -> find__Logs()
  // if L2ToL1 -> bridge.isTransferIdSpent(transferId)
  // if no transferId (L1ToL2) -> fetchTransferFromL1Completeds(transferId)
  // if transferId found in TransferSent -> fetchWithdrawalBondedsByTransferId(destNetworkName, transferId)

  // TODO: turn network selector into its own component

  const {
    tx,
    txObj,
    loading,
    initState,
    confirmations,
    networkConfirmations,
    getTransactionDetails,
  } = useTransaction(txHash, sourceNetwork?.slug)

  useEffect(() => {
    if (hash) {
      setTxHash(hash)
    }
  }, [hash])

  async function handleInit() {
    if (txHash && sourceNetwork) {
      await initState(txHash, sourceNetwork.slug)
    } else {
      await initState(txHash, 'polygon')
    }
  }

  return (
    <Div>
      <Flex justifyAround>
        <Flex>
          <FlatSelect
            value={sourceNetwork || 'default'}
            onChange={event => {
              const network = networks.find(_network => _network.slug === event.target.value)
              setSourceNetwork(network)
            }}
          >
            <MenuItem value="default">
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                className={styles.defaultLabel}
              >
                <Typography variant="subtitle2" className={styles.networkLabel}>
                  Select Network
                </Typography>
              </Box>
            </MenuItem>
            {networks.map(network => (
              <MenuItem value={network.slug} key={network.slug}>
                <Box className={styles.networkSelectionBox}>
                  <Box className={styles.networkIconContainer}>
                    <img src={network.imageUrl} className={styles.networkIcon} alt={network.name} />
                  </Box>
                  <Typography variant="subtitle2" className={styles.networkLabel}>
                    {network.name}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </FlatSelect>
        </Flex>

        <Div width="70%">
          <SmallTextField
            style={{
              backgroundColor: 'yellow',
            }}
            value={txHash}
            onChange={e => setTxHash(e.target.value)}
            placeholder="Enter source tx hash"
            fullWidth
            // units={hideSymbol ? '' : token?.symbol}
            // disabled={disableInput}
            // loadingValue={loadingValue}
          />
        </Div>
        <Button color="primary" onClick={handleInit}>
          Init
        </Button>
      </Flex>

      <Flex column alignCenter>
        {loading ? (
          <Div>Loading...</Div>
        ) : (
          tx && (
            <Div>
              <Flex justifyBetween mb={2}>
                <Div>Source Network:</Div>
                <Link href={tx.explorerLink} target="_blank">
                  {tx.networkName}: {truncateHash(tx.hash)}
                </Link>
              </Flex>

              <Flex justifyBetween mb={2}>
                <Div>From:</Div>
                <Text mono>{txObj?.response.from}</Text>
                {/* <Link href={}>

              </Link> */}
              </Flex>
              <Flex justifyBetween mb={2}>
                <Div>To:</Div>
                <Text mono>{txObj?.response.to}</Text>
              </Flex>

              <Flex justifyBetween mb={2}>
                <Div>Value:</Div>
                <Div>{txObj?.response?.value?.toString()} ETH</Div>
              </Flex>

              <Flex justifyBetween mb={2}>
                <Div>Gas Price:</Div>{' '}
                {utils.formatUnits(txObj?.response?.gasPrice?.toString() || '0', 'gwei')} Gwei
              </Flex>

              <Flex justifyBetween mb={2}>
                <Div>Gas Limit:</Div>
                <Div>{txObj?.response?.gasLimit?.toString()}</Div>
              </Flex>

              <Flex justifyBetween mb={2}>
                <Div>Gas Cost:</Div>
                <Div>
                  {txObj?.gasCost}
                  &nbsp;ETH
                </Div>
              </Flex>

              <Flex justifyBetween mb={2}>
                <Div>Tx Nonce:</Div> {txObj?.response?.nonce}
              </Flex>

              <Flex justifyBetween mb={2}>
                <Div>Confirmations:</Div>
                <Div>
                  {confirmations} / {networkConfirmations} needed
                </Div>
              </Flex>

              {/* SPECIFICS */}
              <Flex justifyBetween mb={2} mt={4}>
                <Div>Tx Type:</Div> {txObj?.type}
              </Flex>
              <Flex justifyBetween mb={2}>
                <Div>Method Name:</Div> {txObj?.methodName}
              </Flex>
              <Flex justifyBetween mb={2}>
                <Div>Datetime:</Div> {txObj?.timestamp}
              </Flex>

              <Flex justifyBetween mb={2}>
                <Div>Destination Network:</Div>
                {tx.destExplorerLink ? (
                  <Link href={tx.destExplorerLink} target="_blank">
                    {tx.destNetworkName}: {truncateHash(tx.destTxHash)}
                  </Link>
                ) : (
                  <Div>{tx.destNetworkName}</Div>
                )}
              </Flex>

              {txObj &&
                txObj.eventValues &&
                Object.keys(txObj.eventValues).map(param => (
                  <Flex key={param} justifyBetween mb={2}>
                    <Div>{param}:</Div>
                    <Div>{txObj.eventValues[param]}</Div>
                  </Flex>
                ))}
              <Flex justifyBetween mb={2}>
                <Div>Token:</Div> {txObj?.eventValues?.token}
              </Flex>

              <Flex justifyBetween mb={2}>
                <Div>Transfer ID:</Div> {tx.transferId}
              </Flex>
              {/* <Flex column>
              Params: <TransactionParams params={txObj?.params} />
            </Flex> */}
              {/* {Object.keys(tx.toObject()).map(k => (
              <Div key={k}>
                {k}: {typeof tx[k] === 'string' ? tx[k] : JSON.stringify(tx[k])}
              </Div>
            ))}
            <Typography noWrap={true}>{JSON.stringify(tx.toObject())}</Typography> */}
            </Div>
          )
        )}

        {/* {tx && <TxStatusModal onClose={() => setTx(null)} tx={tx} />} */}

        <Link
          href="https://www.notion.so/authereum/How-to-find-out-if-a-transaction-has-arrived-on-the-Destination-Chain-using-The-Graph-5c65d441fe894ccfb75e01f8e10ff651"
          target="_blank"
        >
          How to find out if a transaction has arrived on the Destination Chain using The Graph
        </Link>
        <Link
          href="https://authereum.notion.site/Hop-Direct-Contract-Integration-b3a7030ba9264ae79d96087dec448d10"
          target="_blank"
        >
          Hop Direct Contract Integration
        </Link>
      </Flex>
    </Div>
  )
}

export default TransactionPage
