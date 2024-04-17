import React, { useState, useEffect, useMemo } from 'react'
import { Signer, providers } from 'ethers'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from './HighlightedButton'
import { CustomTextField } from './CustomTextField'
import { CustomTextArea } from './CustomTextArea'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from './Syntax'
import { ChainSelect } from './ChainSelect'
import { useStyles } from './useStyles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { AbiMethodForm } from './AbiMethodForm'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { network, defaultChainIds, chainIds } from '../config'

type Props = {
  signer?: Signer
  sdk: Hop
  checkConnectedNetworkId: any
  requestWallet: any
}

export function RailsHubGetFee (props: Props) {
  const cacheKey = 'railsHubGetFee'
  const { signer, sdk, checkConnectedNetworkId, requestWallet } = props
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
  const [fee, setFee] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const provider = useMemo(() => {
    return sdk.getRpcProviderForChainId(Number(fromChainId))
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setFee('')
      setLoading(true)
      const args = {
        chainId: Number(fromChainId),
        pathId
      }
      console.log('args', args)
      const fee = await sdk.railsHub.getFee(args)
      setFee(fee?.toString())
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'

async function main() {
  const chainId = ${fromChainId || 'undefined'}
  const pathId = "${pathId}"

  const hop = new Hop({ network: '${network}' })
  const fee = await hop.railsHub.getFee({
    chainId,
    pathId
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
        <Typography variant="h5">Rails Hub - Get Fee</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get Rails Hub Fee</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Chain ID <small><em>(number)</em></small> <small><em>Chain to get fee for</em></small></label>
                </Box>
                <ChainSelect value={fromChainId} chains={chainIds} onChange={value => setFromChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Path ID<small><em>(hex)</em></small> <small><em>The path ID hex string</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={pathId} onChange={event => setPathId(event.target.value)} />
              </Box>

              <Box mb={2} display="flex" justifyContent="center">
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Get Fee</HighlightedButton>
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
              <Alert severity="info">{fee}</Alert>
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
