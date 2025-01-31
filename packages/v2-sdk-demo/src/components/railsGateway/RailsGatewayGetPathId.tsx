import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from '../HighlightedButton'
import { CustomTextField } from '../CustomTextField'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax'
import { ChainSelect } from '../ChainSelect'
import { useStyles } from '../useStyles'
import { useLocalStorageState } from '../../hooks/useLocalStorageState'
import { useShared } from '../shared'

type Props = {
  sdk: Hop
}

export function RailsGatewayGetPathId (props: Props) {
  const cacheKey = 'railsGatewayGetPathId'
  const { sdk } = props
  const styles = useStyles()
  const { hopInstantiateDisplayString, defaultChainIds, chainIds } = useShared()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useLocalStorageState(`${cacheKey}:fromChainId`, {
    defaultValue: defaultChainIds.from,
  })

  const [toChainId, setToChainId] = useLocalStorageState(`${cacheKey}:toChainId`, {
    defaultValue: defaultChainIds.to,
  })

  const [fromToken, setFromToken] = useLocalStorageState(`${cacheKey}:fromToken`, {
    defaultValue: '',
  })

  const [toToken, setToToken] = useLocalStorageState(`${cacheKey}:toToken`, {
    defaultValue: '',
  })

  const [pathId, setPathId] = useLocalStorageState(`${cacheKey}:pathId`, {
    defaultValue: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setPathId('')
      setLoading(true)
      const args = {
        chainId0: fromChainId,
        token0: fromToken,
        chainId1: toChainId,
        token1: toToken,
      }
      console.log('args', args)
      const pathId = await sdk.getRailsGateway(fromChainId).getPathId(args)
      setPathId(pathId)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'

async function main() {
  const chainId0 = "${fromChainId}"
  const token0 = "${fromToken}"
  const chainId1 = "${toChainId}"
  const token1 = "${toToken}"

  ${hopInstantiateDisplayString}
  const pathId = await hop.getRailsGateway('${fromChainId}').getPathId({
    chainId0,
    token0,
    chainId1,
    token1
  })
  console.log(pathId)
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
        <Typography variant="h5">Rails Gateway - Get Path ID</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get Rails Gateway Path ID</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>From Chain ID <small><em>(uint256)</em></small> <small><em>This is the origin chain</em></small></label>
                </Box>
                <ChainSelect value={fromChainId} chains={chainIds} onChange={value => setFromChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>From Token <small><em>(address)</em></small> <small><em>Origin chain token address</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={fromToken} onChange={event => setFromToken(event.target.value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>To Chain ID <small><em>(uint256)</em></small> <small><em>This is the destination chain</em></small></label>
                </Box>
                <ChainSelect value={toChainId} chains={chainIds} onChange={value => setToChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>To Token <small><em>(address)</em></small> <small><em>Destination chain token address</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={toToken} onChange={event => setToToken(event.target.value)} />
              </Box>

              <Box mb={2} display="flex" justifyContent="center">
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Get Path ID</HighlightedButton>
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!pathId && (
            <Box mb={4}>
              <Alert severity="info">Path ID: {pathId}</Alert>
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

export default RailsGatewayGetPathId
