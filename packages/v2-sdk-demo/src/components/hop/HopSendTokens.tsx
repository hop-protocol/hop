import React, { useState } from 'react'
import { Signer } from 'ethers'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from '../HighlightedButton'
import { CustomTextField } from '../CustomTextField'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax'
import { ChainSelect } from '../ChainSelect'
import { useStyles } from '../useStyles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { network, defaultChainIds, chainIds } from '../../config'
import { useLocalStorageState } from '../../hooks/useLocalStorageState'

type Props = {
  signer?: Signer
  sdk: Hop
  requestWallet: any
}

export function HopSendTokens (props: Props) {
  const cacheKey = 'hopSendTokens'
  const { signer, sdk, requestWallet } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useLocalStorageState(`${cacheKey}:fromChainId`, {
    defaultValue: defaultChainIds.from,
  })

  const [toChainId, setToChainId] = useLocalStorageState(`${cacheKey}:toChainId`, {
    defaultValue: defaultChainIds.to,
  })

  const [fromToken, setFromToken] = useLocalStorageState(`${cacheKey}:fromToken`, {
    defaultValue: '',
  })

  const [toToken, setToToken] = useLocalStorageState(`${cacheKey}:toToken`, {
    defaultValue: '',
  })

  const [toAddress, setToAddress] = useLocalStorageState(`${cacheKey}:toAddress`, {
    defaultValue: '',
  })

  const [amount, setAmount] = useLocalStorageState(`${cacheKey}:amount`, {
    defaultValue: '',
  })

  const [minAmountOut, setMinAmountOut] = useLocalStorageState(`${cacheKey}:minAmountOut`, {
    defaultValue: '',
  })

  const [txData, setTxData] = useLocalStorageState(`${cacheKey}:txData`, {
    defaultValue: '',
  })

  const [approvalTxHash, setApprovalTxHash] = useLocalStorageState(`${cacheKey}:approvalTxHash`, {
    defaultValue: '',
  })

  const [txHash, setTxHash] = useLocalStorageState(`${cacheKey}:txHash`, {
    defaultValue: '',
  })

  const [transferId, setTransferId] = useLocalStorageState(`${cacheKey}:transferId`, {
    defaultValue: '',
  })

  const [populateTxDataOnly, setPopulateTxDataOnly] = useLocalStorageState(`${cacheKey}:populateTxDataOnly`, {
    defaultValue: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function getSendTxData() {
    const args = {
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      to: toAddress,
      amount,
      minAmountOut,
    }
    console.log('args', args)
    const txData = await sdk.populateTransaction.sendTokens(args)
    return txData
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setTxData('')
      setApprovalTxHash('')
      setTxHash('')
      setTransferId('')
      setLoading(true)
      if (populateTxDataOnly) {
        const txData = await getSendTxData()
        setTxData(JSON.stringify(txData, null, 2))
      } else {
        if (!signer) {
          throw new Error('No signer')
        }

        const needsApproval = await sdk.getNeedsApprovalForSendTokens({
          fromChainId,
          toChainId,
          fromToken,
          toToken,
          amount
        })

        if (needsApproval) {
          const approveTxData = await sdk.populateTransaction.approveSendTokens({
            fromChainId,
            toChainId,
            fromToken,
            toToken,
            amount
          })
          const tx = await sdk.sendTransaction(approveTxData)
          setApprovalTxHash(tx.hash)
        } else {
          const txData = await getSendTxData()
          setTxData(JSON.stringify(txData, null, 2))
          const tx = await sdk.sendTransaction(txData)
          setTxHash(tx.hash)

          const receipt = await tx.wait()
          const event = await sdk.railsGateway.getTransferSentEventFromTransactionReceipt({
            chainId: fromChainId,
            receipt
          })
          const transferId = event?.decoded.transferId
          setTransferId(transferId)
        }
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const code = `
${populateTxDataOnly ? `
import { Hop } from '@hop-protocol/v2-sdk'
`.trim() : `
import { Hop } from '@hop-protocol/v2-sdk'
import { ethers } from 'ethers'
`.trim()}

async function main() {
  const fromChainId = "${fromChainId}"
  const toChainId = "${toChainId}"
  const fromToken = "${fromToken}"
  const toToken = "${toToken}"
  const to = "${toAddress}"
  const amount = "${amount}"
  const minAmountOut = "${minAmountOut}"

  const hop = new Hop({ network: '${network}' )
  const txData = await hop.populateTransaction.sendTokens({
    fromChainId,
    toChainId,
    fromToken,
    toToken,
    to,
    amount,
    minAmountOut
  })
  ${populateTxDataOnly ? (
  'console.log(txData)'
  ) : (
  `
  const signer = window.ethereum
  const tx = await hop.connect(signer).sendTransaction(txData)
  console.log(tx)
  `.trim()
  )}
}

main().catch(console.error)
`.trim()

  function handleCopy () {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5">Hop - Send Tokens</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Send tokens to a destination chain</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>From Chain ID <small><em>(uint256)</em></small> <small><em>This is the origin chain the transfer will be sent from</em></small></label>
                </Box>
                <ChainSelect value={fromChainId} chains={chainIds} onChange={value => setFromChainId(value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>To Chain ID <small><em>(uint256)</em></small> <small><em>This is the destination chain to send tokens to</em></small></label>
                </Box>
                <ChainSelect value={toChainId} chains={chainIds} onChange={value => setToChainId(value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>From Token <small><em>(address)</em></small> <small><em>Origin token address</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={fromToken} onChange={(event: any) => setFromToken(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>To Token <small><em>(address)</em></small> <small><em>Destination chain token address</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={toToken} onChange={(event: any) => setToToken(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>To <small><em>(address)</em></small> <small><em>Recipient at the destination</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={toAddress} onChange={(event: any) => setToAddress(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Amount <small><em>(uint256)</em></small> <small><em>Amount to send</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={amount} onChange={(event: any) => setAmount(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Min Amount Out <small><em>(uint256)</em></small> <small><em>Min amount out</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={minAmountOut} onChange={(event: any) => setMinAmountOut(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box>
                  <Checkbox onChange={(event: any) => setPopulateTxDataOnly(event.target.checked)} checked={populateTxDataOnly} />
                  <label>Populate Tx Only</label>
                </Box>
              </Box>
              <Box mb={2} display="flex" justifyContent="center">
                {!signer && (
                  <HighlightedButton fullWidth variant="contained" size="large" onClick={() => requestWallet()}>Connect Wallet</HighlightedButton>
                )}
                {!!signer && (
                  <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">{populateTxDataOnly ? 'Get tx data' : 'Send Tokens'}</HighlightedButton>
                )}
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!approvalTxHash && (
            <Box mb={4}>
              <Alert severity="success">Tx hash (Approval): {approvalTxHash}</Alert>
            </Box>
          )}
          {!!txHash && (
            <Box mb={4}>
              <Alert severity="success">Tx hash (Send): {txHash}</Alert>
            </Box>
          )}
          {!!transferId && (
            <Box mb={4}>
              <Alert severity="info">Transfer ID: {transferId}</Alert>
            </Box>
          )}
          {!!txData && (
            <Box>
              <Box mb={2}>
                <Typography variant="body1">Output</Typography>
              </Box>
              <pre style={{
                maxWidth: '500px',
                overflow: 'auto'
              }}>
                {txData}
              </pre>
              <CopyToClipboard text={txData}
                onCopy={handleCopy}>
                <Typography variant="body2" style={{ cursor: 'pointer' }}>
                  {copied ? 'Copied!' : 'Copy to clipboard'}
                </Typography>
              </CopyToClipboard>
            </Box>
          )}
        </Box>
        <Box width="100%" overflow="auto" className={styles.syntaxContainer}>
          <Box mb={2}>
            <Typography variant="subtitle1">Code example</Typography>
          </Box>
          <Box>
            <Syntax code={code} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default HopSendTokens
