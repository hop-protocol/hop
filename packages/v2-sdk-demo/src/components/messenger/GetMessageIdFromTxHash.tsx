import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { HighlightedButton } from '../HighlightedButton.js'
import { CustomTextField } from '../CustomTextField.js'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax.js'
import { ChainSelect } from '../ChainSelect.js'
import { useStyles } from '../useStyles.js'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useLocalStorageState } from '../../hooks/useLocalStorageState.js'
import { useShared } from '../shared.js'

type Props = {
  sdk: Hop
}

export function GetMessageIdFromTxHash (props: Props) {
  const cacheKey = 'getMessageIdFromTxHash'
  const { sdk } = props
  const styles = useStyles()
  const { hopInstantiateDisplayString, defaultChainIds, chainIds } = useShared()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useLocalStorageState(`${cacheKey}:fromChainId`, {
    defaultValue: defaultChainIds.from,
  })

  const [messageSentTransactionHash, setMessageSentTransactionHash] = useLocalStorageState(`${cacheKey}:messageSentTransactionHash`, {
    defaultValue: '',
  })
  const [messageId, setMessageId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setMessageId('')
      setLoading(true)

      const args = {
        transactionHash: messageSentTransactionHash
      }

      console.log('args', args)
      const messageId = await sdk.getMessenger(fromChainId).getMessageIdFromTransactionHash(args)
      setMessageId(messageId)
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
  const transactionHash = "${messageSentTransactionHash}"

  ${hopInstantiateDisplayString}
  const messageId = await hop.getMessenger(chainId).getMessageIdFromTransactionHash({
    transactionHash
  })
  console.log(messageId)
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
        <Typography variant="h5">Messenger - Get Message ID From Transaction Hash</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get Message ID from transaction hash</Typography>
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
                <label>Message Transaction Hash <small><em>(hex string)</em></small> <small><em>This is tx hash that contains the <code>MessageSent</code> event</em></small></label>
              </Box>
              <CustomTextField fullWidth placeholder="0x" value={messageSentTransactionHash} onChange={event => setMessageSentTransactionHash(event.target.value)} />
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
          {!!messageId && (
            <Box>
              <Box mb={2}>
                <Typography variant="body1">Output</Typography>
              </Box>
              <pre style={{
                maxWidth: '500px',
                overflow: 'auto'
              }}>
                {messageId}
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

export default GetMessageIdFromTxHash
