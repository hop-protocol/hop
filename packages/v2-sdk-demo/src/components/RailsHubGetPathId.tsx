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

export function RailsHubGetPathId (props: Props) {
  const cacheKey = 'railsHubGetPathId'
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
  const [toChainId, setToChainId] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:toChainId`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return defaultChainIds.to
  })
  const [fromToken, setFromToken] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:fromToken`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [toToken, setToToken] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:toToken`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [pathId, setPathId] = useState('')
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
      localStorage.setItem(`${cacheKey}:toChainId`, toChainId)
    } catch (err: any) {
      console.error(err)
    }
  }, [toChainId])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:fromToken`, fromToken)
    } catch (err: any) {
      console.error(err)
    }
  }, [fromToken])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:toToken`, toToken)
    } catch (err: any) {
      console.error(err)
    }
  }, [toToken])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setPathId('')
      setLoading(true)
      const args = {
        chainId0: Number(fromChainId),
        token0: fromToken,
        chainId1: Number(toChainId),
        token1: toToken,
      }
      console.log('args', args)
      const pathId = await sdk.railsHub.getPathId(args)
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
  const chainId0 = ${fromChainId || 'undefined'}
  const token0 = "${fromToken}"
  const chainId1 = ${toChainId || 'undefined'}
  const token1 = "${toToken}"

  const hop = new Hop({ network: '${network}' })
  const pathId = await hop.railsHub.getPathId({
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
        <Typography variant="h5">Rails Hub - Get Path ID</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get Rails Hub Path ID</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>From Chain ID <small><em>(number)</em></small> <small><em>This is the origin chain</em></small></label>
                </Box>
                <ChainSelect value={fromChainId} chains={chainIds} onChange={value => setFromChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>From Token<small><em>(address)</em></small> <small><em>Origin chain token address</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={fromToken} onChange={event => setFromToken(event.target.value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>To Chain ID <small><em>(number)</em></small> <small><em>This is the destination chain</em></small></label>
                </Box>
                <ChainSelect value={toChainId} chains={chainIds} onChange={value => setToChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>To Token<small><em>(address)</em></small> <small><em>Destination chain token address</em></small></label>
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
