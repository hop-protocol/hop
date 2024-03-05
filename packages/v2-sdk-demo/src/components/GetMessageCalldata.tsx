import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import { HighlightedButton } from './HighlightedButton'
import { CustomTextField } from './CustomTextField'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from './Syntax'
import { ChainSelect } from './ChainSelect'
import { useStyles } from './useStyles'
import { CopyToClipboard } from 'react-copy-to-clipboard'

type Props = {
  sdk: Hop
}

export function GetMessageCalldata (props: Props) {
  const { sdk } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useState(() => {
    try {
      const cached = localStorage.getItem('getMessageCalldata:fromChainId')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return '420'
  })
  const [messageId, setMessageId] = useState(() => {
    try {
      const cached = localStorage.getItem('getMessageCalldata:messageId')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [calldata, setCalldata] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem('getMessageCalldata:fromChainId', fromChainId)
    } catch (err: any) {
      console.error(err)
    }
  }, [fromChainId])

  useEffect(() => {
    try {
      localStorage.setItem('getMessageCalldata:messageId', messageId)
    } catch (err: any) {
      console.error(err)
    }
  }, [messageId])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setCalldata('')
      setLoading(true)

      const args = {
        fromChainId: Number(fromChainId),
        messageId
      }

      console.log('args', args)
      const calldata = await sdk.getMessageCalldata(args)
      setCalldata(calldata)
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
  const messageId = "${messageId}"

  const hop = new Hop('goerli')
  const calldata = await hop.getMessageCalldata({
    fromChainId,
    messageId
  })
  console.log(calldata)
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
        <Typography variant="h5">Get Message Calldata</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get calldata of message given messageId</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <Box mb={1}>
                <label>From Chain ID <small><em>(number)</em></small> <small><em>This is the origin chain of the message</em></small></label>
              </Box>
              {/*<CustomTextField fullWidth placeholder="420" value={fromChainId} onChange={event => setFromChainId(event.target.value)} />*/}
              <ChainSelect value={fromChainId} chains={['420', '5']} onChange={value => setFromChainId(value)} />
            </Box>
            <Box mb={2}>
              <Box mb={1}>
                <label>Message ID <small><em>(hex string)</em></small> <small><em>This is the messageId from the <code>MessageSent</code> event</em></small></label>
              </Box>
              <CustomTextField fullWidth placeholder="0x" value={messageId} onChange={event => setMessageId(event.target.value)} />
            </Box>
            <Box mb={2} display="flex" justifyContent="center">
              <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Get</HighlightedButton>
            </Box>
          </form>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!calldata && (
            <Box>
              <Box mb={2}>
                <Typography variant="body1">Output</Typography>
              </Box>
              <pre style={{
                maxWidth: '500px',
                overflow: 'auto'
              }}>
                {calldata}
              </pre>
              <CopyToClipboard text={messageId}
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
