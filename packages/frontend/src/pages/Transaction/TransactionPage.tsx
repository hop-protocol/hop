import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Div, Flex } from 'src/components/ui'
import { useTransaction } from 'src/hooks'
import SmallTextField from 'src/components/SmallTextField'
import { Button, Link, makeStyles } from '@material-ui/core'
import { useApp } from 'src/contexts/AppContext'
import Network from 'src/models/Network'
import { networkIdToSlug, truncateHash, weiArgsToConvert } from 'src/utils'
import { utils } from 'ethers'
import { Text } from 'src/components/ui/Text'
import { TxStatusTracker } from 'src/components/Transaction'
import { getExplorerTxUrl } from 'src/utils/getExplorerUrl'
import { metadata } from 'src/config'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { NetworkSelector } from 'src/components/NetworkSelector'

function TransactionParams({ params, eventValues }) {
  return (
    <>
      <Flex mt={4} bold>
        Transaction Params
      </Flex>

      {Object.keys(params).map(param => (
        <Flex key={param} justifyBetween mb={2}>
          <Div>{param}:</Div>
          <Div>{weiArgsToConvert.includes(param) ? `${params[param]} ETH` : params[param]}</Div>
        </Flex>
      ))}

      <Flex mt={4} bold>
        Event Values
      </Flex>

      {Object.keys(eventValues).map(param => (
        <Flex key={param} justifyBetween mb={2}>
          <Div>{param}:</Div>
          <Div>
            {weiArgsToConvert.includes(param) ? `${eventValues[param]} ETH` : eventValues[param]}
          </Div>
        </Flex>
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

  const { sdk, tokens } = useApp()
  const { connectedNetworkId } = useWeb3Context()

  // STATE
  // balances
  // liquidity
  // contract: address, name, network id
  // method name, params, parsed args
  // type of tx / transfer: (send, approve, convert, wrap, unwrap, addLiquidity, removeLiquidity, stake)
  // timing (x minutes ago)
  // error messages
  // link to graph
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

  const { txObj, loading, initState, confirmations, networkConfirmations } = useTransaction(
    txHash,
    sourceNetwork?.slug
  )

  useEffect(() => {
    if (hash) {
      setTxHash(hash)
    }
  }, [hash])

  useEffect(() => {
    console.log(`txObj:`, txObj)
  }, [txObj])

  async function handleInit() {
    if (txHash && sourceNetwork) {
      await initState(txHash, sourceNetwork.slug)
    } else {
      await initState(txHash, 'polygon')
    }
  }

  async function addToken() {
    if (txObj?.tokenSymbol) {
      console.log(`tokens['DAI']:`, (tokens as any).DAI)
      const { tokenSymbol } = txObj
      const tokenImageUrl = metadata.tokens[tokenSymbol].image
      const tokenModel = sdk.toTokenModel(txObj.tokenSymbol)
      const networkName = networkIdToSlug(connectedNetworkId)
      if (networkName === 'ethereum') {
        return
      }
      console.log(`tokenImageUrl:`, tokenImageUrl)
      const addr = tokens[tokenSymbol][networkName].l2CanonicalToken.address
      ;(window as any).ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: addr,
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenModel.decimals, // The number of decimals in the token
            image: tokenImageUrl, // A string url of the token logo
          },
        },
      })
    }
  }

  return (
    <Div>
      <Flex justifyAround>
        <Flex>
          <NetworkSelector network={sourceNetwork} setNetwork={setSourceNetwork} />
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
          txObj && (
            <Div>
              <Flex justifyBetween mb={4}>
                <Div>Tx Type:</Div> {txObj?.type}
              </Flex>

              <Flex justifyBetween mb={2}>
                <Div>Source Network:</Div>
                {sourceNetwork && (
                  <Link href={getExplorerTxUrl(sourceNetwork.slug, txHash)} target="_blank">
                    {sourceNetwork?.slug}: {truncateHash(txHash)}
                  </Link>
                )}
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
                <Div>Tx Nonce:</Div>
                <Div>{txObj?.response?.nonce}</Div>
              </Flex>

              <Flex justifyBetween mb={2}>
                <Div>Confirmations:</Div>
                <Div>
                  {confirmations} / {networkConfirmations} needed
                </Div>
              </Flex>

              {/* SPECIFICS */}
              <Flex justifyBetween mb={2} mt={4}>
                <Div>Method Name:</Div>
                <Div>{txObj?.methodName}</Div>
              </Flex>
              <Flex justifyBetween mb={2}>
                <Div mr={4}>Token:</Div>
                <Div onClick={addToken}>{txObj?.tokenSymbol}</Div>
              </Flex>
              <Flex justifyBetween mb={2}>
                <Div mr={4}>Datetime:</Div>
                <Div>{txObj?.datetime}</Div>
              </Flex>

              <Flex justifyBetween my={4}>
                <Div>Destination Network:</Div>
                {txObj.destExplorerLink ? (
                  <Link href={txObj.destExplorerLink} target="_blank">
                    {txObj.destNetworkName}: {truncateHash(txObj.destTxHash)}
                  </Link>
                ) : (
                  <Div>{txObj.destNetworkName}</Div>
                )}
              </Flex>

              {txObj && txObj.params && txObj.eventValues && (
                <TransactionParams params={txObj.params} eventValues={txObj.eventValues} />
              )}
            </Div>
          )
        )}

        {/* {tx && <TxStatusTracker tx={tx} />} */}

        <Flex column mt={4}>
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
      </Flex>
    </Div>
  )
}

export default TransactionPage
