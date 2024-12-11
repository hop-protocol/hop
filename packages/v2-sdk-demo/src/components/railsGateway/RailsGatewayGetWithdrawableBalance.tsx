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
import { defaultChainIds, chainIds } from '../../config'
import { useLocalStorageState } from '../../hooks/useLocalStorageState'
import { hopInstantiateDisplayString } from '../shared'

type Props = {
  sdk: Hop
}

export function RailsGatewayGetWithdrawableBalance (props: Props) {
  const cacheKey = 'railsGatewayGetWithdrawableBalance'
  const { sdk } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useLocalStorageState(`${cacheKey}:fromChainId`, {
    defaultValue: defaultChainIds.from,
  })

  const [pathId, setPathId] = useLocalStorageState(`${cacheKey}:pathId`, {
    defaultValue: '',
  })

  const [recipient, setRecipient] = useLocalStorageState(`${cacheKey}:recipient`, {
    defaultValue: '',
  })

  const [claimId, setClaimId] = useLocalStorageState(`${cacheKey}:claimId`, {
    defaultValue: '',
  })

  const [balance, setBalance] = useLocalStorageState(`${cacheKey}:balance`, {
    defaultValue: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setBalance('')
      setLoading(true)
      const args = {
        pathId,
        recipient,
        claimId
      }
      console.log('args', args)
      const balance = await sdk.getRailsGateway(fromChainId).getWithdrawableBalance(args)
      setBalance(balance?.toString())
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'

async function main() {
  const pathId = "${pathId}"
  const recipient = "${recipient}"
  const claimId = ${claimId}

  ${hopInstantiateDisplayString}
  const fee = await hop.getRailsGateway('${fromChainId}').getWithdrawableBalance({
    pathId,
    recipient,
    claimId
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
        <Typography variant="h5">Rails Gateway - Get Withdrawable Balance</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get Rails Gateway withdrawable balance for a recipient addres</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Chain ID <small><em>(uint256)</em></small> <small><em>Chain to get balance on</em></small></label>
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
                  <label>Recipient <small><em>(address)</em></small> <small><em>Recipient address</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={recipient} onChange={event => setRecipient(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Claim ID <small><em>(uint256)</em></small> <small><em>Claim ID</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={claimId} onChange={event => setClaimId(event.target.value)} />
              </Box>

              <Box mb={2} display="flex" justifyContent="center">
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Get Balance</HighlightedButton>
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!balance && (
            <Box mb={4}>
              <Alert severity="info">{balance}</Alert>
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

export default RailsGatewayGetWithdrawableBalance
