import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { HighlightedButton } from '../HighlightedButton'
import { CustomTextArea } from '../CustomTextArea'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax'
import { useStyles } from '../useStyles'
import { useLocalStorageState } from '../../hooks/useLocalStorageState'
import { useShared } from '../shared'

type Props = {
  sdk: Hop
}

export function SetRpcProviders (props: Props) {
  const cacheKey = 'setRpcProviders'
  const { sdk } = props
  const styles = useStyles()
  const { hopInstantiateDisplayString } = useShared()
  const [copied, setCopied] = useState(false)
  const [configString, setConfigString] = useLocalStorageState('setRpcProviders:configString', {
    defaultValue: JSON.stringify({
      5: 'https://goerli.infura.io/v3/84842078b09946638c03157f83405213',
      420: 'https://goerli.optimism.io'
    }, null, 2),
  })

  const [result, setResult] = useLocalStorageState(`${cacheKey}:result`, {
    defaultValue: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setLoading(true)
      setResult('')

      const config = JSON.parse(configString)
      sdk.setProviders(config)
      setResult('set')
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'

async function main() {
  const rpcProviders = ${configString}

  ${hopInstantiateDisplayString}

  hop.setProviders(rpcProviders)
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
        <Typography variant="h5">Messenger - Set RPC Providers</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Set RPC Providers</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <Box mb={1}>
                <label>RPC Providers Config <small><em>(JSON)</em></small> <small><em>JSON Object with RPC providers config</em></small></label>
              </Box>
              <CustomTextArea minRows={5} maxRows={5} placeholder="{}" value={configString} onChange={(event: any) => setConfigString(event.target.value)} style={{ width: '100%' }} />
            </Box>
            <Box mb={2} display="flex" justifyContent="center">
              <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Set</HighlightedButton>
            </Box>
          </form>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!result && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="success">{result}</Alert>
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

export default SetRpcProviders
