import React, { useState, useEffect, useMemo } from 'react'
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

type Props = {
  sdk: Hop
}

export function RailsGatewayGetIsCheckpointValid (props: Props) {
  const cacheKey = 'railsGatewayGetIsCheckpointValid'
  const { sdk } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:fromChainId`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return defaultChainIds.from
  })
  const [pathId, setPathId] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:pathId`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [checkpoint, setCheckpoint] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:checkpoint`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [isCheckpointValid, setIsCheckpointValid] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const provider = useMemo(() => {
    return sdk.getRpcProviderForChainId(fromChainId)
  }, [sdk, fromChainId])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:fromChainId`, fromChainId)
    } catch (err: any) {
      console.error(err)
    }
  }, [fromChainId])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:pathId`, pathId)
    } catch (err: any) {
      console.error(err)
    }
  }, [pathId])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:checkpoint`, checkpoint)
    } catch (err: any) {
      console.error(err)
    }
  }, [checkpoint])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setIsCheckpointValid('')
      setLoading(true)
      const args = {
        chainId: fromChainId,
        pathId,
        checkpoint
      }

      console.log('args', args)
      const isCheckpointValid = await sdk.railsGateway.getIsCheckpointValid(args)
      setIsCheckpointValid(`${isCheckpointValid}`)
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
  const checkpoint = "${checkpoint}"

  const hop = new Hop({ network: '${network}' })
  const isCheckpoinValid = await hop.railsGateway.getIsCheckpointValid({
    chainId,
    pathId,
    checkpoint
  })
  console.log(isCheckpoinValid)
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
        <Typography variant="h5">Rails Gateway - Is Checkpoint Valid</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get Rails Gateway Is Checkpoint Valid</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Chain ID <small><em>(uint256)</em></small> <small><em>Chain to get fee for</em></small></label>
                </Box>
                <ChainSelect value={fromChainId} chains={chainIds} onChange={value => setFromChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Path ID<small><em>(bytes32)</em></small> <small><em>The path ID</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={pathId} onChange={event => setPathId(event.target.value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Checkpoint <small><em>(bytes32)</em></small> <small><em>The checkpoint hash</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={checkpoint} onChange={event => setCheckpoint(event.target.value)} />
              </Box>

              <Box mb={2} display="flex" justifyContent="center">
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Is Checkpoint Valid</HighlightedButton>
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!isCheckpointValid && (
            <Box mb={4}>
              <Alert severity="info">{isCheckpointValid}</Alert>
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
