import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { HighlightedButton } from '../HighlightedButton'
import { CustomTextField } from '../CustomTextField'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax'
import { ChainSelect } from '../ChainSelect'
import { useStyles } from '../useStyles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { network, defaultChainIds, chainIds } from '../../config'
import { useLocalStorageState } from '../../hooks/useLocalStorageState'

type Props = {
  sdk: Hop
}

export function GetMessageSentEventFromMessageId (props: Props) {
  const cacheKey = 'getMessageSentEvent'
  const { sdk } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useLocalStorageState(`${cacheKey}:fromChainId`, {
    defaultValue: defaultChainIds.from,
  })

  const [messageId, setMessageId] = useLocalStorageState(`${cacheKey}:messageId`, {
    defaultValue: '',
  })
  const [event, setEvent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setEvent('')
      setLoading(true)

      const args = {
        chainId: fromChainId,
        messageId
      }

      console.log('args', args)
      const event = await sdk.messenger.getMessageSentEventFromMessageId(args)
      setEvent(JSON.stringify(event, null, 2))
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'

async function main() {
  const chainId = "${fromChainId}"
  const messageId = "${messageId}"

  const hop = new Hop({ network: '${network}' })
  const event = await hop.messenger.getMessageSentEventFromMessageId({
    chainId,
    messageId
  })
  console.log(event)
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
        <Typography variant="h5">Messenger - Get Message Sent Event From Message ID</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get full event log from messageId</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <Box mb={1}>
                <label>From Chain ID <small><em>(uint256)</em></small> <small><em>This is the origin chain of the message</em></small></label>
              </Box>
              <ChainSelect value={fromChainId} chains={chainIds} onChange={value => setFromChainId(value)} />
            </Box>
            <Box mb={2}>
              <Box mb={1}>
                <label>Message ID <small><em>(bytes32)</em></small> <small><em>This is the messageId from the <code>MessageSent</code> event</em></small></label>
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
          {!!event && (
            <Box>
              <Box mb={2}>
                <Typography variant="body1">Output</Typography>
              </Box>
              <pre style={{
                maxWidth: '500px',
                overflow: 'auto'
              }}>
                {event}
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

export default GetMessageSentEventFromMessageId
