import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax.js'
import { useStyles } from '../useStyles.js'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { HighlightedButton } from '../HighlightedButton.js'
import { ChainSelect } from '../ChainSelect.js'
import { useLocalStorageState } from '../../hooks/useLocalStorageState.js'
import { useShared } from '../shared.js'

type Props = {
  sdk: Hop
}

export function GetMessageFee (props: Props) {
  const cacheKey = 'getMessageFee'
  const { sdk } = props
  const styles = useStyles()
  const { hopInstantiateDisplayString, defaultChainIds, chainIds } = useShared()
  const [fromChainId, setFromChainId] = useLocalStorageState(`${cacheKey}:fromChainId`, {
    defaultValue: defaultChainIds.from,
  })

  const [toChainId, setToChainId] = useLocalStorageState(`${cacheKey}:toChainId`, {
    defaultValue: defaultChainIds.to,
  })

  const [output, setOutput] = useLocalStorageState(`${cacheKey}:output`, {
    defaultValue: ''
  })

  const [copied, setCopied] = useState(false)

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
  ${hopInstantiateDisplayString}
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

export default GetMessageFee
