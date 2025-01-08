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

export function StakingRegistryGetWithdrawableBalance (props: Props) {
  const cacheKey = 'stakingRegistryGetWithdrawableBalance'
  const { sdk } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useLocalStorageState(`${cacheKey}:fromChainId`, {
    defaultValue: defaultChainIds.from,
  })

  const [staker, setStaker] = useLocalStorageState(`${cacheKey}:staker`, {
    defaultValue: '',
  })

  const [stakedBalance, setStakedBalance] = useLocalStorageState(`${cacheKey}:stakedBalance`, {
    defaultValue: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setStakedBalance('')
      setLoading(true)
      const args = {
        staker
      }
      console.log('args', args)
      const balance = await sdk.getRailsGateway(fromChainId).getStakingRegistry().getWithdrawableBalance(args)
      setStakedBalance(balance?.toString())
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'

async function main() {
  const staker = "${staker}"

  ${hopInstantiateDisplayString}
  const balance = await hop.getRailsGateway('${fromChainId}').getStakingRegistry().getWithdrawableBalance({
    staker
  })
  console.log(balance)
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
        <Typography variant="h5">Staking Registry - Get Withdrawable Balance</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get withdrawable balance</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Chain ID <small><em>(uint256)</em></small> <small><em>Chain to read from</em></small></label>
                </Box>
                <ChainSelect value={fromChainId} chains={chainIds} onChange={value => setFromChainId(value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Staker <small><em>(address)</em></small> <small><em>Staker address</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={staker} onChange={(event: any) => setStaker(event.target.value)} />
              </Box>

              <Box mb={2} display="flex" justifyContent="center">
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Get Withdrawable Balance</HighlightedButton>
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!stakedBalance && (
            <Box mb={4}>
              <Alert severity="info">{stakedBalance}</Alert>
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

export default StakingRegistryGetWithdrawableBalance
