import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from '../HighlightedButton.js'
import { CustomTextField } from '../CustomTextField.js'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax.js'
import { ChainSelect } from '../ChainSelect.js'
import { useStyles } from '../useStyles.js'
import { useLocalStorageState } from '../../hooks/useLocalStorageState.js'
import { useShared } from '../shared.js'

type Props = {
  sdk: Hop
}

export function RailsGatewayGetInitialReserveByTokenAddress (props: Props) {
  const cacheKey = 'railsGatewayGetInitialReserveByTokenAddress'
  const { sdk } = props
  const styles = useStyles()
  const { hopInstantiateDisplayString, defaultChainIds, chainIds } = useShared()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useLocalStorageState(`${cacheKey}:fromChainId`, {
    defaultValue: defaultChainIds.from,
  })

  const [tokenAddress, setTokenAddress] = useLocalStorageState(`${cacheKey}:tokenAddress`, {
    defaultValue: '',
  })

  const [initialReserve, setInitialReserve] = useLocalStorageState(`${cacheKey}:initialReserve`, {
    defaultValue: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setInitialReserve('')
      setLoading(true)
      const args = {
        tokenAddress,
      }
      console.log('args', args)
      const reserve = await sdk.getRailsGateway(fromChainId).helpers.getInitialReserveByTokenAddress(args)
      setInitialReserve(reserve?.toString())
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'

async function main() {
  const tokenAddress = "${tokenAddress}"

  ${hopInstantiateDisplayString}
  const initialReserve = await hop.getRailsGateway('${fromChainId}').helpers.getInitialReserveByTokenAddress({
    tokenAddress
  })
  console.log(initialReserve)
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
        <Typography variant="h5">Rails Gateway - Get Initial Reserve By Token Address</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get Rails Gateway Initial Reserve for Token Address</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Chain ID <small><em>(uint256)</em></small> <small><em>Chain to get initial reserve value for</em></small></label>
                </Box>
                <ChainSelect value={fromChainId} chains={chainIds} onChange={value => setFromChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Token Address <small><em>(address)</em></small> <small><em>The token address to get initial reserve for</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={tokenAddress} onChange={event => setTokenAddress(event.target.value)} />
              </Box>

              <Box mb={2} display="flex" justifyContent="center">
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Get Initial Reserve</HighlightedButton>
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!initialReserve && (
            <Box mb={4}>
              <Alert severity="success">Initial Reserve: {initialReserve}</Alert>
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

export default RailsGatewayGetInitialReserveByTokenAddress 