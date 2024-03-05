import React, { useState, useEffect, useMemo } from 'react'
import { Signer, providers } from 'ethers'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from './HighlightedButton'
import { CustomTextField } from './CustomTextField'
import { CustomTextArea } from './CustomTextArea'
import Checkbox from '@mui/material/Checkbox'
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

export function RelayMessage (props: Props) {
  const { signer, sdk, checkConnectedNetworkId, requestWallet } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useState(() => {
    try {
      const cached = localStorage.getItem('relayMessage:fromChainId')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return '420'
  })
  const [toChainId, setToChainId] = useState(() => {
    try {
      const cached = localStorage.getItem('relayMessage:toChainId')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return '5'
  })
  const [fromAddress, setFromAddress] = useState(() => {
    try {
      const cached = localStorage.getItem('relayMessage:fromAddress')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [toAddress, setToAddress] = useState(() => {
    try {
      const cached = localStorage.getItem('relayMessage:toAddress')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [toCalldata, setToCalldata] = useState(() => {
    try {
      const cached = localStorage.getItem('relayMessage:toCalldata')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [txData, setTxData] = useState('')
  const [bundleProof, setBundleProof] = useState(() => {
    try {
      const cached = localStorage.getItem('relayMessage:bundleProof')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [populateTxDataOnly, setPopulateTxDataOnly] = useState(true)
  const [txHash, setTxHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem('relayMessage:fromChainId', fromChainId)
    } catch (err: any) {
      console.error(err)
    }
  }, [fromChainId])

  useEffect(() => {
    try {
      localStorage.setItem('relayMessage:toChainId', toChainId)
    } catch (err: any) {
      console.error(err)
    }
  }, [toChainId])

  useEffect(() => {
    try {
      localStorage.setItem('relayMessage:fromAddress', fromAddress)
    } catch (err: any) {
      console.error(err)
    }
  }, [fromAddress])

  useEffect(() => {
    try {
      localStorage.setItem('relayMessage:toAddress', toAddress)
    } catch (err: any) {
      console.error(err)
    }
  }, [toAddress])

  useEffect(() => {
    try {
      localStorage.setItem('relayMessage:toCalldata', toCalldata)
    } catch (err: any) {
      console.error(err)
    }
  }, [toCalldata])

  useEffect(() => {
    try {
      localStorage.setItem('relayMessage:bundleProof', bundleProof)
    } catch (err: any) {
      console.error(err)
    }
  }, [bundleProof])

  async function getSendTxData() {
    if (!bundleProof) {
      throw new Error('bundle proof json is required')
    }
    const args = {
      fromChainId: Number(fromChainId),
      toChainId: Number(toChainId),
      fromAddress,
      toAddress,
      toCalldata,
      bundleProof: JSON.parse(bundleProof.trim())
    }
    console.log('args', args)
    const txData = await sdk.getRelayMessagePopulatedTx(args)
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
        await checkConnectedNetworkId(Number(toChainId))
        const tx = await signer.sendTransaction({
          ...txData,
          // gasLimit: 1_000_000,
        })
        setTxHash(tx.hash)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const _bundleProof = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(bundleProof.trim()), null, 2)
    } catch (err: any) {
      return '{}'
    }
  }, [bundleProof])

  const code = `
${populateTxDataOnly ? `
import { Hop } from '@hop-protocol/v2-sdk'
`.trim() : `
import { Hop } from '@hop-protocol/v2-sdk'
import { ethers } from 'ethers'
`.trim()}

async function main() {
  const fromChainId = ${fromChainId || 'undefined'}
  const toChainId = ${toChainId || 'undefined'}
  const fromAddress = "${fromAddress}"
  const toAddress = "${toAddress}"
  const toCalldata = "${toCalldata}"
  const bundleProof = ${_bundleProof}

  const hop = new Hop('goerli')
  const txData = await hop.getRelayMessagePopulatedTx({
    fromChainId,
    toChainId,
    fromAddress,
    toAddress,
    toCalldata,
    bundleProof
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
        <Typography variant="h5">Relay Message</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Relay and execute message at the destination</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>From Chain ID <small><em>(number)</em></small> <small><em>This is the origin chain the message was sent from</em></small></label>
                </Box>
                {/*<CustomTextField fullWidth placeholder="420" value={fromChainId} onChange={event => setFromChainId(event.target.value)} />*/}
                <ChainSelect value={fromChainId} chains={['420', '5']} onChange={value => setFromChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>To Chain ID <small><em>(number)</em></small> <small><em>This is the destination chain specified for the message</em></small></label>
                </Box>
                {/*<CustomTextField fullWidth placeholder="5" value={toChainId} onChange={event => setToChainId(event.target.value)} />*/}
                <ChainSelect value={toChainId} chains={['420', '5']} onChange={value => setToChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>From <small><em>(address)</em></small> <small><em>This is the sender address that sent the message</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={fromAddress} onChange={event => setFromAddress(event.target.value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>To <small><em>(address)</em></small> <small><em>This is the destination address specified when sending the message</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={toAddress} onChange={event => setToAddress(event.target.value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Calldata <small><em>(hex string)</em></small> <small><em>This is the destination calldata specified when sending the message</em></small></label>
                </Box>
                <CustomTextArea minRows={5} placeholder="0x" value={toCalldata} onChange={event => setToCalldata(event.target.value)} style={{ width: '100%' }} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Bundle Proof <small><em>(JSON)</em></small> <small><em>This is the bundle proof JSON which can be generated given the message ID in form above</em></small></label>
                </Box>
                <CustomTextArea minRows={5} placeholder={`
{
  "bundleId": "",
  "treeIndex": 0,
  "siblings": [],
  "totalLeaves": 0
}
                `.trim()} value={bundleProof} onChange={event => setBundleProof(event.target.value)} style={{ width: '100%' }} />
              </Box>
              <Box mb={2}>
                <Box>
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
          </Box>
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
