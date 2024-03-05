import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from './HighlightedButton'
import { CustomTextField } from './CustomTextField'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from './Syntax'
import { ChainSelect } from './ChainSelect'
import { useStyles } from './useStyles'
import { CopyToClipboard } from 'react-copy-to-clipboard'

type Props = {
  sdk: Hop
}

export function GetBundleProof (props: Props) {
  const { sdk } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useState(() => {
    try {
      const cached = localStorage.getItem('getBundleProof:fromChainId')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return '420'
  })
  const [toChainId, setToChainId] = useState(() => {
    try {
      const cached = localStorage.getItem('getBundleProof:toChainId')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return '5'
  })
  const [messageId, setMessageId] = useState(() => {
    try {
      const cached = localStorage.getItem('getBundleProof:messageId')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [bundleProof, setBundleProof] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem('getBundleProof:fromChainId', fromChainId)
    } catch (err: any) {
      console.error(err)
    }
  }, [fromChainId])

  useEffect(() => {
    try {
      localStorage.setItem('getBundleProof:toChainId', toChainId)
    } catch (err: any) {
      console.error(err)
    }
  }, [toChainId])

  useEffect(() => {
    try {
      localStorage.setItem('getBundleProof:messageId', messageId)
    } catch (err: any) {
      console.error(err)
    }
  }, [messageId])

  async function getBundleProof() {
    const args = {
      fromChainId: Number(fromChainId),
      messageId
    }
    console.log('args', args)
    const proof = await sdk.getBundleProofFromMessageId(args)
    return proof
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setBundleProof('')
      setLoading(true)
      const proof = await getBundleProof()
      setBundleProof(JSON.stringify(proof, null, 2))
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'

async function main() {
  const fromChainId = ${fromChainId || 'undefined'}
  const toChainId = ${toChainId || 'undefined'}
  const messageId = "${messageId}"

  const hop = new Hop('goerli')
  const bundleProof = await hop.getBundleProofFromMessageId({
    fromChainId,
    messageId
  })
  console.log(bundleProof)
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
        <Typography variant="h5">Get Bundle Proof</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get bundle proof needed to relay message at destination chain</Typography>
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
                  <label>Message ID <small><em>(hex)</em></small> <small><em>The Message ID is emitted as an event when sending message</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={messageId} onChange={event => setMessageId(event.target.value)} />
              </Box>
              <Box mb={2} display="flex" justifyContent="center">
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Get Bundle Proof</HighlightedButton>
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!bundleProof && (
            <Box>
              <Box mb={2}>
                <Typography variant="body1">Output</Typography>
              </Box>
              <pre style={{
                maxWidth: '500px',
                overflow: 'auto'
              }}>
                {bundleProof}
              </pre>
              <CopyToClipboard text={bundleProof}
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
