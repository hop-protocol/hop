import React, { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from '../HighlightedButton'
import { CustomTextField } from '../CustomTextField'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax'
import { ChainSelect } from '../ChainSelect'
import { useStyles } from '../useStyles'
import { network, defaultChainIds, chainIds } from '../../config'
import { useLocalStorageState } from '../../hooks/useLocalStorageState'

type Props = {
  sdk: Hop
}

export function RailsGatewayGetTotalSent (props: Props) {
  const cacheKey = 'railsGatewayGetTotalSent'
  const { sdk } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useLocalStorageState(`${cacheKey}:fromChainId`, {
    defaultValue: defaultChainIds.from,
  })

  const [pathId, setPathId] = useLocalStorageState(`${cacheKey}:pathId`, {
    defaultValue: '',
  })
  const [totalSent, setTotalSent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const provider = useMemo(() => {
    return sdk.getRpcProviderForChainId(fromChainId)
  }, [sdk, fromChainId])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setTotalSent('')
      setLoading(true)
      const args = {
        chainId: fromChainId,
        pathId,
      }
      console.log('args', args)
      const total = await sdk.railsGateway.getTotalSent(args)
      setTotalSent(total?.toString())
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

  const hop = new Hop({ network: '${network}' })
  const totalSent = await hop.railsGateway.getTotalSent({
    chainId,
    pathId
  })
  console.log(totalSent)
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
        <Typography variant="h5">Rails Gateway - Get Total Sent</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get Rails Gateway Total Sent for Path ID</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Chain ID <small><em>(uint256)</em></small> <small><em>Chain to get total sent value for</em></small></label>
                </Box>
                <ChainSelect value={fromChainId} chains={chainIds} onChange={value => setFromChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Path ID <small><em>(bytes32)</em></small> <small><em>The path ID hex string</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={pathId} onChange={event => setPathId(event.target.value)} />
              </Box>

              <Box mb={2} display="flex" justifyContent="center">
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Get Total Sent</HighlightedButton>
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!totalSent && (
            <Box mb={4}>
              <Alert severity="info">{totalSent}</Alert>
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

export default RailsGatewayGetTotalSent
