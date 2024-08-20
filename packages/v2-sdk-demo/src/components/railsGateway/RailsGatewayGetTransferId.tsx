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
import { network, defaultChainIds, chainIds } from '../../config'
import { useLocalStorageState } from '../../hooks/useLocalStorageState'

type Props = {
  sdk: Hop
}

export function RailsGatewayGetTransferId (props: Props) {
  const cacheKey = 'railsGatewayGetTransferId'
  const { sdk } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useLocalStorageState(`${cacheKey}:fromChainId`, {
    defaultValue: defaultChainIds.from,
  })

  const [pathId, setPathId] = useLocalStorageState(`${cacheKey}:pathId`, {
    defaultValue: '',
  })

  const [toAddress, setToAddress] = useLocalStorageState(`${cacheKey}:toAddress`, {
    defaultValue: '',
  })

  const [adjustedAmount, setAdjustedAmount] = useLocalStorageState(`${cacheKey}:adjustedAmount`, {
    defaultValue: '',
  })

  const [minAmountOut, setMinAmountOut] = useLocalStorageState(`${cacheKey}:minAmountOut`, {
    defaultValue: '',
  })

  const [totalSent, setTotalSent] = useLocalStorageState(`${cacheKey}:totalSent`, {
    defaultValue: '',
  })

  const [nonce, setNonce] = useLocalStorageState(`${cacheKey}:nonce`, {
    defaultValue: '',
  })

  const [attestedCheckpoint, setAttestedCheckpoint] = useLocalStorageState(`${cacheKey}:attestedCheckpoint`, {
    defaultValue: '',
  })
  const [transferId, setTransferId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setTransferId('')
      setLoading(true)
      const args = {
        chainId: fromChainId,
        pathId,
        to: toAddress,
        adjustedAmount,
        minAmountOut,
        totalSent,
        nonce,
        attestedCheckpoint
      }

      console.log('args', args)
      const transferId = await sdk.railsGateway.getTransferId(args)
      setTransferId(transferId)
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
  const to = "${toAddress}"
  const adjustedAmount = "${adjustedAmount}"
  const minAmountOut = "${minAmountOut}"
  const totalSent = "${totalSent}"
  const nonce = "${nonce}"
  const attestedCheckpoint = "${attestedCheckpoint}"

  const hop = new Hop({ network: '${network}' })
  const transferId = await hop.railsGateway.getTransferId({
    chainId,
    pathId,
    to,
    adjustedAmount,
    minAmountOut,
    totalSent,
    nonce,
    attestedCheckpoint
  })
  console.log(transferId)
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
        <Typography variant="h5">Rails Gateway - Get Transfer ID</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get Rails Gateway Transfer ID</Typography>
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
                  <label>Path ID <small><em>(bytes32)</em></small> <small><em>The path ID hex string</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={pathId} onChange={event => setPathId(event.target.value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>To <small><em>(address)</em></small> <small><em>To address</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={toAddress} onChange={event => setToAddress(event.target.value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Adjusted Amount <small><em>(uint256)</em></small> <small><em>Adjusted amount</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={adjustedAmount} onChange={event => setAdjustedAmount(event.target.value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Min Amount Out <small><em>(uint256)</em></small> <small><em>Min amount out</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={minAmountOut} onChange={event => setMinAmountOut(event.target.value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Total Sent <small><em>(uint256)</em></small> <small><em>Total sent value</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={totalSent} onChange={event => setTotalSent(event.target.value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Nonce <small><em>(uint256)</em></small> <small><em>Nonce value</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={nonce} onChange={event => setNonce(event.target.value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Attested Checkpoint <small><em>(bytes32)</em></small> <small><em>Attested checkpoint hex string</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={attestedCheckpoint} onChange={event => setAttestedCheckpoint(event.target.value)} />
              </Box>

              <Box mb={2} display="flex" justifyContent="center">
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Get Transfer ID</HighlightedButton>
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!transferId && (
            <Box mb={4}>
              <Alert severity="info">{transferId}</Alert>
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

export default RailsGatewayGetTransferId
