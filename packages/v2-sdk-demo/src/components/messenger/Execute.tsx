import React, { useState, useEffect, useMemo } from 'react'
import { Signer } from 'ethers'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from '../HighlightedButton'
import { CustomTextField } from '../CustomTextField'
import { CustomTextArea } from '../CustomTextArea'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax'
import { ChainSelect } from '../ChainSelect'
import { useStyles } from '../useStyles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { network, defaultChainIds, chainIds } from '../../config'

type Props = {
  signer?: Signer
  sdk: Hop
  requestWallet: any
}

export function Execute (props: Props) {
  const cacheKey = 'execute'
  const { signer, sdk, requestWallet } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:fromChainId`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return defaultChainIds.from
  })
  const [toChainId, setToChainId] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:toChainId`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return defaultChainIds.to
  })
  const [messageId, setMessageId] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:messageId`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [fromAddress, setFromAddress] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:fromAddress`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [toAddress, setToAddress] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:toAddress`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [toCalldata, setToCalldata] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:toCalldata`)
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
      localStorage.setItem(`${cacheKey}:fromChainId`, fromChainId)
    } catch (err: any) {
      console.error(err)
    }
  }, [fromChainId])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:toChainId`, toChainId)
    } catch (err: any) {
      console.error(err)
    }
  }, [toChainId])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:messageId`, messageId)
    } catch (err: any) {
      console.error(err)
    }
  }, [messageId])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:fromAddress`, fromAddress)
    } catch (err: any) {
      console.error(err)
    }
  }, [fromAddress])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:toAddress`, toAddress)
    } catch (err: any) {
      console.error(err)
    }
  }, [toAddress])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:toCalldata`, toCalldata)
    } catch (err: any) {
      console.error(err)
    }
  }, [toCalldata])

  async function getSendTxData() {
    const args = {
      messageId,
      fromChainId,
      toChainId,
      fromAddress,
      toAddress,
      toCalldata
    }
    console.log('args', args)
    const txData = await sdk.messenger.populateTransaction.execute(args)
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
        const tx = await sdk.sendTransaction(txData)
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
  const messageId = "${messageId}"
  const fromChainId = "${fromChainId}"
  const toChainId = "${toChainId}"
  const fromAddress = "${fromAddress}"
  const toAddress = "${toAddress}"
  const toCalldata = "${toCalldata}"

  const hop = new Hop({ network: '${network}' })
  const txData = await hop.messenger.populateTransaction.execute({
    messageId,
    fromChainId,
    toChainId,
    fromAddress,
    toAddress,
    toCalldata
  })
  ${populateTxDataOnly ? (
  'console.log(txData)'
  ) : (
  `
  const provider = new ethers.providers.Web3Provider(
    window.ethereum
  )
  const signer = provider.getSigner()
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
        <Typography variant="h5">Messenger - Execute (Mock Contract)</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Execute message at the destination</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>From Chain ID <small><em>(uint256)</em></small> <small><em>This is the origin chain the message was sent from</em></small></label>
                </Box>
                <ChainSelect value={fromChainId} chains={chainIds} onChange={value => setFromChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>To Chain ID <small><em>(uint256)</em></small> <small><em>This is the destination chain specified for the message</em></small></label>
                </Box>
                <ChainSelect value={toChainId} chains={chainIds} onChange={value => setToChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Message ID <small><em>(bytes32)</em></small> <small><em>This is the origin chain message ID</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={messageId} onChange={event => setMessageId(event.target.value)} />
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
                  <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">{populateTxDataOnly ? 'Get tx data' : 'Execute'}</HighlightedButton>
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
