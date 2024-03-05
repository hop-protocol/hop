import React, { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from './Syntax'
import { useStyles } from './useStyles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { HighlightedButton } from './HighlightedButton'

type Props = {
  sdk: Hop
}

export function GetContractAddresses (props: Props) {
  const { sdk } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [output, setOutput] = useState(JSON.stringify(sdk?.getContractAddresses() ?? null, null, 2))

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const contractAddresses = sdk?.getContractAddresses()
      setOutput(JSON.stringify(contractAddresses, null, 2))
    } catch (err: any) {
      console.error(err)
    }
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'

async function main() {
  const hop = new Hop('goerli')
  const contractAddresses = await hop.getContractAddresses()
  console.log(contractAddresses)
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
        <Typography variant="h5">Get Contract Addresses</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get hub and spoke contract addresses used</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <Box mb={2} display="flex" justifyContent="center">
              <HighlightedButton fullWidth type="submit" variant="contained" size="large">Get</HighlightedButton>
            </Box>
          </form>
          {!!output && (
            <Box width="100%">
              <Box mb={2}>
                <Typography variant="body1">Output</Typography>
              </Box>
              <pre style={{
                width: '100%',
                wordBreak: 'break-all',
                whiteSpace: 'pre-wrap',
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
