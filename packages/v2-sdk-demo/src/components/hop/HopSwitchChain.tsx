import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Signer, providers } from 'ethers'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from '../HighlightedButton'
import { useInterval } from 'react-use'
import { CustomTextField } from '../CustomTextField'
import { CustomTextArea } from '../CustomTextArea'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax'
import { ChainSelect } from '../ChainSelect'
import { useStyles } from '../useStyles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { AbiMethodForm } from '../AbiMethodForm'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { network, defaultChainIds, chainIds } from '../../config'

type Props = {
  signer?: Signer
  sdk: Hop
  checkConnectedNetworkId: any
  requestWallet: any
}

export function HopSwitchChain (props: Props) {
  const cacheKey = 'hopSwitchChain'
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
  const [connectedChainId, setConnectedChainId] = useState('')
  const [txData, setTxData] = useState('')
  const [populateTxDataOnly, setPopulateTxDataOnly] = useState(true)
  const [txHash, setTxHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:fromChainId`, fromChainId)
    } catch (err: any) {
      console.error(err)
    }
  }, [fromChainId])

  const updateConnectedChainId = async () => {
    try {
      if (signer) {
        const { chainId } = await signer.provider.getNetwork()
        setConnectedChainId(chainId.toString())
      } else {
        setConnectedChainId('')
      }
    } catch (err) {
      console.error(err)
      setConnectedChainId('')
    }
  }

  const updateConnectedChainIdCb = useCallback(updateConnectedChainId, [updateConnectedChainId])

  useEffect(() => {
    if (signer) {
      updateConnectedChainIdCb().catch(console.error)
    }
  }, [signer, updateConnectedChainIdCb])

  useInterval(updateConnectedChainId, 5 * 1000)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setTxData('')
      setTxHash('')
      setLoading(true)
      if (!signer) {
        throw new Error('No signer')
      }

      console.log('chainId to switch to', fromChainId)
      await sdk.connect(signer).switchChain(fromChainId)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'
import { ethers } from 'ethers'

async function main() {
  const chainId = ${fromChainId || 'undefined'}

  const hop = new Hop({ network: '${network}' })
  const signer = new ethers.providers.Web3Provider(
    window.ethereum
  )
  await hop.connect(signer).switchChain(chainId)
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
        <Typography variant="h5">Hop - Switch Chain</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Switch the connected chain on wallet</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Connected Chain ID</label>
                </Box>
                <Box>
                  {connectedChainId}
                </Box>
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Chain ID <small><em>(number)</em></small> <small><em>The chain ID to switch to</em></small></label>
                </Box>
                <ChainSelect value={fromChainId} chains={chainIds} onChange={value => setFromChainId(value)} />
              </Box>

              <Box mb={2} display="flex" justifyContent="center">
                {!signer && (
                  <HighlightedButton fullWidth variant="contained" size="large" onClick={() => requestWallet()}>Connect Wallet</HighlightedButton>
                )}
                {!!signer && (
                  <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Switch Chain</HighlightedButton>
                )}
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
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
