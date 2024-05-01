import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax'
import { useStyles } from '../useStyles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { HighlightedButton } from '../HighlightedButton'
import { ChainSelect } from '../ChainSelect'
import { network, defaultChainIds, chainIds } from '../../config'

type Props = {
  sdk: Hop
}

export function GetMessageFee (props: Props) {
  const cacheKey = 'getMessageFee'
  const { sdk } = props
  const styles = useStyles()
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
  const [copied, setCopied] = useState(false)
  const [output, setOutput] = useState('')

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const args = {
        fromChainId,
        toChainId
      }
      console.log(args)
      const fee = await sdk.messenger.getMessageFee(args)
      setOutput(fee.toString())
    } catch (err: any) {
      console.error(err)
    }
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'

async function main() {
  const hop = new Hop({ network: '${network}' })
  const fromChainId = "${fromChainId}"
  const toChainId = "${toChainId}"

  const fee = await hop.messenger.getMessageFee({
    fromChainId,
    toChainId
  })
  console.log(fee)
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
        <Typography variant="h5">Messenger - Get Message Fee</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get fee in wei required to send message</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <Box mb={1}>
                <label>From Chain ID <small><em>(uint256)</em></small> <small><em>This is the origin chain the message will be sent from</em></small></label>
              </Box>
              <ChainSelect value={fromChainId} chains={chainIds} onChange={value => setFromChainId(value)} />
            </Box>
            <Box mb={2}>
              <Box mb={1}>
                <label>To Chain ID <small><em>(uint256)</em></small> <small><em>This is the destination chain for the message</em></small></label>
              </Box>
              <ChainSelect value={toChainId} chains={chainIds} onChange={value => setToChainId(value)} />
            </Box>
            <Box mb={2} display="flex" justifyContent="center">
              <HighlightedButton fullWidth type="submit" variant="contained" size="large">Get</HighlightedButton>
            </Box>
          </form>
          {!!output && (
            <Box>
              <Box mb={2}>
                <Typography variant="body1">Output</Typography>
              </Box>
              <pre style={{
                maxWidth: '500px',
                overflow: 'auto'
              }}>{output}</pre>
              <CopyToClipboard text={output}
                onCopy={handleCopy}>
                <Typography variant="body2" style={{ cursor: 'pointer' }}>
                  {copied ? 'Copied!' : 'Copy to clipboard'}
                </Typography>
              </CopyToClipboard>
            </Box>
          )}
        </Box>
        <Box width="100%" className={styles.syntaxContainer}>
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
