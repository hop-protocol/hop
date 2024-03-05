import React, { useState, useEffect } from 'react'
import { Signer, providers } from 'ethers'
import Box from '@mui/material/Box'
import { HighlightedButton } from './HighlightedButton'
import { CustomTextField } from './CustomTextField'
import Checkbox from '@mui/material/Checkbox'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from './Syntax'
import { ChainSelect } from './ChainSelect'
import { useStyles } from './useStyles'
import { CopyToClipboard } from 'react-copy-to-clipboard'

type Props = {
  signer?: Signer
  sdk: Hop
  checkConnectedNetworkId: any
  requestWallet: any
}

export function ExitBundle (props: Props) {
  const { signer, sdk, checkConnectedNetworkId, requestWallet } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useState(() => {
    try {
      const cached = localStorage.getItem('exitBundle:fromChainId')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return '420'
  })
  const [bundleCommittedTxHash, setBundleCommittedTxHash] = useState(() => {
    try {
      const cached = localStorage.getItem('exitBundle:bundleCommittedTxHash')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [txData, setTxData] = useState('')
  const [populateTxDataOnly, setPopulateTxDataOnly] = useState(true)
  const [txHash, setTxHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem('exitBundle:fromChainId', fromChainId)
    } catch (err: any) {
      console.error(err)
    }
  }, [fromChainId])

  useEffect(() => {
    try {
      localStorage.setItem('exitBundle:bundleCommittedTxHash', bundleCommittedTxHash)
    } catch (err: any) {
      console.error(err)
    }
  }, [bundleCommittedTxHash])

  async function getSendTxData() {
    const args = {
      fromChainId: Number(fromChainId),
      bundleCommittedTransactionHash: bundleCommittedTxHash
    }
    console.log('args', args)
    const txData = await sdk.getBundleExitPopulatedTx(args)
    return txData
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setTxData('')
      setTxHash('')
      setLoading(true)
      const txData = await getSendTxData()
      setTxData(JSON.stringify(txData, null, 2))
      if (!populateTxDataOnly) {
        if (!signer) {
          throw new Error('No signer')
        }
        await checkConnectedNetworkId(Number(fromChainId))
        const tx = await signer.sendTransaction({
          ...txData
        })
        setTxHash(tx.hash)
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
  const fromChainId = ${fromChainId || 'undefined'}
  const bundleCommittedTransactionHash = "${bundleCommittedTxHash}"

  const hop = new Hop('goerli')
  const txData = await hop.getBundleExitPopulatedTx({
    fromChainId,
    bundleCommittedTransactionHash
  })
  ${populateTxDataOnly ? (
  'console.log(txData)'
  ) : (
  `
  const provider = new ethers.providers.Web3Provider(
    window.ethereum
  )
  const signer = provider.getSigner()
  const tx = await signer.sendTransaction(txData)
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
        <Typography variant="h5">Exit Bundle</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Exit bundle at the destination</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <Box mb={1}>
                <label>From Chain ID <small><em>(number)</em></small> <small><em>This is the origin chain of the message route</em></small></label>
              </Box>
              {/*<CustomTextField fullWidth placeholder="420" value={fromChainId} onChange={event => setFromChainId(event.target.value)} />*/}
              <ChainSelect value={fromChainId} chains={['420', '5']} onChange={value => setFromChainId(value)} />
            </Box>
            <Box mb={2}>
              <Box mb={1}>
                <label>From Chain Bundle Committed Tx Hash <small><em>(hex string)</em></small> <small><em>This is tx hash that contains the <code>BundleComitted</code> event for the Bundle ID</em></small></label>
              </Box>
              <CustomTextField fullWidth placeholder="0x" value={bundleCommittedTxHash} onChange={event => setBundleCommittedTxHash(event.target.value)} />
            </Box>
            <Box mb={2}>
              <Box mb={1}>
                <Checkbox onChange={event => setPopulateTxDataOnly(event.target.checked)} checked={populateTxDataOnly} />
                <label>Populate Tx Only</label>
              </Box>
            </Box>
            <Box mb={2} display="flex" justifyContent="center">
              {!signer && (
                <HighlightedButton fullWidth variant="contained" size="large" onClick={() => requestWallet()}>Connect Wallet</HighlightedButton>
              )}
              {!!signer && (
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">{populateTxDataOnly ? 'Get tx data' : 'Send'}</HighlightedButton>
              )}
            </Box>
          </form>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!txHash && (
            <Box mb={4}>
              <Alert severity="success">Tx hash: {txHash}</Alert>
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
