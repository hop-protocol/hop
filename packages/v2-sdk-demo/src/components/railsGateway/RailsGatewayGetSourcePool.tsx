import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from '../HighlightedButton.js'
import { CustomTextField } from '../CustomTextField.js'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax.js'
import { useStyles } from '../useStyles.js'
import { useLocalStorageState } from '../../hooks/useLocalStorageState.js'
import { useShared } from '../shared.js'
import { ChainSelect } from '../ChainSelect.js'

type Props = {
  sdk: Hop
}

export function RailsGatewayGetSourcePool (props: Props) {
  const cacheKey = 'railsGatewayGetSourcePool'
  const { sdk } = props
  const styles = useStyles()
  const { hopInstantiateDisplayString, defaultChainIds, chainIds } = useShared()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useLocalStorageState(`${cacheKey}:fromChainId`, {
    defaultValue: defaultChainIds.from,
  })
  const [pathId, setPathId] = useLocalStorageState(`${cacheKey}:pathId`, {
    defaultValue: '',
  })
  const [attestedClaimId, setAttestedClaimId] = useLocalStorageState(`${cacheKey}:attestedClaimId`, {
    defaultValue: '',
  })
  const [sourcePool, setSourcePool] = useLocalStorageState(`${cacheKey}:sourcePool`, {
    defaultValue: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setSourcePool('')
      setLoading(true)
      const args = {
        pathId,
        attestedClaimId
      }
      console.log('args', args)
      const railsGateway = sdk.getRailsGateway(fromChainId)
      const pool = await railsGateway.helpers.getSourcePool(args)
      setSourcePool(pool?.toString())
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
  const pathId = "${pathId}"
  const attestedClaimId = "${attestedClaimId}"

  ${hopInstantiateDisplayString}
  const railsGateway = hop.getRailsGateway(chainId)
  const sourcePool = await railsGateway.helpers.getSourcePool({
    pathId,
    attestedClaimId
  })
  console.log(sourcePool)
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
        <Typography variant="h5">Rails Gateway - Get Source Pool</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get the source pool value for a given path ID and attested claim ID</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Chain ID <small><em>(uint256)</em></small> <small><em>Chain to get source pool from</em></small></label>
                </Box>
                <ChainSelect value={fromChainId} chains={chainIds} onChange={value => setFromChainId(value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Path ID <small><em>(bytes32)</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x123..." value={pathId} onChange={event => setPathId(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Attested Claim ID <small><em>(bytes32)</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x123..." value={attestedClaimId} onChange={event => setAttestedClaimId(event.target.value)} />
              </Box>

              <Box mb={2} display="flex" justifyContent="center">
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Get Source Pool</HighlightedButton>
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!sourcePool && (
            <Box mb={4}>
              <Alert severity="success">Source Pool: {sourcePool}</Alert>
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

export default RailsGatewayGetSourcePool 