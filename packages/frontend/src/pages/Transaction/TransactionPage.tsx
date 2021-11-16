import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Div, Flex } from 'src/components/ui'
import { useTransaction } from 'src/hooks'
import SmallTextField from 'src/components/SmallTextField'
import { Link } from '@material-ui/core'
import { useApp } from 'src/contexts/AppContext'
import Network from 'src/models/Network'
import { networkIdToSlug, truncateHash } from 'src/utils'
import { utils } from 'ethers'
import { Text } from 'src/components/ui/Text'
import { getExplorerTxUrl } from 'src/utils/getExplorerUrl'
import { metadata } from 'src/config'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { NetworkSelector } from 'src/components/NetworkSelector'
import { DisplayObjectValues } from './DisplayObjectValues'

function TransactionPage() {
  const { hash } = useParams<{ hash: string }>()
  const [txHash, setTxHash] = useState<string>(hash)
  const [sourceNetwork, setSourceNetwork] = useState<Network>()

  const { sdk, tokens } = useApp()
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

  const { txObj, loading, error, confirmations, networkConfirmations } = useTransaction(
    txHash,
    sourceNetwork?.slug
  )

  useEffect(() => {
    console.log(`txObj:`, txObj)
  }, [txObj])

  async function handleSetNetwork(network) {
    if (txHash && network) {
      setSourceNetwork(network)
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

  return (
    <Div>
      <Flex justifyAround>
        <Flex>
          <NetworkSelector network={sourceNetwork} setNetwork={handleSetNetwork} />
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
      </Flex>

      <Flex column alignCenter>
        {error ? (
          <Div>{error.message}</Div>
        ) : loading ? (
          <Div>Loading...</Div>
        ) : (
          txObj && (
            <Div my={4}>
              <Div my={4} bold>
                <Flex justifyBetween my={2}>
                  <Div>Tx Type:</Div>
                  <Div>{txObj?.type}</Div>
                </Flex>
                <Flex justifyBetween mb={2}>
                  <Div>Token:</Div>
                  <Div onClick={addToken}>{txObj?.tokenSymbol}</Div>
                </Flex>
              </Div>

              <Flex justifyBetween mb={2}>
                <Div bold>Source Network:</Div>
                {sourceNetwork && (
                  <Link href={getExplorerTxUrl(sourceNetwork.slug, txHash)} target="_blank">
                    {sourceNetwork?.slug}: {truncateHash(txHash)}
                  </Link>
                )}
              </Flex>

              <Flex justifyBetween mb={2}>
                <Div>From:</Div>
                <Text mono>{txObj?.response.from}</Text>
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
                <Div>Gas Price:</Div>
                <Div>
                  {utils.formatUnits(txObj?.response?.gasPrice?.toString() || '0', 'gwei')} Gwei
                </Div>
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
                <Div>Confirmations / Needed:</Div>
                <Div>
                  {confirmations} / {networkConfirmations}
                </Div>
              </Flex>

              <Flex justifyBetween bold mb={2} mt={4}>
                <Div>Method Name:</Div>
                <Div>{txObj?.methodName}</Div>
              </Flex>

              {txObj?.params && (
                <DisplayObjectValues params={txObj.params} title="Transaction Params" />
              )}

              {txObj.destNetworkName && (
                <>
                  <Flex justifyBetween mt={4} mb={2}>
                    <Div bold>Destination Network:</Div>
                    {txObj.destExplorerLink ? (
                      <Link href={txObj.destExplorerLink} target="_blank">
                        {txObj.destNetworkName}: {truncateHash(txObj.destTxHash)}
                      </Link>
                    ) : (
                      <Div>{txObj.destNetworkName}</Div>
                    )}
                  </Flex>
                  <Flex justifyBetween mb={2}>
                    <Div>Destination tx confirmed:</Div>
                    <Div>{txObj?.datetime}</Div>
                  </Flex>
                </>
              )}

              {txObj?.eventValues && (
                <DisplayObjectValues params={txObj.eventValues} title="Event Values" />
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
