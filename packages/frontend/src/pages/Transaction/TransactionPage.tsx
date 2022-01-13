import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Div, Flex } from 'src/components/ui'
import { useTransaction } from 'src/hooks'
import SmallTextField from 'src/components/SmallTextField'
import { Link } from '@material-ui/core'
import { useApp } from 'src/contexts/AppContext'
import { networkIdToSlug, truncateHash } from 'src/utils'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { DisplayObjectValues } from './DisplayObjectValues'
import { getTokenImage } from 'src/utils/tokens'
import { TransactionDetails } from '.'
import { ChainSlug } from '@hop-protocol/sdk'

function TransactionPage() {
  const { hash } = useParams<{ hash: string }>()
  const [txHash, setTxHash] = useState<string>(hash || '')

  const { sdk } = useApp()
  const { connectedNetworkId } = useWeb3Context()

  useEffect(() => {
    if (hash) {
      setTxHash(hash)
    }
  }, [hash])

  // STATE
  // balances
  // liquidity
  // tx types: approve / sendL1ToL2 / sendL2ToL2 / sendL2ToL1 / convert / wrap / unwrap / addLiquidity / removeLiquidity / stake / unstake?
  // link to graph
  // add token to MM

  const { tx, loading, error } = useTransaction(txHash)

  useEffect(() => {
    console.log(`tx:`, tx)
  }, [tx])

  async function addToken() {
    if (tx.tokenSymbol) {
      const { tokenSymbol } = tx
      const tokenImageUrl = getTokenImage(tokenSymbol)
      const tokenModel = sdk.toTokenModel(tokenSymbol)
      const networkName = networkIdToSlug(connectedNetworkId)
      if (networkName === ChainSlug.Ethereum) {
        return
      }
      const addr = sdk.getL2CanonicalTokenAddress(tokenSymbol, networkName)
      if (typeof (window as any)?.ethereum !== 'undefined') {
        ;(window as any).ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: addr,
              symbol: tokenSymbol,
              decimals: tokenModel.decimals,
              image: tokenImageUrl,
            },
          },
        })
      }
    }
  }

  return (
    <Div>
      <Flex justifyAround>
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
      </Flex>

      <Flex column alignCenter>
        {error ? (
          <Div>{error.message}</Div>
        ) : loading ? (
          <Div>Loading...</Div>
        ) : (
          tx.networkName && (
            <Div my={4}>
              <Div my={4} bold>
                <Flex justifyBetween my={2}>
                  <Div>Tx Type:</Div>
                  <Div>{tx.txType}</Div>
                </Flex>
                <Flex justifyBetween mb={2}>
                  <Div>Token:</Div>
                  <Div onClick={addToken}>{tx.tokenSymbol}</Div>
                </Flex>
              </Div>

              <TransactionDetails {...tx} />

              <Flex justifyBetween bold mb={2} mt={4}>
                <Div>Method Name:</Div>
                <Div>{tx.methodName}</Div>
              </Flex>

              {tx.params && (
                <DisplayObjectValues
                  token={tx.token}
                  params={tx.params}
                  title="Transaction Params"
                />
              )}
              {tx.eventValues && (
                <DisplayObjectValues
                  token={tx.token}
                  params={tx.eventValues}
                  title="Event Values"
                />
              )}

              {tx.destTx?.networkName && (
                <>
                  <Flex justifyBetween mt={4} mb={2}>
                    <Div bold>Destination Network:</Div>
                    {tx.destTx?.explorerLink ? (
                      <Link href={tx.destTx?.explorerLink} target="_blank">
                        {tx.destTx.networkName}: {truncateHash(tx.destTx?.txHash)}
                      </Link>
                    ) : (
                      <Div>{tx.destTx.networkName}</Div>
                    )}
                  </Flex>
                  <Flex justifyBetween mb={2}>
                    <Div>Destination tx confirmed:</Div>
                    <Div>{tx.destTx?.datetime}</Div>
                  </Flex>
                </>
              )}

              {tx.destTx?.eventValues && (
                <DisplayObjectValues
                  token={tx.token}
                  params={tx.destTx.eventValues}
                  title="Destination Event Values"
                />
              )}
            </Div>
          )
        )}

        <Flex column my={4}>
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
